import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  Star,
  ChevronDown,
  ChevronUp,
  Plus,
  BookOpen,
} from 'lucide-react';
import { Chapter, SubjectId, Topic, TopicStatus } from '../types';
import { SUBJECT_METAS } from '../data/curriculum';

interface SyllabusViewProps {
  chapters: Chapter[];
  onUpdateTopicStatus: (topicId: string, status: TopicStatus) => void;
  onUpdateTopicConfidence: (topicId: string, confidence: number) => void;
  onLaunchTimerForTopic: (topic: Topic) => void;
  onOpenNotesForTopic: (topic: Topic) => void;
  onOpenAddTopicModal: (subjectId: SubjectId) => void;
  initialSubjectFilter?: SubjectId;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  chapters,
  onUpdateTopicStatus,
  onUpdateTopicConfidence,
  onLaunchTimerForTopic,
  onOpenNotesForTopic,
  onOpenAddTopicModal,
  initialSubjectFilter,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>(
    initialSubjectFilter || 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<'all' | TopicStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    // Expand first 3 chapters by default
    const map: Record<string, boolean> = {};
    chapters.slice(0, 3).forEach((c) => {
      map[c.id] = true;
    });
    return map;
  });

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const expandAll = () => {
    const map: Record<string, boolean> = {};
    chapters.forEach((c) => {
      map[c.id] = true;
    });
    setExpandedChapters(map);
  };

  const collapseAll = () => {
    setExpandedChapters({});
  };

  // Filtered chapters & topics
  const filteredChapters = chapters
    .filter((ch) => selectedSubject === 'all' || ch.subjectId === selectedSubject)
    .map((ch) => {
      const filteredTopics = ch.topics.filter((t) => {
        const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
        const matchesSearch =
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.subtopics.some((st) => st.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (t.keyFormulas &&
            t.keyFormulas.some((kf) => kf.toLowerCase().includes(searchTerm.toLowerCase())));
        return matchesStatus && matchesSearch;
      });
      return { ...ch, topics: filteredTopics };
    })
    .filter((ch) => ch.topics.length > 0 || (searchTerm === '' && selectedStatus === 'all'));

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" />
            <span>Mastered</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" />
            <span>In Progress</span>
          </span>
        );
      case 'not_started':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
            <span>Not Started</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-2xs">
              ✓ New NCERT 2026 Curriculum (Exploration & Ganita Manjari)
            </span>
            <span aria-hidden="true">·</span>
            <span>Class 9 STEM</span>
            <span aria-hidden="true">·</span>
            <span>Physics, Chemistry & Mathematics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Curriculum & Chapter Mastery
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              onOpenAddTopicModal(selectedSubject === 'all' ? 'physics' : selectedSubject)
            }
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Topic</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Subject Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Subjects
          </button>
          <button
            onClick={() => setSelectedSubject('physics')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedSubject === 'physics'
                ? 'bg-white text-sky-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Physics
          </button>
          <button
            onClick={() => setSelectedSubject('chemistry')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedSubject === 'chemistry'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chemistry
          </button>
          <button
            onClick={() => setSelectedSubject('mathematics')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedSubject === 'mathematics'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mathematics
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, formulas, or theorems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | TopicStatus)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>

        {/* Expand / Collapse All buttons */}
        <div className="hidden sm:flex items-center gap-2 text-2xs text-slate-500">
          <button onClick={expandAll} className="hover:text-slate-900 cursor-pointer">
            Expand All
          </button>
          <span>·</span>
          <button onClick={collapseAll} className="hover:text-slate-900 cursor-pointer">
            Collapse All
          </button>
        </div>
      </div>

      {/* Chapter List */}
      <div className="space-y-4">
        {filteredChapters.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 font-medium">
              No topics found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSelectedSubject('all');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="mt-2 text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredChapters.map((chapter) => {
            const isExpanded = !!expandedChapters[chapter.id];
            const meta = SUBJECT_METAS[chapter.subjectId];
            const masteredCount = chapter.topics.filter((t) => t.status === 'mastered').length;
            const totalCount = chapter.topics.length;
            const chapPercentage =
              totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;
            const totalMins = chapter.topics.reduce((acc, t) => acc + (t.minutesSpent || 0), 0);

            return (
              <div
                key={chapter.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
              >
                {/* Chapter Header Accordion */}
                <div
                  onClick={() => toggleChapter(chapter.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: meta.color }}
                    >
                      {chapter.number}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span className="capitalize font-medium text-slate-700">
                          {chapter.subjectId}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Chapter {chapter.number}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block">
                        {chapter.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                        {masteredCount}/{totalCount} topics mastered
                      </div>
                      <div className="text-2xs font-mono text-slate-500 tabular-nums">
                        {Math.floor(totalMins / 60)}h {totalMins % 60}m studied
                      </div>
                    </div>

                    <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden hidden md:block">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${chapPercentage}%`, backgroundColor: meta.color }}
                      />
                    </div>

                    <div className="p-1 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Topics Table / List */}
                {isExpanded && (
                  <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/30">
                    {chapter.topics.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No topics in this chapter.
                      </div>
                    ) : (
                      chapter.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="p-4 hover:bg-white transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          {/* Topic Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-slate-900">
                                {topic.title}
                              </h4>
                              {getStatusBadge(topic.status)}
                            </div>

                            {/* Subtopics bullet list */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                              {topic.subtopics.map((st, i) => (
                                <React.Fragment key={i}>
                                  <span>{st}</span>
                                  {i < topic.subtopics.length - 1 && (
                                    <span aria-hidden="true" className="text-slate-300">
                                      ·
                                    </span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>

                            {/* Study history metadata */}
                            <div className="mt-2 flex items-center gap-3 text-2xs text-slate-400 font-mono tabular-nums">
                              <span>
                                Time logged: {Math.floor((topic.minutesSpent || 0) / 60)}h{' '}
                                {(topic.minutesSpent || 0) % 60}m
                              </span>
                              <span>·</span>
                              <span>
                                {topic.lastStudiedDate
                                  ? `Last studied: ${topic.lastStudiedDate}`
                                  : 'Not studied yet'}
                              </span>
                              <span>·</span>
                              <span>{topic.revisionCount || 0} revisions</span>
                            </div>
                          </div>

                          {/* Controls: Status Toggle, Rating & Quick Launch */}
                          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                            {/* Confidence 5-Star Rating */}
                            <div className="flex items-center gap-0.5" title="Topic Confidence Rating (1-5)">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => onUpdateTopicConfidence(topic.id, star)}
                                  className="p-0.5 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      star <= (topic.confidence || 1)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-200'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>

                            {/* Status Selector */}
                            <select
                              value={topic.status}
                              onChange={(e) =>
                                onUpdateTopicStatus(topic.id, e.target.value as TopicStatus)
                              }
                              className="text-xs font-medium border border-slate-200 bg-white rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                            >
                              <option value="not_started">Not Started</option>
                              <option value="in_progress">In Progress</option>
                              <option value="mastered">Mastered</option>
                            </select>

                            {/* Quick Study Timer Launch */}
                            <button
                              onClick={() => onLaunchTimerForTopic(topic)}
                              title="Start timer for this topic"
                              className="p-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                            </button>

                            {/* Quick Note Launch */}
                            <button
                              onClick={() => onOpenNotesForTopic(topic)}
                              title="Open/take notes on this topic"
                              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
