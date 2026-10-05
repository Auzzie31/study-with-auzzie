import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SyllabusView } from './components/SyllabusView';
import { TimerView } from './components/TimerView';
import { NotesView } from './components/NotesView';
import { DoubtSolverView } from './components/DoubtSolverView';
import { MockTestView } from './components/MockTestView';
import { ConsistencyCalendarView } from './components/ConsistencyCalendarView';
import { FormulaSheetModal } from './components/FormulaSheetModal';
import { AddTopicModal } from './components/AddTopicModal';
import { Chapter, StudyGoal, StudyNote, StudySession, SubjectId, Topic, TopicStatus } from './types';
import { INITIAL_CHAPTERS } from './data/curriculum';
import {
  loadCurriculum,
  saveCurriculum,
  loadStudySessions,
  addStudySession,
  deleteStudySession,
  loadNotes,
  saveNotes,
  loadGoal,
  saveGoal,
  resetAllToZero,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [chapters, setChapters] = useState<Chapter[]>(() => loadCurriculum());
  const [sessions, setSessions] = useState<StudySession[]>(() => loadStudySessions());
  const [notes, setNotes] = useState<StudyNote[]>(() => loadNotes());
  const [goal, setGoal] = useState<StudyGoal>(() => loadGoal());

  // Global persistent timer state across tabs (Default: 1 Hour = 3600 seconds)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState(60 * 60);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(60 * 60);
  const [activeTimerTopic, setActiveTimerTopic] = useState<Topic | null>(() => {
    const all = loadCurriculum().flatMap((c) => c.topics);
    return all.find((t) => t.status === 'in_progress') || all[0] || null;
  });

  // Modals state
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [addTopicSubject, setAddTopicSubject] = useState<SubjectId>('physics');
  const [syllabusSubjectFilter, setSyllabusSubjectFilter] = useState<SubjectId | undefined>(undefined);
  const [notesInitialTopicId, setNotesInitialTopicId] = useState<string | undefined>(undefined);

  // Sync state to local storage when changed
  const handleUpdateTopicStatus = (topicId: string, status: TopicStatus) => {
    const updated = chapters.map((chap) => ({
      ...chap,
      topics: chap.topics.map((t) => (t.id === topicId ? { ...t, status } : t)),
    }));
    setChapters(updated);
    saveCurriculum(updated);
  };

  const handleUpdateTopicConfidence = (topicId: string, confidence: number) => {
    const updated = chapters.map((chap) => ({
      ...chap,
      topics: chap.topics.map((t) => (t.id === topicId ? { ...t, confidence } : t)),
    }));
    setChapters(updated);
    saveCurriculum(updated);
  };

  const handleLaunchTimerForTopic = (topic: Topic) => {
    setActiveTimerTopic(topic);
    setActiveTab('timer');
  };

  const handleOpenNotesForTopic = (topic: Topic) => {
    setNotesInitialTopicId(topic.id);
    setActiveTab('notes');
  };

  const handleLogSession = (session: StudySession) => {
    const updatedSessions = addStudySession(session);
    setSessions(updatedSessions);
    // Reload chapters because addStudySession updates topic minutesSpent and revisionCount
    setChapters(loadCurriculum());
  };

  const handleDeleteSession = (sessionId: string) => {
    const updated = deleteStudySession(sessionId);
    setSessions(updated);
  };

  const handleSaveNote = (note: StudyNote) => {
    const exists = notes.some((n) => n.id === note.id);
    let updated: StudyNote[];
    if (exists) {
      updated = notes.map((n) => (n.id === note.id ? note : n));
    } else {
      updated = [note, ...notes];
    }
    setNotes(updated);
    saveNotes(updated);
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    saveNotes(updated);
  };

  const handleAddTopic = (newTopic: Topic) => {
    const updated = chapters.map((chap) => {
      if (chap.id === newTopic.chapterId) {
        return {
          ...chap,
          topics: [...chap.topics, newTopic],
        };
      }
      return chap;
    });
    setChapters(updated);
    saveCurriculum(updated);
  };

  const handleAddChapter = (newChapter: Chapter) => {
    const updated = [...chapters, newChapter];
    setChapters(updated);
    saveCurriculum(updated);
  };

  const handleOpenAddTopicModal = (subjectId: SubjectId) => {
    setAddTopicSubject(subjectId);
    setIsAddTopicModalOpen(true);
  };

  const handleNavigateToSyllabus = (subjectId?: SubjectId) => {
    setSyllabusSubjectFilter(subjectId);
    setActiveTab('syllabus');
  };

  const handleResetAll = () => {
    resetAllToZero();
    setChapters(INITIAL_CHAPTERS);
    setSessions([]);
    setNotes([]);
    setIsTimerRunning(false);
    setTimerSecondsRemaining(60 * 60);
    setTotalSessionSeconds(60 * 60);
    setActiveTimerTopic(INITIAL_CHAPTERS[0]?.topics[0] || null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFormulas={() => setIsFormulaModalOpen(true)}
        onResetAllToZero={handleResetAll}
        activeTimerRunning={isTimerRunning}
        timerSecondsRemaining={timerSecondsRemaining}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            chapters={chapters}
            sessions={sessions}
            goal={goal}
            onNavigateToSyllabus={handleNavigateToSyllabus}
            onLaunchTimerForTopic={handleLaunchTimerForTopic}
            onOpenNotesForTopic={handleOpenNotesForTopic}
            onOpenCalendar={() => setActiveTab('calendar')}
            onOpenMockTests={() => setActiveTab('tests')}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusView
            chapters={chapters}
            onUpdateTopicStatus={handleUpdateTopicStatus}
            onUpdateTopicConfidence={handleUpdateTopicConfidence}
            onLaunchTimerForTopic={handleLaunchTimerForTopic}
            onOpenNotesForTopic={handleOpenNotesForTopic}
            onOpenAddTopicModal={handleOpenAddTopicModal}
            initialSubjectFilter={syllabusSubjectFilter}
          />
        )}

        {activeTab === 'timer' && (
          <TimerView
            chapters={chapters}
            selectedTopic={activeTimerTopic}
            onSelectTopic={setActiveTimerTopic}
            onLogSession={handleLogSession}
            recentSessions={sessions}
            onDeleteSession={handleDeleteSession}
            isRunning={isTimerRunning}
            setIsRunning={setIsTimerRunning}
            secondsRemaining={timerSecondsRemaining}
            setSecondsRemaining={setTimerSecondsRemaining}
            totalSessionSeconds={totalSessionSeconds}
            setTotalSessionSeconds={setTotalSessionSeconds}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            chapters={chapters}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            initialTopicId={notesInitialTopicId}
          />
        )}

        {activeTab === 'doubts' && (
          <DoubtSolverView
            onSaveToNotes={handleSaveNote}
            defaultSubject={syllabusSubjectFilter || 'physics'}
          />
        )}

        {activeTab === 'tests' && (
          <MockTestView
            chapters={chapters}
            onSaveToNotes={handleSaveNote}
            defaultSubjectId={syllabusSubjectFilter}
          />
        )}

        {activeTab === 'calendar' && (
          <ConsistencyCalendarView
            chapters={chapters}
            sessions={sessions}
            onLaunchTimerForTopic={handleLaunchTimerForTopic}
            onOpenNotesForTopic={handleOpenNotesForTopic}
          />
        )}
      </main>

      {/* Floating Ask Auzzie Button (when on other tabs) */}
      {activeTab !== 'doubts' && (
        <button
          onClick={() => setActiveTab('doubts')}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Ask Auzzie AI</span>
        </button>
      )}

      {/* Formula Sheet Reference Modal */}
      <FormulaSheetModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
      />

      {/* Custom Topic / Chapter Creation Modal */}
      <AddTopicModal
        isOpen={isAddTopicModalOpen}
        onClose={() => setIsAddTopicModalOpen(false)}
        chapters={chapters}
        onAddTopic={handleAddTopic}
        onAddChapter={handleAddChapter}
        defaultSubjectId={addTopicSubject}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            <span>Study with Auzzie · Class 9 Physics, Chemistry & Mathematics</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFormulaModalOpen(true)}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Formula Cheatsheet
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('calendar')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Consistency Matrix
            </button>
            <span aria-hidden="true">·</span>
            <span>Local Storage Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
