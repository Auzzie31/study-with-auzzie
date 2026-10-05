import React, { useRef, useState } from 'react';
import { BookOpen, Calendar, Clock, FileText, Sparkles, Download, Upload, Check, RotateCcw, AlertTriangle, FileCheck } from 'lucide-react';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';

export type ActiveTab = 'dashboard' | 'syllabus' | 'timer' | 'notes' | 'doubts' | 'tests' | 'calendar';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenFormulas: () => void;
  onResetAllToZero: () => void;
  activeTimerRunning: boolean;
  timerSecondsRemaining: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenFormulas,
  onResetAllToZero,
  activeTimerRunning,
  timerSecondsRemaining,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportNotice, setShowImportNotice] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const formatTimerMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await importBackupJSON(file);
      if (ok) {
        setShowImportNotice(true);
        setTimeout(() => {
          setShowImportNotice(false);
          window.location.reload();
        }, 1200);
      }
    }
  };

  const handleConfirmReset = () => {
    onResetAllToZero();
    setShowResetConfirm(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group flex items-center gap-2.5 cursor-pointer focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-indigo-700 transition-colors">
                A
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Study with Auzzie
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors cursor-pointer py-1 border-b-2 text-sm ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`transition-colors cursor-pointer py-1 border-b-2 text-sm ${
                activeTab === 'syllabus'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Syllabus
            </button>
            <button
              onClick={() => setActiveTab('timer')}
              className={`transition-colors cursor-pointer py-1 border-b-2 text-sm flex items-center gap-1.5 ${
                activeTab === 'timer'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Study Timer</span>
              {activeTimerRunning && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`transition-colors cursor-pointer py-1 border-b-2 text-sm ${
                activeTab === 'notes'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('doubts')}
              className={`transition-colors cursor-pointer py-1 border-b-2 text-sm flex items-center gap-1.5 ${
                activeTab === 'doubts'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Doubt Solver</span>
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`transition-colors cursor-pointer py-1 border-b-2 text-sm flex items-center gap-1.5 ${
                activeTab === 'tests'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mock Tests</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`transition-colors cursor-pointer py-1 border-b-2 text-sm ${
                activeTab === 'calendar'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Consistency Calendar
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {activeTimerRunning ? (
              <button
                onClick={() => setActiveTab('timer')}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap"
                title="Timer running - Click to open"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span className="tabular-nums font-semibold">
                  {formatTimerMinSec(timerSecondsRemaining)}
                </span>
              </button>
            ) : null}

            <button
              onClick={onOpenFormulas}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Formula Sheet</span>
            </button>

            <div className="relative group">
              <button
                onClick={exportBackupJSON}
                title="Backup data (JSON)"
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Restore data from JSON"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              title="Start from zero (Reset all syllabus & session logs)"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {showImportNotice && (
              <div className="fixed top-20 right-6 bg-emerald-600 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
                <Check className="w-4 h-4" />
                <span>Data imported successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Start From Zero?</h3>
                <p className="text-xs text-slate-600 mt-2">
                  This will reset all syllabus progress to 0%, clear all study session history and streaks, and give you a completely clean slate.
                </p>
                <div className="flex items-center justify-center gap-2 mt-5">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset Everything to 0%
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-200 py-2 gap-1 overflow-x-auto text-xs font-medium text-slate-600 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'syllabus' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
            }`}
          >
            Syllabus
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'timer' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
            }`}
          >
            Timer
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'notes' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('doubts')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'doubts' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
            }`}
          >
            Doubt Solver
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'tests' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
            }`}
          >
            Mock Tests
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'calendar' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
            }`}
          >
            Calendar
          </button>
        </div>
      </div>
    </header>
  );
};
