import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthGate: React.FC = () => {
  const { login, signup, loginLocally, resetPassword } = useAuth();
  const [mode, setMode] = useState<'signup' | 'login' | 'forgot'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getFriendlyErrorMessage = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify credentials or switch to Sign Up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Try again or click Forgot password.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email address. Please switch to Sign In.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet.';
      default:
        return err?.message || 'Authentication error. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!password || password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        await signup(email, password, name);
      } else if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMessage('Password reset link sent! Check your inbox.');
      }
    } catch (err: any) {
      const code = err?.code || '';
      const msg = err?.message || '';
      if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
        loginLocally(email, name);
        return;
      }
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Brand and Facilities Overview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Class 9 STEM (NCERT 2026)</span>
          </div>

          {/* Large Website Thumbnail Banner */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900">
            <img
              src="/images/og-thumbnail.jpg"
              alt="Study with Auzzie - Class 9 STEM Companion"
              className="w-full h-44 object-cover object-center"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
            <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Class 9 STEM Companion</span>
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Study with <span className="text-indigo-600">Auzzie</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Sign in with your email to access all study facilities, syllabus tracking, notes, and AI doubt solving.
            </p>
          </div>

          {/* Key Facilities Unlocked */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Facilities Included
            </h3>

            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Complete STEM Syllabus</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Track chapters & subtopics across Physics, Chemistry, and Mathematics with confidence ratings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Study Timer & Consistency</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Deep work sessions, habit streaks, and visual daily study matrices.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">AI Doubt Solver & Mock Tests</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Instant NCERT solutions, formula reference sheets, and chapter tests.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure student workspace · Sign-in required</span>
          </div>
        </div>

        {/* Right Side: Auth Card (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
            
            {/* Top Selector Tabs */}
            {mode !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account (Sign Up)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In (Log In)
                </button>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {mode === 'signup' && 'Sign Up with Email'}
                {mode === 'login' && 'Log In to Your Account'}
                {mode === 'forgot' && 'Reset Your Password'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'signup' && 'Create your free account to unlock all features.'}
                {mode === 'login' && 'Enter your email and password to resume your study.'}
                {mode === 'forgot' && 'Enter your email to receive a password reset link.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="flex-1">
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-700 text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Please wait...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'signup' && 'Sign Up & Enter Workspace'}
                      {mode === 'login' && 'Sign In & Enter Workspace'}
                      {mode === 'forgot' && 'Send Password Reset Email'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle switch text */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              {mode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              )}

              {mode === 'login' && (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </p>
              )}

              {mode === 'forgot' && (
                <p>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                  >
                    Back to Log In
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
