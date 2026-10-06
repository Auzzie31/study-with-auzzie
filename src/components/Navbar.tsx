import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Clock, LogIn, LogOut, User as UserIcon, Cloud, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveTab = 'dashboard' | 'syllabus' | 'timer' | 'notes' | 'doubts' | 'tests' | 'calendar';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenFormulas: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  activeTimerRunning: boolean;
  timerSecondsRemaining: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenFormulas,
  onOpenAuth,
  activeTimerRunning,
  timerSecondsRemaining,
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const formatTimerMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Wordmark with Thumbnail Icon */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group flex items-center gap-2.5 cursor-pointer focus-visible:outline-none"
              title="Study with Auzzie - Home"
            >
              {/* Thumbnail Image on Left Side instead of 'A' */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-xs border border-indigo-100/80 group-hover:scale-105 transition-all duration-300 shrink-0 bg-slate-900">
                <img
                  src="/favicon.png"
                  alt="Study with Auzzie Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                Study with <span className="text-indigo-600">Auzzie</span>
              </span>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-all py-1.5 border-b-2 text-sm cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`transition-all py-1.5 border-b-2 text-sm cursor-pointer ${
                activeTab === 'syllabus'
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Syllabus
            </button>
            <button
              onClick={() => setActiveTab('timer')}
              className={`transition-all py-1.5 border-b-2 text-sm flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'timer'
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <span>Timer</span>
              {activeTimerRunning && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`transition-all py-1.5 border-b-2 text-sm cursor-pointer ${
                activeTab === 'notes'
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('doubts')}
              className={`transition-all py-1.5 border-b-2 text-sm flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'doubts'
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Ask Auzzie</span>
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`transition-all py-1.5 border-b-2 text-sm cursor-pointer ${
                activeTab === 'tests'
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Mock Tests
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`transition-all py-1.5 border-b-2 text-sm cursor-pointer ${
                activeTab === 'calendar'
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Calendar
            </button>
          </nav>

          {/* Zone 3: Utility Controls & User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Active timer badge */}
            {activeTimerRunning ? (
              <button
                onClick={() => setActiveTab('timer')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium rounded-xl hover:bg-emerald-100 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                title="Timer running - Click to open"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span className="tabular-nums font-bold">
                  {formatTimerMinSec(timerSecondsRemaining)}
                </span>
              </button>
            ) : null}

            {/* Formula Cheatsheet Button */}
            <button
              onClick={onOpenFormulas}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/90 border border-indigo-200/70 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-2xs active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Formula Sheet</span>
              <span className="sm:hidden">Formulas</span>
            </button>

            {/* Authentication Action Controls */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2 sm:pr-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] uppercase shadow-2xs">
                    {user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0) || 'S'}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[110px] truncate hidden sm:inline">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {user.displayName || 'Class 9 Student'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-semibold border border-emerald-100">
                        <Cloud className="w-3 h-3 text-emerald-600" />
                        <span>Cloud Synced</span>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={async () => {
                          setShowUserMenu(false);
                          await logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-100 py-2 gap-1.5 overflow-x-auto text-xs font-medium text-slate-600 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'bg-slate-100/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'syllabus' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'bg-slate-100/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Syllabus
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'timer' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'bg-slate-100/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Timer
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'notes' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'bg-slate-100/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('doubts')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'doubts' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'bg-slate-100/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Ask Auzzie
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'tests' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'bg-slate-100/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Mock Tests
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'calendar' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'bg-slate-100/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>
    </header>
  );
};
