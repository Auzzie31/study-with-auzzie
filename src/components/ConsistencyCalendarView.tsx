import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  RotateCcw,
  Play,
  CheckCircle,
  AlertCircle,
  FileText,
  Search,
  Filter,
} from 'lucide-react';
import { Chapter, StudySession, SubjectId, Topic } from '../types';
import { calculateStreaks } from '../utils/storage';

interface ConsistencyCalendarViewProps {
  chapters: Chapter[];
  sessions: StudySession[];
  onLaunchTimerForTopic: (topic: Topic) => void;
  onOpenNotesForTopic: (topic: Topic) => void;
}

export const ConsistencyCalendarView: React.FC<ConsistencyCalendarViewProps> = ({
  chapters,
  sessions,
  onLaunchTimerForTopic,
  onOpenNotesForTopic,
}) => {
  // Calendar month state (defaults to October 2026)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 2)); // Month is 0-indexed: 9 = October
  const [selectedDaySessions, setSelectedDaySessions] = useState<{
    dateStr: string;
    sessions: StudySession[];
  } | null>(null);

  // Per-Topic Consistency Matrix filter state
  const [matrixSubject, setMatrixSubject] = useState<'all' | SubjectId>('all');
  const [matrixSearch, setMatrixSearch] = useState('');
  const [matrixStatusFilter, setMatrixStatusFilter] = useState<'all' | 'due' | 'fresh' | 'never'>('all');

  const allTopics = chapters.flatMap((c) => c.topics);
  const streaks = calculateStreaks(sessions);

  // Map sessions by date 'YYYY-MM-DD'
  const sessionsByDate: Record<string, StudySession[]> = {};
  for (const s of sessions) {
    if (!sessionsByDate[s.date]) {
      sessionsByDate[s.date] = [];
    }
    sessionsByDate[s.date].push(s);
  }

  // Monthly calendar calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 1-indexed days of month
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDayKey = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // 12-week GitHub style activity heatmap
  const heatmapDays: { dateStr: string; minutes: number }[] = [];
  const today = new Date(2026, 9, 2);
  const totalHeatmapDays = 84; // 12 weeks
  for (let i = totalHeatmapDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const daySessions = sessionsByDate[dateStr] || [];
    const minutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    heatmapDays.push({ dateStr, minutes });
  }

  const getHeatmapColor = (mins: number) => {
    if (mins === 0) return 'bg-slate-100';
    if (mins < 30) return 'bg-emerald-200';
    if (mins < 60) return 'bg-emerald-400';
    if (mins < 90) return 'bg-emerald-600';
    return 'bg-emerald-700';
  };

  // Retention Status Evaluator for Topics
  const getTopicRetentionStatus = (topic: Topic) => {
    if (!topic.lastStudiedDate) {
      return { status: 'never', label: 'Never Studied', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    }
    const last = new Date(topic.lastStudiedDate);
    const diffDays = Math.floor(Math.abs(today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      return { status: 'fresh', label: 'Fresh in Memory', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', days: diffDays };
    } else if (diffDays <= 7) {
      return { status: 'due', label: 'Review Recommended', color: 'text-sky-700 bg-sky-50 border-sky-200', days: diffDays };
    } else {
      return { status: 'due', label: 'Overdue for Review', color: 'text-amber-700 bg-amber-50 border-amber-200', days: diffDays };
    }
  };

  // Filtered Per-Topic Consistency Table
  const filteredTopics = allTopics.filter((t) => {
    const matchesSubject = matrixSubject === 'all' || t.subjectId === matrixSubject;
    const matchesSearch =
      t.title.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      t.chapterTitle.toLowerCase().includes(matrixSearch.toLowerCase());
    
    const ret = getTopicRetentionStatus(t);
    const matchesStatus =
      matrixStatusFilter === 'all' ||
      (matrixStatusFilter === 'fresh' && ret.status === 'fresh') ||
      (matrixStatusFilter === 'due' && ret.status === 'due') ||
      (matrixStatusFilter === 'never' && ret.status === 'never');

    return matchesSubject && matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Class 9 Academic Tracker</span>
            <span aria-hidden="true">·</span>
            <span>Daily Streak & Spaced Repetition Matrix</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Consistency & Topic Revision Calendar
          </h1>
        </div>
      </div>

      {/* Consistency Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {streaks.currentStreak} Days
          </div>
          <p className="text-2xs text-slate-500 mt-1">Keep it up to build study momentum</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Longest Streak</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {streaks.longestStreak} Days
          </div>
          <p className="text-2xs text-slate-500 mt-1">Personal best this semester</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Active Study Days</span>
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {streaks.activeDaysCount} Days
          </div>
          <p className="text-2xs text-slate-500 mt-1">With logged focus sessions</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Today's Logged Time</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {streaks.todayMinutes} Min
          </div>
          <p className="text-2xs text-slate-500 mt-1">Study time completed today</p>
        </div>
      </div>

      {/* 12-Week Study Heatmap */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Study Frequency Grid (Last 12 Weeks)</h3>
          <div className="flex items-center gap-1.5 text-2xs text-slate-500">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 inline-block" />
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-200 inline-block" />
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-700 inline-block" />
            <span>More</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {heatmapDays.map((hd) => (
            <div
              key={hd.dateStr}
              title={`${hd.dateStr}: ${hd.minutes} minutes studied`}
              className={`w-3.5 h-3.5 rounded-xs transition-transform hover:scale-125 cursor-pointer ${getHeatmapColor(
                hd.minutes
              )}`}
              onClick={() => {
                const daySess = sessionsByDate[hd.dateStr] || [];
                setSelectedDaySessions({ dateStr: hd.dateStr, sessions: daySess });
              }}
            />
          ))}
        </div>
      </div>

      {/* Interactive Monthly Calendar */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-500">
              Click any calendar day to inspect topics and study notes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayNum, idx) => {
            if (dayNum === null) {
              return <div key={`empty-${idx}`} className="h-20 bg-slate-50/50 rounded-lg" />;
            }

            const dayKey = formatDayKey(dayNum);
            const daySess = sessionsByDate[dayKey] || [];
            const dayMinutes = daySess.reduce((acc, s) => acc + s.durationMinutes, 0);
            const hasPhysics = daySess.some((s) => s.subjectId === 'physics');
            const hasChemistry = daySess.some((s) => s.subjectId === 'chemistry');
            const hasMath = daySess.some((s) => s.subjectId === 'mathematics');

            const isCurrentToday = dayKey === '2026-10-02';

            return (
              <div
                key={dayKey}
                onClick={() => setSelectedDaySessions({ dateStr: dayKey, sessions: daySess })}
                className={`h-20 p-2 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrentToday
                    ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-500'
                    : dayMinutes > 0
                    ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                    : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isCurrentToday ? 'text-indigo-600' : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayMinutes > 0 && (
                    <span className="text-2xs font-mono font-semibold text-emerald-700 tabular-nums">
                      {dayMinutes}m
                    </span>
                  )}
                </div>

                {/* Subject activity dots */}
                <div className="flex items-center gap-1 mt-1">
                  {hasPhysics && <span className="w-2 h-2 rounded-full bg-sky-500" title="Physics studied" />}
                  {hasChemistry && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Chemistry studied" />}
                  {hasMath && <span className="w-2 h-2 rounded-full bg-indigo-500" title="Mathematics studied" />}
                </div>

                <div className="text-2xs text-slate-400 line-clamp-1 truncate font-mono">
                  {daySess.length > 0 ? `${daySess.length} session${daySess.length > 1 ? 's' : ''}` : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PER-TOPIC CONSISTENCY CHECK MATRIX */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Per-Topic Consistency & Retention Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Track when each topic was last reviewed and avoid knowledge decay
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Subject Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setMatrixSubject('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  matrixSubject === 'all' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMatrixSubject('physics')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  matrixSubject === 'physics' ? 'bg-white font-semibold text-sky-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Physics
              </button>
              <button
                onClick={() => setMatrixSubject('chemistry')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  matrixSubject === 'chemistry' ? 'bg-white font-semibold text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Chemistry
              </button>
              <button
                onClick={() => setMatrixSubject('mathematics')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  matrixSubject === 'mathematics' ? 'bg-white font-semibold text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Math
              </button>
            </div>

            {/* Retention Status Filter */}
            <select
              value={matrixStatusFilter}
              onChange={(e) => setMatrixStatusFilter(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Topics ({allTopics.length})</option>
              <option value="fresh">Fresh (Reviewed &lt; 3 days)</option>
              <option value="due">Review Recommended / Due</option>
              <option value="never">Never Studied</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topic in matrix (e.g. gravitation, mole, polynomials)..."
            value={matrixSearch}
            onChange={(e) => setMatrixSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Topic Matrix Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Subject & Chapter</th>
                <th className="py-2.5 px-4">Topic Title</th>
                <th className="py-2.5 px-4">Last Studied</th>
                <th className="py-2.5 px-4">Retention Status</th>
                <th className="py-2.5 px-4">Revisions</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No topics matched the selected matrix criteria.
                  </td>
                </tr>
              ) : (
                filteredTopics.map((top) => {
                  const ret = getTopicRetentionStatus(top);

                  return (
                    <tr key={top.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="capitalize font-semibold text-slate-900 block">
                          {top.subjectId}
                        </span>
                        <span className="text-2xs text-slate-500 truncate block max-w-xs">
                          {top.chapterTitle}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {top.title}
                        <div className="text-2xs text-slate-400 font-mono">
                          {Math.floor((top.minutesSpent || 0) / 60)}h {(top.minutesSpent || 0) % 60}m logged
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                        {top.lastStudiedDate ? (
                          <span>
                            {top.lastStudiedDate}
                            <span className="text-2xs text-slate-400 block">
                              ({ret.days === 0 ? 'Today' : `${ret.days} days ago`})
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not started yet</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md border text-2xs font-semibold ${ret.color}`}
                        >
                          {ret.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                        {top.revisionCount || 0} times
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onLaunchTimerForTopic(top)}
                            title="Start study timer for this topic"
                            className="px-2.5 py-1 text-2xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Revise</span>
                          </button>
                          <button
                            onClick={() => onOpenNotesForTopic(top)}
                            title="Open note"
                            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Day Details Modal / Drawer */}
      {selectedDaySessions && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Study Log: {selectedDaySessions.dateStr}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedDaySessions.sessions.length} sessions logged
                </p>
              </div>
              <button
                onClick={() => setSelectedDaySessions(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedDaySessions.sessions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No study sessions recorded for this date.
                </div>
              ) : (
                selectedDaySessions.sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-2xs text-slate-500 mb-0.5">
                          <span className="capitalize font-semibold text-slate-700">
                            {sess.subjectId}
                          </span>
                          <span>·</span>
                          <span>{sess.chapterTitle}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{sess.topicTitle}</h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        {sess.durationMinutes} min
                      </span>
                    </div>

                    {sess.notes && (
                      <p className="mt-2 text-xs text-slate-600 bg-white p-2 rounded border border-slate-100 italic">
                        "{sess.notes}"
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between text-2xs text-slate-400 font-mono">
                      <span>Mode: {sess.mode}</span>
                      {sess.rating && <span>Rating: {'★'.repeat(sess.rating)}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedDaySessions(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
