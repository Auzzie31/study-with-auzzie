import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Chapter, SubjectId, Topic } from '../types';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  onAddTopic: (newTopic: Topic) => void;
  onAddChapter: (newChapter: Chapter) => void;
  defaultSubjectId?: SubjectId;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  chapters,
  onAddTopic,
  onAddChapter,
  defaultSubjectId = 'physics',
}) => {
  const [activeMode, setActiveMode] = useState<'topic' | 'chapter'>('topic');
  const [subjectId, setSubjectId] = useState<SubjectId>(defaultSubjectId);
  
  // Topic form
  const [chapterId, setChapterId] = useState<string>('');
  const [topicTitle, setTopicTitle] = useState('');
  const [subtopicsText, setSubtopicsText] = useState('');
  const [targetMinutes, setTargetMinutes] = useState(60);

  // Chapter form
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');

  if (!isOpen) return null;

  const subjectChapters = chapters.filter((c) => c.subjectId === subjectId);
  const selectedChapter = chapters.find((c) => c.id === (chapterId || subjectChapters[0]?.id));

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;

    const targetChap = selectedChapter || subjectChapters[0];
    if (!targetChap) return;

    const subtopics = subtopicsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newTopic: Topic = {
      id: `custom-top-${Date.now()}`,
      subjectId,
      chapterId: targetChap.id,
      chapterTitle: targetChap.title,
      title: topicTitle.trim(),
      subtopics: subtopics.length > 0 ? subtopics : ['Concept overview', 'Problem practice'],
      status: 'not_started',
      confidence: 1,
      targetMinutes: Number(targetMinutes) || 60,
      minutesSpent: 0,
      lastStudiedDate: null,
      revisionCount: 0,
    };

    onAddTopic(newTopic);
    onClose();
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterTitle.trim()) return;

    const newChapter: Chapter = {
      id: `custom-chap-${Date.now()}`,
      subjectId,
      number: subjectChapters.length + 1,
      title: chapterTitle.trim(),
      description: chapterDescription.trim() || 'Custom added curriculum chapter.',
      topics: [],
    };

    onAddChapter(newChapter);
    setActiveMode('topic');
    setChapterId(newChapter.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {activeMode === 'topic' ? 'Add Custom Topic' : 'Add Custom Chapter'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Extend your Class 9 syllabus</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab mode selector */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveMode('topic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeMode === 'topic'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            New Topic
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('chapter')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeMode === 'chapter'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            New Chapter
          </button>
        </div>

        {activeMode === 'topic' ? (
          <form onSubmit={handleCreateTopic} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <div className="grid grid-cols-3 gap-2">
                {(['physics', 'chemistry', 'mathematics'] as SubjectId[]).map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => {
                      setSubjectId(subj);
                      const chaps = chapters.filter((c) => c.subjectId === subj);
                      setChapterId(chaps[0]?.id || '');
                    }}
                    className={`py-2 text-xs font-medium rounded-lg border capitalize transition-all cursor-pointer ${
                      subjectId === subj
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter</label>
              <select
                value={chapterId || subjectChapters[0]?.id || ''}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {subjectChapters.map((chap) => (
                  <option key={chap.id} value={chap.id}>
                    Ch {chap.number}: {chap.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Topic Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Relative Density & Floatation"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subtopics (one per line)
              </label>
              <textarea
                rows={3}
                placeholder="Definition and formula&#10;Solved numericals&#10;NCERT back exercises"
                value={subtopicsText}
                onChange={(e) => setSubtopicsText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Study Time (Minutes)
              </label>
              <input
                type="number"
                min={15}
                max={600}
                step={15}
                value={targetMinutes}
                onChange={(e) => setTargetMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Add Topic
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateChapter} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <div className="grid grid-cols-3 gap-2">
                {(['physics', 'chemistry', 'mathematics'] as SubjectId[]).map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => setSubjectId(subj)}
                    className={`py-2 text-xs font-medium rounded-lg border capitalize transition-all cursor-pointer ${
                      subjectId === subj
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Natural Resources"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Overview of core concepts and learning objectives"
                value={chapterDescription}
                onChange={(e) => setChapterDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Create Chapter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
