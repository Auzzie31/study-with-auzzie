import { Chapter, MockTestAttempt, StudyGoal, StudyNote, StudySession, SubjectId } from '../types';
import { INITIAL_CHAPTERS } from '../data/curriculum';
import { INITIAL_NOTES } from '../data/initialNotes';

const STORAGE_KEYS = {
  CURRICULUM: 'apex9_curriculum_v6_ncert_2026',
  SESSIONS: 'apex9_sessions_v4_clean',
  NOTES: 'apex9_notes_v6_ncert_2026',
  GOAL: 'apex9_goal_v4_clean',
  MOCK_TESTS: 'apex9_mock_tests_v4_clean',
};

// Purge any outdated mock or earlier version keys from browser localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const obsoleteKeys = [
      'apex9_curriculum_v1',
      'apex9_sessions_v1',
      'apex9_notes_v1',
      'apex9_goal_v1',
      'apex9_curriculum_zero_v2',
      'apex9_sessions_zero_v2',
      'apex9_notes_zero_v2',
      'apex9_goal_zero_v2',
      'apex9_curriculum_v4_clean',
      'apex9_curriculum_v5_new_ncert',
      'apex9_notes_v4_clean',
    ];
    obsoleteKeys.forEach((key) => localStorage.removeItem(key));
  }
} catch {
  // ignore storage errors
}

// Clean slate: 0 sessions to begin with
const INITIAL_SESSIONS: StudySession[] = [];

const DEFAULT_GOAL: StudyGoal = {
  weeklyTargetMinutes: 600, // 10 hours/week
  dailyTargetMinutes: 60,   // 1 hour/day
};

export function loadCurriculum(): Chapter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRICULUM);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load curriculum', e);
  }
  return INITIAL_CHAPTERS;
}

export function saveCurriculum(chapters: Chapter[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(chapters));
  } catch (e) {
    console.error('Failed to save curriculum', e);
  }
}

export function loadStudySessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load study sessions', e);
  }
  return INITIAL_SESSIONS;
}

export function saveStudySessions(sessions: StudySession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save study sessions', e);
  }
}

export function addStudySession(newSession: StudySession): StudySession[] {
  const sessions = loadStudySessions();
  const updated = [newSession, ...sessions];
  saveStudySessions(updated);

  // Also update topic minutesSpent, lastStudiedDate, and revisionCount in curriculum
  const chapters = loadCurriculum();
  let modified = false;

  for (const chapter of chapters) {
    for (const topic of chapter.topics) {
      if (topic.id === newSession.topicId) {
        topic.minutesSpent = (topic.minutesSpent || 0) + newSession.durationMinutes;
        topic.lastStudiedDate = newSession.date;
        topic.revisionCount = (topic.revisionCount || 0) + 1;
        if (topic.status === 'not_started') {
          topic.status = 'in_progress';
        }
        modified = true;
        break;
      }
    }
  }

  if (modified) {
    saveCurriculum(chapters);
  }

  return updated;
}

export function deleteStudySession(sessionId: string): StudySession[] {
  const sessions = loadStudySessions();
  const updated = sessions.filter((s) => s.id !== sessionId);
  saveStudySessions(updated);
  return updated;
}

export function loadNotes(): StudyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notes', e);
  }
  return INITIAL_NOTES;
}

export function saveNotes(notes: StudyNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes', e);
  }
}

export function loadGoal(): StudyGoal {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOAL);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load goal', e);
  }
  return DEFAULT_GOAL;
}

export function saveGoal(goal: StudyGoal): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify(goal));
  } catch (e) {
    console.error('Failed to save goal', e);
  }
}

export function loadMockAttempts(): MockTestAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOCK_TESTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load mock attempts', e);
  }
  return [];
}

export function saveMockAttempt(attempt: MockTestAttempt): MockTestAttempt[] {
  try {
    const existing = loadMockAttempts();
    const updated = [attempt, ...existing];
    localStorage.setItem(STORAGE_KEYS.MOCK_TESTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save mock attempt', e);
    return [];
  }
}

/**
 * Resets all user progress and study data to clean slate (0%)
 */
export function resetAllToZero(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRICULUM);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.GOAL);
    localStorage.removeItem('apex9_curriculum_v1');
    localStorage.removeItem('apex9_sessions_v1');
    localStorage.removeItem('apex9_notes_v1');
    localStorage.removeItem('apex9_goal_v1');
  } catch (e) {
    console.error('Failed to clear storage', e);
  }
}

/**
 * Calculates current streak and longest streak from sessions
 */
export function calculateStreaks(sessions: StudySession[]): {
  currentStreak: number;
  longestStreak: number;
  activeDaysCount: number;
  todayMinutes: number;
} {
  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDaysCount: 0, todayMinutes: 0 };
  }

  const dateMap: Record<string, number> = {};
  for (const s of sessions) {
    dateMap[s.date] = (dateMap[s.date] || 0) + s.durationMinutes;
  }

  const sortedDates = Object.keys(dateMap).sort();
  const activeDaysCount = sortedDates.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMinutes = dateMap[todayStr] || 0;

  if (activeDaysCount === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDaysCount: 0, todayMinutes: 0 };
  }

  // Compute streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let running = 0;

  const parseDay = (d: string) => {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day);
  };

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      running = 1;
    } else {
      const prev = parseDay(sortedDates[i - 1]);
      const curr = parseDay(sortedDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        running += 1;
      } else if (diffDays > 1) {
        running = 1;
      }
    }
    if (running > longestStreak) {
      longestStreak = running;
    }
  }

  const today = new Date();
  const checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const formatYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayKey = formatYMD(checkDate);
  const yesterdayDate = new Date(checkDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = formatYMD(yesterdayDate);

  if (dateMap[todayKey] || dateMap[yesterdayKey]) {
    let testDate = dateMap[todayKey] ? checkDate : yesterdayDate;
    while (dateMap[formatYMD(testDate)]) {
      currentStreak++;
      testDate.setDate(testDate.getDate() - 1);
    }
  }

  return {
    currentStreak: Math.max(currentStreak, running > 0 && (dateMap[todayKey] || dateMap[yesterdayKey]) ? running : 0),
    longestStreak: Math.max(longestStreak, currentStreak),
    activeDaysCount,
    todayMinutes,
  };
}

export function exportBackupJSON(): void {
  const data = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    curriculum: loadCurriculum(),
    sessions: loadStudySessions(),
    notes: loadNotes(),
    goal: loadGoal(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `class9-stem-study-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackupJSON(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        if (data.curriculum) saveCurriculum(data.curriculum);
        if (data.sessions) saveStudySessions(data.sessions);
        if (data.notes) saveNotes(data.notes);
        if (data.goal) saveGoal(data.goal);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsText(file);
  });
}
