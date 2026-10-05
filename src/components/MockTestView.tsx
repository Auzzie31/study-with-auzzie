import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flag,
  FileCheck,
  BookmarkPlus,
  Check,
  ListFilter,
  BarChart3,
  Play,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Chapter, MockQuestion, MockTestAttempt, StudyNote, SubjectId } from '../types';
import { MOCK_QUESTIONS } from '../data/mockQuestions';
import { loadMockAttempts, saveMockAttempt } from '../utils/storage';

interface MockTestViewProps {
  chapters: Chapter[];
  onSaveToNotes: (note: StudyNote) => void;
  defaultSubjectId?: SubjectId;
}

export const MockTestView: React.FC<MockTestViewProps> = ({
  chapters,
  onSaveToNotes,
  defaultSubjectId,
}) => {
  // Navigation / View modes
  const [testState, setTestState] = useState<'setup' | 'in_progress' | 'results'>('setup');
  const [activeTab, setActiveTab] = useState<'new_test' | 'history'>('new_test');

  // Test setup config
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>(defaultSubjectId || 'all');
  const [selectedChapterId, setSelectedChapterId] = useState<'all' | string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerMinutes, setTimerMinutes] = useState<number>(15);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Active Test State
  const [currentQuestions, setCurrentQuestions] = useState<MockQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [qId: string]: boolean }>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(15 * 60);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState<number>(15 * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Test Result State
  const [lastAttempt, setLastAttempt] = useState<MockTestAttempt | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [historyAttempts, setHistoryAttempts] = useState<MockTestAttempt[]>(() => loadMockAttempts());

  // Filter available chapters by selected subject
  const availableChapters =
    selectedSubject === 'all'
      ? chapters
      : chapters.filter((c) => c.subjectId === selectedSubject);

  // Test countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (testState === 'in_progress' && timerMinutes > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleCompleteTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testState, timerMinutes]);

  // Start test using curated local question bank
  const handleStartStandardTest = () => {
    let pool = [...MOCK_QUESTIONS];

    if (selectedSubject !== 'all') {
      pool = pool.filter((q) => q.subjectId === selectedSubject);
    }

    if (selectedChapterId !== 'all') {
      pool = pool.filter((q) => q.chapterId === selectedChapterId);
    }

    if (pool.length === 0) {
      pool = [...MOCK_QUESTIONS];
    }

    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    launchTestWithQuestions(selected);
  };

  // Start test generating questions dynamically via Gemini 3.8 Flash AI
  const handleStartAiTest = async () => {
    setIsAiGenerating(true);
    setAiError(null);

    const chapterObj = chapters.find((c) => c.id === selectedChapterId);
    const chapterName = chapterObj ? chapterObj.title : 'All Chapters';

    try {
      const res = await fetch('/api/generate-mock-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject === 'all' ? undefined : selectedSubject,
          chapterTitle: selectedChapterId === 'all' ? undefined : chapterName,
          count: questionCount,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        const formatted: MockQuestion[] = data.questions.map((q: any, i: number) => ({
          id: `ai-q-${Date.now()}-${i}`,
          subjectId: (q.subjectId as SubjectId) || (selectedSubject === 'all' ? 'mathematics' : selectedSubject),
          chapterTitle: q.chapterTitle || chapterName,
          question: q.question,
          options: q.options && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
          explanation: q.explanation || 'Step-by-step NCERT reasoning.',
          difficulty: 'medium',
        }));

        launchTestWithQuestions(formatted);
      } else {
        throw new Error('AI returned an empty question list');
      }
    } catch (err: any) {
      console.warn('AI generation error, falling back to curated bank:', err);
      setAiError(err.message || 'Failed to generate with AI. Starting standard question bank instead.');
      setTimeout(() => {
        handleStartStandardTest();
      }, 1000);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const launchTestWithQuestions = (questions: MockQuestion[]) => {
    setCurrentQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    const totalSecs = timerMinutes > 0 ? timerMinutes * 60 : 0;
    setTotalTimeSeconds(totalSecs);
    setTimeRemainingSeconds(totalSecs);
    setShowSubmitConfirm(false);
    setTestState('in_progress');
  };

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = currentQuestions[currentIndex];
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleToggleFlag = () => {
    const currentQ = currentQuestions[currentIndex];
    if (!currentQ) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleCompleteTest = () => {
    setShowSubmitConfirm(false);
    let correctCount = 0;
    currentQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const elapsedSeconds = timerMinutes > 0 ? totalTimeSeconds - timeRemainingSeconds : 0;
    const pct = currentQuestions.length > 0 ? Math.round((correctCount / currentQuestions.length) * 100) : 0;

    const chapterObj = chapters.find((c) => c.id === selectedChapterId);
    const testTitle =
      selectedChapterId !== 'all' && chapterObj
        ? `${chapterObj.title} MCQ Mock Test`
        : selectedSubject !== 'all'
        ? `${selectedSubject.toUpperCase()} Comprehensive Mock Test`
        : 'Class 9 STEM Grand Mock Test';

    const attempt: MockTestAttempt = {
      id: `attempt-${Date.now()}`,
      title: testTitle,
      subjectId: selectedSubject,
      chapterTitle: chapterObj?.title,
      totalQuestions: currentQuestions.length,
      score: correctCount,
      percentage: pct,
      timeSpentSeconds: elapsedSeconds,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      userAnswers,
      questions: currentQuestions,
    };

    const updatedHistory = saveMockAttempt(attempt);
    setHistoryAttempts(updatedHistory);
    setLastAttempt(attempt);
    setTestState('results');
  };

  const handleSaveQuestionToNotes = (q: MockQuestion, userAns?: number) => {
    const correctLetter = ['A', 'B', 'C', 'D'][q.correctIndex];
    const userLetter = typeof userAns === 'number' ? ['A', 'B', 'C', 'D'][userAns] : 'Skipped';

    const noteContent = `# Mock Test Solution: ${q.chapterTitle}

## Question:
${q.question}

## Options:
${q.options.map((opt, i) => `- **${['A', 'B', 'C', 'D'][i]}**: ${opt}`).join('\n')}

---

## Result:
- **Your Answer**: Option ${userLetter}
- **Correct Answer**: Option ${correctLetter} (${q.options[q.correctIndex]})

---

## Detailed Step-by-Step Explanation:
${q.explanation}
`;

    const newNote: StudyNote = {
      id: `test-note-${Date.now()}`,
      title: `MCQ Solution: ${q.question.slice(0, 45)}...`,
      subjectId: q.subjectId,
      content: noteContent,
      tags: ['Class9', 'MockTest', q.subjectId, 'SolvedMCQ'],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveToNotes(newNote);
    setSavedNoteId(q.id);
    setTimeout(() => setSavedNoteId(null), 2000);
  };

  const formatTimerMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // =========================================================================
  // VIEW: 1. SETUP TEST
  // =========================================================================
  if (testState === 'setup') {
    return (
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>MCQ Examination Engine</span>
              <span aria-hidden="true">·</span>
              <span>Class 9 Physics, Chemistry & Mathematics</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              MCQ Mock Test Hub
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('new_test')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'new_test'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Mock Test
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Past Attempts ({historyAttempts.length})
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'new_test' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Setup Form (2 cols) */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Test Parameters
                </h2>

                {/* 1. Subject Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    1. Select Subject Focus
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'all', label: 'All Subjects' },
                      { id: 'physics', label: 'Physics' },
                      { id: 'chemistry', label: 'Chemistry' },
                      { id: 'mathematics', label: 'Math' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedSubject(item.id as any);
                          setSelectedChapterId('all');
                        }}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          selectedSubject === item.id
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Chapter Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    2. Choose Chapter (or All Chapters in Subject)
                  </label>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="all">Entire Curriculum ({availableChapters.length} Chapters Combined)</option>
                    {availableChapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.subjectId.toUpperCase()}: Ch {ch.number} - {ch.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Number of MCQs */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    3. Number of Questions
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuestionCount(num)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          questionCount === num
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {num} MCQs
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Timer Option */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    4. Exam Time Limit
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { mins: 0, label: 'Untimed' },
                      { mins: 5, label: '5 Mins' },
                      { mins: 10, label: '10 Mins' },
                      { mins: 15, label: '15 Mins' },
                    ].map((item) => (
                      <button
                        key={item.mins}
                        type="button"
                        onClick={() => setTimerMinutes(item.mins)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          timerMinutes === item.mins
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {aiError && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{aiError}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={handleStartStandardTest}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Mock Test ({questionCount} MCQs)</span>
                  </button>

                  <button
                    onClick={handleStartAiTest}
                    disabled={isAiGenerating}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Generate unique AI questions tailored to this chapter"
                  >
                    {isAiGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    )}
                    <span>{isAiGenerating ? 'Generating...' : 'AI Custom Test'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Test Info Card (1 col) */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <FileCheck className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Exam Format</h3>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Strictly <strong>Multiple-Choice Questions (MCQ)</strong> based on CBSE/NCERT Class 9 specifications.
                </p>

                <ul className="text-2xs text-slate-500 space-y-2 border-t border-slate-100 pt-3">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>1 mark for each correct answer</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>No negative marking</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Review palette & flag question for later</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Step-by-step explanations for all solutions</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>1-click export of tricky questions into your notes</span>
                  </li>
                </ul>
              </div>

              {historyAttempts.length > 0 && (
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <div className="text-2xs font-semibold text-indigo-800 uppercase tracking-wider mb-1">
                    Last Attempt Performance
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-indigo-900">
                      {historyAttempts[0].score}/{historyAttempts[0].totalQuestions}
                    </span>
                    <span className="text-xs font-bold text-indigo-700">
                      ({historyAttempts[0].percentage}%)
                    </span>
                  </div>
                  <div className="text-2xs text-indigo-600 mt-1 truncate">
                    {historyAttempts[0].title}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Past Attempts List */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Recorded Test Attempts</h2>
              <span className="text-xs text-slate-500">{historyAttempts.length} total tests taken</span>
            </div>

            {historyAttempts.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No past mock test attempts recorded yet. Take your first test to see your scores!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {historyAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-2xs text-slate-500 mb-0.5">
                        <span className="capitalize font-semibold text-slate-700">
                          {att.subjectId}
                        </span>
                        <span>·</span>
                        <span>{att.date}</span>
                        {att.timeSpentSeconds > 0 && (
                          <>
                            <span>·</span>
                            <span>{Math.round(att.timeSpentSeconds / 60)} min spent</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-slate-900">{att.title}</h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                          {att.score}/{att.totalQuestions}
                        </div>
                        <div
                          className={`text-2xs font-semibold ${
                            att.percentage >= 80
                              ? 'text-emerald-600'
                              : att.percentage >= 50
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {att.percentage}% Accuracy
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setLastAttempt(att);
                          setTestState('results');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Review Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW: 2. TEST IN PROGRESS
  // =========================================================================
  if (testState === 'in_progress') {
    const currentQ = currentQuestions[currentIndex];
    const answeredCount = Object.keys(userAnswers).length;
    const isAnswered = currentQ && typeof userAnswers[currentQ.id] === 'number';
    const isFlagged = currentQ && !!flaggedQuestions[currentQ.id];

    return (
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        {/* Active Test Top Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-900">
              Question {currentIndex + 1} of {currentQuestions.length}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">
              {answeredCount}/{currentQuestions.length} Answered
            </span>
          </div>

          <div className="flex items-center gap-3">
            {timerMinutes > 0 && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold rounded-lg ${
                  timeRemainingSeconds <= 60
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="tabular-nums">{formatTimerMinSec(timeRemainingSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Finish & Submit
            </button>
          </div>
        </div>

        {/* Question & Options Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Question Card (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                  {currentQ?.chapterTitle || 'Class 9 STEM'}
                </span>

                <button
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-2xs font-semibold transition-colors cursor-pointer ${
                    isFlagged
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Flag className={`w-3 h-3 ${isFlagged ? 'fill-amber-600' : ''}`} />
                  <span>{isFlagged ? 'Flagged' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Statement */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-6 leading-relaxed">
                {currentQ?.question}
              </h2>

              {/* Options List */}
              <div className="space-y-3">
                {currentQ?.options.map((optionText, optIndex) => {
                  const isSelected = userAnswers[currentQ.id] === optIndex;
                  const letter = ['A', 'B', 'C', 'D'][optIndex];

                  return (
                    <div
                      key={optIndex}
                      onClick={() => handleSelectOption(optIndex)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {letter}
                      </div>
                      <span className="flex-1 leading-normal">{optionText}</span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {isAnswered && (
                  <button
                    onClick={() => {
                      const next = { ...userAnswers };
                      delete next[currentQ.id];
                      setUserAnswers(next);
                    }}
                    className="text-2xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear Choice
                  </button>
                )}

                <button
                  onClick={() =>
                    setCurrentIndex((prev) => Math.min(currentQuestions.length - 1, prev + 1))
                  }
                  disabled={currentIndex === currentQuestions.length - 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Question Palette
              </h3>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {currentQuestions.map((q, idx) => {
                  const answered = typeof userAnswers[q.id] === 'number';
                  const flagged = !!flaggedQuestions[q.id];
                  const current = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer relative ${
                        current
                          ? 'ring-2 ring-indigo-600 ring-offset-1'
                          : ''
                      } ${
                        answered
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {flagged && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-2xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-indigo-600" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-amber-400" />
                  <span>Marked for Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Ready to Submit?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have answered <strong>{answeredCount}</strong> of <strong>{currentQuestions.length}</strong> questions.
                {currentQuestions.length - answeredCount > 0 && (
                  <span className="text-amber-600 block mt-1 font-semibold">
                    ⚠️ {currentQuestions.length - answeredCount} question(s) remain unanswered!
                  </span>
                )}
              </p>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Return to Test
                </button>
                <button
                  onClick={handleCompleteTest}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW: 3. RESULTS & EXPLANATIONS REVIEW
  // =========================================================================
  if (testState === 'results' && lastAttempt) {
    const isPassing = lastAttempt.percentage >= 60;
    const questionsToReview = lastAttempt.questions.filter((q) => {
      const userAns = lastAttempt.userAnswers[q.id];
      const isCorrect = userAns === q.correctIndex;
      if (reviewFilter === 'correct') return isCorrect;
      if (reviewFilter === 'incorrect') return !isCorrect;
      return true;
    });

    return (
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        {/* Results Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                Exam Results Summary
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                {lastAttempt.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Completed on {lastAttempt.date}
                {lastAttempt.timeSpentSeconds > 0 &&
                  ` · Time taken: ${formatTimerMinSec(lastAttempt.timeSpentSeconds)}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTestState('setup')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Test</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-2xs font-semibold text-slate-500 mb-1">Score Obtained</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {lastAttempt.score} / {lastAttempt.totalQuestions}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-2xs font-semibold text-slate-500 mb-1">Percentage</div>
              <div
                className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${
                  lastAttempt.percentage >= 80
                    ? 'text-emerald-600'
                    : lastAttempt.percentage >= 50
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {lastAttempt.percentage}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <div className="text-2xs font-semibold text-emerald-700 mb-1">Correct Answers</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-800 tabular-nums">
                {lastAttempt.score}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-center">
              <div className="text-2xs font-semibold text-rose-700 mb-1">Incorrect / Skipped</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-800 tabular-nums">
                {lastAttempt.totalQuestions - lastAttempt.score}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Solutions Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Detailed Solutions & NCERT Explanations
              </h2>
              <p className="text-xs text-slate-500">
                Review your answers with step-by-step reasoning and save tricky problems to notes.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  reviewFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({lastAttempt.questions.length})
              </button>
              <button
                onClick={() => setReviewFilter('incorrect')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  reviewFilter === 'incorrect'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incorrect ({lastAttempt.totalQuestions - lastAttempt.score})
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  reviewFilter === 'correct'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Correct ({lastAttempt.score})
              </button>
            </div>
          </div>

          {/* Questions Review List */}
          <div className="space-y-4">
            {questionsToReview.map((q, idx) => {
              const userAns = lastAttempt.userAnswers[q.id];
              const isCorrect = userAns === q.correctIndex;
              const isSkipped = typeof userAns !== 'number';

              return (
                <div
                  key={q.id}
                  className={`bg-white p-6 rounded-xl border shadow-2xs transition-all ${
                    isCorrect
                      ? 'border-emerald-200'
                      : isSkipped
                      ? 'border-slate-200'
                      : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        Q{lastAttempt.questions.indexOf(q) + 1}.
                      </span>
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {q.chapterTitle}
                      </span>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Correct (+1)</span>
                        </span>
                      ) : isSkipped ? (
                        <span className="text-2xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Skipped
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-2xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Incorrect (0)</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleSaveQuestionToNotes(q, userAns)}
                      title="Save this question & solution to My Notes"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-2xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    >
                      {savedNoteId === q.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Saved!</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3 h-3" />
                          <span>Save to Notes</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Question */}
                  <h3 className="text-sm font-bold text-slate-900 mb-4">{q.question}</h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {q.options.map((opt, optIndex) => {
                      const isCorrectChoice = optIndex === q.correctIndex;
                      const isUserChoice = optIndex === userAns;
                      const letter = ['A', 'B', 'C', 'D'][optIndex];

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2.5 ${
                            isCorrectChoice
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                              : isUserChoice && !isCorrectChoice
                              ? 'border-rose-400 bg-rose-50 text-rose-950 font-semibold'
                              : 'border-slate-100 bg-slate-50/50 text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold shrink-0 ${
                              isCorrectChoice
                                ? 'bg-emerald-600 text-white'
                                : isUserChoice
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {letter}
                          </div>
                          <span className="flex-1">{opt}</span>
                          {isCorrectChoice && (
                            <span className="text-2xs font-bold text-emerald-700">✓ Correct</span>
                          )}
                          {isUserChoice && !isCorrectChoice && (
                            <span className="text-2xs font-bold text-rose-700">✗ Your Choice</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation box */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-1">NCERT Explanation:</strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
