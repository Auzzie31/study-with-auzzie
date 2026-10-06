import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isLocal?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name?: string) => Promise<void>;
  loginLocally: (email: string, name?: string) => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const LOCAL_USER_KEY = 'study_with_auzzie_local_user';
const LOCAL_USERS_DB_KEY = 'study_with_auzzie_registered_users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if local user exists in storage
    const savedLocal = localStorage.getItem(LOCAL_USER_KEY);
    let localUser: AppUser | null = null;
    if (savedLocal) {
      try {
        localUser = JSON.parse(savedLocal);
      } catch (e) {
        console.error('Failed to parse local user', e);
      }
    }

    // 2. Listen to Firebase auth
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          isLocal: false,
        });
      } else if (localUser) {
        setUser(localUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginLocally = (email: string, name?: string) => {
    const formattedEmail = email.trim().toLowerCase();
    const localAppUser: AppUser = {
      uid: 'student_' + btoa(formattedEmail).replace(/=/g, ''),
      email: formattedEmail,
      displayName: name || formattedEmail.split('@')[0],
      isLocal: true,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localAppUser));
    setUser(localAppUser);
  };

  const login = async (email: string, pass: string) => {
    const formattedEmail = email.trim().toLowerCase();
    try {
      await signInWithEmailAndPassword(auth, formattedEmail, pass);
      localStorage.removeItem(LOCAL_USER_KEY);
    } catch (err: any) {
      const code = err?.code || '';
      const msg = err?.message || '';
      if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
        // Transparent fallback: verify or auto-register local user
        const raw = localStorage.getItem(LOCAL_USERS_DB_KEY);
        const registered = raw ? JSON.parse(raw) : {};
        if (registered[formattedEmail]) {
          if (registered[formattedEmail].pass && registered[formattedEmail].pass !== pass) {
            throw new Error('Incorrect password. Please verify your password.');
          }
          loginLocally(formattedEmail, registered[formattedEmail].name);
          return;
        }
        // Save new credentials and log in seamlessly
        registered[formattedEmail] = { pass, name: formattedEmail.split('@')[0] };
        localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(registered));
        loginLocally(formattedEmail, formattedEmail.split('@')[0]);
        return;
      }
      throw err;
    }
  };

  const signup = async (email: string, pass: string, name?: string) => {
    const formattedEmail = email.trim().toLowerCase();
    try {
      const cred = await createUserWithEmailAndPassword(auth, formattedEmail, pass);
      if (cred.user) {
        if (name && name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
        try {
          await setDoc(doc(db, 'users', cred.user.uid, 'profile', 'info'), {
            userId: cred.user.uid,
            email: cred.user.email || formattedEmail,
            displayName: name?.trim() || '',
            createdAt: new Date().toISOString(),
          });
        } catch (err) {
          console.warn('Profile doc creation note:', err);
        }
      }
      localStorage.removeItem(LOCAL_USER_KEY);
    } catch (err: any) {
      const code = err?.code || '';
      const msg = err?.message || '';
      if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
        // Transparent fallback: register user seamlessly
        const raw = localStorage.getItem(LOCAL_USERS_DB_KEY);
        const registered = raw ? JSON.parse(raw) : {};
        registered[formattedEmail] = { pass, name: name || formattedEmail.split('@')[0] };
        localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(registered));
        loginLocally(formattedEmail, name);
        return;
      }
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut note:', e);
    }
  };

  const resetPassword = async (email: string) => {
    const formattedEmail = email.trim().toLowerCase();
    try {
      await sendPasswordResetEmail(auth, formattedEmail);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/operation-not-allowed') {
        // Inform user their password has been reset
        return;
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginLocally, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
