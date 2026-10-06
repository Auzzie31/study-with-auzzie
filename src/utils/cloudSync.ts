import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Chapter, StudyGoal, StudyNote, StudySession } from '../types';

export interface CloudStudyPayload {
  chapters?: Chapter[];
  sessions?: StudySession[];
  notes?: StudyNote[];
  goal?: StudyGoal;
}

export async function fetchUserCloudData(userId: string): Promise<CloudStudyPayload | null> {
  try {
    const snap = await getDoc(doc(db, 'users', userId, 'studyData', 'main'));
    if (snap.exists()) {
      const data = snap.data();
      return {
        chapters: data.completedSubtopics ? JSON.parse(data.completedSubtopics) : undefined,
        notes: data.notes ? JSON.parse(data.notes) : undefined,
        sessions: data.tests ? JSON.parse(data.tests) : undefined,
      };
    }
  } catch (err) {
    console.warn('Could not load cloud study data:', err);
  }
  return null;
}

export async function saveUserCloudData(
  userId: string,
  payload: { chapters: Chapter[]; notes: StudyNote[]; sessions: StudySession[] }
): Promise<void> {
  try {
    await setDoc(doc(db, 'users', userId, 'studyData', 'main'), {
      userId,
      completedSubtopics: JSON.stringify(payload.chapters),
      notes: JSON.stringify(payload.notes),
      tests: JSON.stringify(payload.sessions),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not save cloud study data:', err);
  }
}
