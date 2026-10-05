import React from 'react';
import { Play, Flame, Award, BookCheck, Clock, TrendingUp, Calendar, ChevronRight, RotateCcw, FileCheck } from 'lucide-react';
import { Chapter, StudyGoal, StudySession, SubjectId, Topic } from '../types';
import { SUBJECT_METAS } from '../data/curriculum';
import { calculateStreaks } from '../utils/storage';

interface DashboardViewProps {
  chapters: Chapter[];
  sessions: StudySession[];
  goal: StudyGoal;
  onNavigateToSyllabus: (subjectId?: SubjectId) => void;
  onLaunchTimerForTopic: (topic: Topic) => void;
  onOpenNotesForTopic: (topic: Topic) => void;
  onOpenCalendar: () => void;
  onOpenMockTests?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  chapters,
  sessions,
  goal,
  onNavigateToSyllabus,
  onLaunchTimerForTopic,
  onOpenNotesForTopic,
  onOpenCalendar,
  onOpenMockTests,
}) => {
  // Aggregate stats
  const allTopics = chapters.flatMap((c) => c.topics);
  const totalTopics = allTopics.length;
  const masteredTopics = allTopics.filter((t) => t.status === 'mastered').length;
  const inProgressTopics = allTopics.filter((t) => t.status === 'in_progress').length;
  const notStartedTopics = allTopics.filter((t) => t.status === 'not_started').length;
  const overallPercentage = totalTopics > 0 ? Math.round((masteredTopics / totalTopics) * 100) : 0;

  // Total study time calculation
  const totalMinutesAll = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHoursAll = (totalMinutesAll / 60).toFixed(1);

  // This week's study time
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter((s) => new Date(s.timestamp) >= startOfWeek);
  const thisWeekMinutes = thisWeekSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const thisWeekHours = Math.floor(thisWeekMinutes / 60);
  const thisWeekRemainingMins = thisWeekMinutes % 60;
  const weeklyGoalPercentage = Math.min(
    100,
    Math.round((thisWeekMinutes / (goal.weeklyTargetMinutes || 600)) * 100)
  );

  const streaks = calculateStreaks(sessions);

  // Subject breakdowns
  const subjects: SubjectId[] = ['physics', 'chemistry', 'mathematics'];
  const subjectStats = subjects.map((subj) => {
    const meta = SUBJECT_METAS[subj];
    const subjTopics = allTopics.filter((t) => t.subjectId === subj);
    const sTotal = subjTopics.length;
    const sMastered = subjTopics.filter((t) => t.status === 'mastered').length;
    const sProgress = subjTopics.filter((t) => t.status === 'in_progress').length;
    const sPct = sTotal > 0 ? Math.round((sMastered / sTotal) * 100) : 0;
    const sMinutes = sessions
      .filter((s) => s.subjectId === subj)
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    return {
      id: subj,
      meta,
      total: sTotal,
      mastered: sMastered,
      inProgress: sProgress,
      percentage: sPct,
      hours: (sMinutes / 60).toFixed(1),
    };
  });

  // Spaced Repetition / Revision Radar:
  // Topics studied in the past (lastStudiedDate exists) ordered by oldest first or due
  const topicsDueForRevision = allTopics
    .filter((t) => t.lastStudiedDate)
    .map((t) => {
      const lastDate = new Date(t.lastStudiedDate!);
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return { topic: t, diffDays };
    })
    .sort((a, b) => b.diffDays - a.diffDays)
    .slice(0, 4);

  // Last studied topic for "Continue Studying" quick card
  const lastSession = sessions[0];
  const lastStudiedTopic = lastSession
    ? allTopics.find((t) => t.id === lastSession.topicId)
    : allTopics[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Academic Session 2026-2027</span>
            <span aria-hidden="true">·</span>
            <span>Class 9 CBSE / NCERT</span>
            <span aria-hidden="true">·</span>
            <span>STEM Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Study Mastery Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Track syllabus progress across Physics, Chemistry, and Mathematics with targeted study
            intervals and consistency tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenMockTests && (
            <button
              onClick={onOpenMockTests}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>Take MCQ Mock Test</span>
            </button>
          )}

          {lastStudiedTopic && (
            <button
              onClick={() => onLaunchTimerForTopic(lastStudiedTopic)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lastSession ? `Resume: ${lastStudiedTopic.title}` : `Start Study: ${lastStudiedTopic.title}`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 4 KPI Metric Row (Single Elevation & Tabular Numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall Syllabus */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Syllabus Mastered</span>
            <BookCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {overallPercentage}%
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ({masteredTopics}/{totalTopics} topics)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Week Focus Hours */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Focus This Week</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {thisWeekHours}h {thisWeekRemainingMins}m
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              / {Math.round(goal.weeklyTargetMinutes / 60)}h goal
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${weeklyGoalPercentage}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Current Consistency Streak */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {streaks.currentStreak}
            </span>
            <span className="text-xs text-slate-500">
              consecutive days
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono tabular-nums">
            Best streak: <span className="font-semibold text-slate-700">{streaks.longestStreak} days</span>
          </div>
        </div>

        {/* KPI 4: Total Study Hours */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Study Time</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {totalHoursAll}
            </span>
            <span className="text-xs text-slate-500">cumulative hours</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono tabular-nums">
            Logged across <span className="font-semibold text-slate-700">{sessions.length} sessions</span>
          </div>
        </div>
      </div>

      {/* Subject-Wise Mastery Cards with Domain Hero Images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Subject Portfolios</h2>
            <p className="text-xs text-slate-500">Detailed curriculum completion breakdown</p>
          </div>
          <button
            onClick={() => onNavigateToSyllabus()}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View all chapters</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjectStats.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* High-fidelity Subject Illustration Asset */}
              <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                <img
                  src={item.meta.heroImage}
                  alt={`${item.meta.name} Class 9 Curriculum visual`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {item.meta.name}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-1">{item.meta.tagline}</p>
                  </div>
                  <span className="font-mono tabular-nums text-xs font-bold text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress and Topic Stats */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.meta.color,
                      }}
                    />
                  </div>

                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono tabular-nums">
                    <span>{item.mastered} Mastered</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.inProgress} In Progress</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.total - item.mastered - item.inProgress} Unstudied</span>
                  </div>

                  <div className="text-xs text-slate-600 mb-4 flex items-center justify-between">
                    <span>Total Time Logged:</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {item.hours} hours
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToSyllabus(item.id)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Open Syllabus
                  </button>
                  <button
                    onClick={() => {
                      const firstActive =
                        allTopics.find(
                          (t) => t.subjectId === item.id && t.status !== 'mastered'
                        ) || allTopics.find((t) => t.subjectId === item.id);
                      if (firstActive) onLaunchTimerForTopic(firstActive);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    style={{ backgroundColor: item.meta.color }}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Study</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split Section: Revision Radar & Recent Study Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Revision Radar (Spaced Repetition) */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Revision Radar</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Spaced repetition prompts for topics you studied previously
              </p>
            </div>
            <button
              onClick={onOpenCalendar}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Full Calendar
            </button>
          </div>

          <div className="space-y-3">
            {topicsDueForRevision.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No revision topics due. Complete your first study session to activate spaced
                repetition reminders.
              </p>
            ) : (
              topicsDueForRevision.map(({ topic, diffDays }) => (
                <div
                  key={topic.id}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                      <span className="capitalize font-medium text-slate-700">
                        {topic.subjectId}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{topic.chapterTitle}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 truncate">{topic.title}</p>
                    <div className="flex items-center gap-2 text-2xs text-slate-500 mt-1 font-mono tabular-nums">
                      <span>Last studied: {diffDays === 0 ? 'Today' : `${diffDays} days ago`}</span>
                      <span aria-hidden="true">·</span>
                      <span>{topic.revisionCount} revisions completed</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onLaunchTimerForTopic(topic)}
                      title="Quick Revise"
                      className="px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Revise</span>
                    </button>
                    <button
                      onClick={() => onOpenNotesForTopic(topic)}
                      title="Review Notes"
                      className="px-2 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                    >
                      Notes
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Study Activity Log */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Recent Study Logs</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically logged sessions with duration and takeaways
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {sessions.length} recorded
            </span>
          </div>

          <div className="space-y-3">
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No study sessions recorded yet. Launch the study timer to record your first focus block.
              </p>
            ) : (
              sessions.slice(0, 4).map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                      <span className="capitalize font-medium text-slate-700">{sess.subjectId}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{sess.chapterTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{sess.date}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      {sess.topicTitle}
                    </h4>
                    {sess.notes && (
                      <p className="text-xs text-slate-600 line-clamp-1 mt-1 italic">
                        "{sess.notes}"
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                      {sess.durationMinutes} min
                    </span>
                    <div className="text-2xs text-slate-500 capitalize">{sess.mode}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
