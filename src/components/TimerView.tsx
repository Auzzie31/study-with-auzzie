import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Volume2,
  VolumeX,
  CloudRain,
  Radio,
  Waves,
  Wind,
  Plus,
  Minus,
  Sparkles,
  BookOpen,
  Music,
  Headphones,
} from 'lucide-react';
import { Chapter, StudySession, SubjectId, Topic } from '../types';
import { playChimeSound, setAmbientVolume, startAmbientSound, stopAmbientSound } from '../utils/audio';

interface TimerViewProps {
  chapters: Chapter[];
  selectedTopic: Topic | null;
  onSelectTopic: (topic: Topic) => void;
  onLogSession: (session: StudySession) => void;
  recentSessions: StudySession[];
  onDeleteSession: (sessionId: string) => void;
  // External timer sync for running in background
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  secondsRemaining: number;
  setSecondsRemaining: React.Dispatch<React.SetStateAction<number>>;
  totalSessionSeconds: number;
  setTotalSessionSeconds: (seconds: number) => void;
}

export const TimerView: React.FC<TimerViewProps> = ({
  chapters,
  selectedTopic,
  onSelectTopic,
  onLogSession,
  recentSessions,
  onDeleteSession,
  isRunning,
  setIsRunning,
  secondsRemaining,
  setSecondsRemaining,
  totalSessionSeconds,
  setTotalSessionSeconds,
}) => {
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'pomodoro_25' | 'short_break' | 'long_break' | 'stopwatch'>('pomodoro');
  const [ambientSound, setAmbientSound] = useState<'none' | 'lofi' | 'rain' | 'whitenoise' | 'brownnoise' | 'stream'>('none');
  const [volume, setVolume] = useState<number>(0.3);
  const [chimeEnabled, setChimeEnabled] = useState(true);

  // Post-session reflection modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionRating, setSessionRating] = useState(4);
  const [completedMinutes, setCompletedMinutes] = useState(60);

  const allTopics = chapters.flatMap((c) => c.topics);

  // Timer mode configuration presets (Default Focus Mode: 1 Hour = 60m)
  const handleModeChange = (mode: 'pomodoro' | 'pomodoro_25' | 'short_break' | 'long_break' | 'stopwatch') => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === 'pomodoro') {
      setSecondsRemaining(60 * 60); // 1 Hour Focus Mode
      setTotalSessionSeconds(60 * 60);
    } else if (mode === 'pomodoro_25') {
      setSecondsRemaining(25 * 60);
      setTotalSessionSeconds(25 * 60);
    } else if (mode === 'short_break') {
      setSecondsRemaining(5 * 60);
      setTotalSessionSeconds(5 * 60);
    } else if (mode === 'long_break') {
      setSecondsRemaining(15 * 60);
      setTotalSessionSeconds(15 * 60);
    } else if (mode === 'stopwatch') {
      setSecondsRemaining(0);
      setTotalSessionSeconds(0);
    }
  };

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === 'stopwatch') {
          setSecondsRemaining((prev) => prev + 1);
        } else {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              if (chimeEnabled) playChimeSound();
              // Auto prompt logging if it was a focus session
              if (timerMode === 'pomodoro' || timerMode === 'pomodoro_25') {
                setCompletedMinutes(Math.round(totalSessionSeconds / 60));
                setShowLogModal(true);
              }
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerMode, totalSessionSeconds, chimeEnabled, setIsRunning, setSecondsRemaining]);

  // Ambient sound handler including Lo-Fi Beats
  const handleAmbientToggle = (type: 'none' | 'lofi' | 'rain' | 'whitenoise' | 'brownnoise' | 'stream') => {
    if (type === 'none') {
      stopAmbientSound();
      setAmbientSound('none');
    } else {
      setAmbientSound(type);
      startAmbientSound(type, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setAmbientVolume(newVol);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === 'pomodoro') {
      setSecondsRemaining(60 * 60);
    } else if (timerMode === 'pomodoro_25') {
      setSecondsRemaining(25 * 60);
    } else if (timerMode === 'short_break') {
      setSecondsRemaining(5 * 60);
    } else if (timerMode === 'long_break') {
      setSecondsRemaining(15 * 60);
    } else {
      setSecondsRemaining(0);
    }
  };

  const adjustMinutes = (delta: number) => {
    if (timerMode === 'stopwatch') return;
    setSecondsRemaining((prev) => {
      const next = Math.max(60, prev + delta * 60);
      setTotalSessionSeconds(next);
      return next;
    });
  };

  const handleCompleteEarly = () => {
    setIsRunning(false);
    let mins = 0;
    if (timerMode === 'stopwatch') {
      mins = Math.max(1, Math.round(secondsRemaining / 60));
    } else {
      const elapsed = totalSessionSeconds - secondsRemaining;
      mins = Math.max(1, Math.round(elapsed / 60));
    }
    setCompletedMinutes(mins);
    setShowLogModal(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newSession: StudySession = {
      id: `sess-${Date.now()}`,
      subjectId: selectedTopic.subjectId,
      chapterId: selectedTopic.chapterId,
      chapterTitle: selectedTopic.chapterTitle,
      topicId: selectedTopic.id,
      topicTitle: selectedTopic.title,
      durationMinutes: completedMinutes,
      date: todayStr,
      timestamp: Date.now(),
      mode: timerMode === 'stopwatch' ? 'stopwatch' : 'pomodoro',
      notes: sessionNotes.trim() || undefined,
      rating: sessionRating,
    };

    onLogSession(newSession);
    setShowLogModal(false);
    setSessionNotes('');
    handleReset();
  };

  // SVG circular progress calculation
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent =
    timerMode === 'stopwatch'
      ? Math.min(100, (secondsRemaining / 3600) * 100)
      : totalSessionSeconds > 0
      ? ((totalSessionSeconds - secondsRemaining) / totalSessionSeconds) * 100
      : 0;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Focused Study Session</span>
            <span aria-hidden="true">·</span>
            <span>Pomodoro & Deep Work Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Study Timer</h1>
        </div>

        {/* Chime toggle & Mode presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChimeEnabled(!chimeEnabled)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
              chimeEnabled
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            {chimeEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Chime {chimeEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timer Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Topic Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Current Studying Topic (Syllabus Linked)
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select
                value={selectedTopic?.id || ''}
                onChange={(e) => {
                  const t = allTopics.find((top) => top.id === e.target.value);
                  if (t) onSelectTopic(t);
                }}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-900 cursor-pointer"
              >
                {chapters.map((ch) => (
                  <optgroup key={ch.id} label={`${ch.subjectId.toUpperCase()}: Ch ${ch.number} - ${ch.title}`}>
                    {ch.topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {selectedTopic && (
                <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 font-mono tabular-nums px-2">
                  <span>Logged: {Math.floor((selectedTopic.minutesSpent || 0) / 60)}h {(selectedTopic.minutesSpent || 0) % 60}m</span>
                </div>
              )}
            </div>
          </div>

          {/* Timer Display Card */}
          <div className="p-8 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col items-center">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-8 overflow-x-auto max-w-full">
              <button
                onClick={() => handleModeChange('pomodoro')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  timerMode === 'pomodoro'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Focus Mode (1 Hour)
              </button>
              <button
                onClick={() => handleModeChange('pomodoro_25')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  timerMode === 'pomodoro_25'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sprint (25m)
              </button>
              <button
                onClick={() => handleModeChange('short_break')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  timerMode === 'short_break'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => handleModeChange('long_break')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  timerMode === 'long_break'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Long Break (15m)
              </button>
              <button
                onClick={() => handleModeChange('stopwatch')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  timerMode === 'stopwatch'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Stopwatch
              </button>
            </div>

            {/* Circular Dial Timer */}
            <div className="relative w-72 h-72 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
                {/* Background Ring */}
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  className="stroke-indigo-600 transition-all duration-300"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Centered Digital Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-5xl sm:text-6xl font-extrabold font-mono text-slate-900 tracking-tight tabular-nums">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-2">
                  {timerMode === 'pomodoro'
                    ? 'Focus Phase'
                    : timerMode === 'short_break'
                    ? 'Rest & Hydrate'
                    : timerMode === 'long_break'
                    ? 'Extended Rest'
                    : 'Elapsed Study'}
                </span>
                {selectedTopic && (
                  <span className="text-xs text-indigo-600 font-semibold max-w-[200px] truncate mt-1">
                    {selectedTopic.title}
                  </span>
                )}
              </div>
            </div>

            {/* Quick time adjustment buttons (only in countdown mode) */}
            {timerMode !== 'stopwatch' && !isRunning && (
              <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-600">
                <button
                  onClick={() => adjustMinutes(-5)}
                  className="p-1.5 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  title="Subtract 5 minutes"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-2xs text-slate-400 font-mono">Adjust duration</span>
                <button
                  onClick={() => adjustMinutes(5)}
                  className="p-1.5 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  title="Add 5 minutes"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={handleReset}
                title="Reset timer"
                className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-white" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>Start Focus</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCompleteEarly}
                title="Finish & log session"
                className="p-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Ambient Sound Generator & Session History */}
        <div className="space-y-6">
          {/* Ambient Sound Box */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Study Soundscapes</h3>
              </div>
              <span className="text-2xs font-mono text-slate-400">Pure WebAudio</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Synthesized background audio to block distractions while solving numericals.
            </p>

            <div className="space-y-2 mb-4">
              <button
                onClick={() => handleAmbientToggle(ambientSound === 'lofi' ? 'none' : 'lofi')}
                className={`w-full p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  ambientSound === 'lofi'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-800 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md ${ambientSound === 'lofi' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Lo-Fi Study Beats</div>
                    <div className="text-2xs font-normal text-slate-500">Mellow chillhop chords & vinyl crackle</div>
                  </div>
                </div>
                {ambientSound === 'lofi' && (
                  <span className="flex items-center gap-0.5 text-indigo-600">
                    <span className="w-1 h-3 bg-indigo-600 rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </span>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAmbientToggle(ambientSound === 'rain' ? 'none' : 'rain')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    ambientSound === 'rain'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <CloudRain className="w-4 h-4" />
                  <span>Rain Focus</span>
                </button>

                <button
                  onClick={() =>
                    handleAmbientToggle(ambientSound === 'brownnoise' ? 'none' : 'brownnoise')
                  }
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    ambientSound === 'brownnoise'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Wind className="w-4 h-4" />
                  <span>Brown Noise</span>
                </button>

                <button
                  onClick={() =>
                    handleAmbientToggle(ambientSound === 'whitenoise' ? 'none' : 'whitenoise')
                  }
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    ambientSound === 'whitenoise'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>White Noise</span>
                </button>

                <button
                  onClick={() =>
                    handleAmbientToggle(ambientSound === 'stream' ? 'none' : 'stream')
                  }
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    ambientSound === 'stream'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Waves className="w-4 h-4" />
                  <span>Water Stream</span>
                </button>
              </div>
            </div>

            {ambientSound !== 'none' && (
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <button
                  onClick={() => handleAmbientToggle('none')}
                  className="text-xs text-rose-600 hover:underline shrink-0"
                >
                  Stop
                </button>
              </div>
            )}
          </div>

          {/* Recent Completed Sessions Log */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Today's Sessions</h3>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {recentSessions.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No sessions recorded today. Start the timer to log your study minutes.
                </p>
              ) : (
                recentSessions.slice(0, 6).map((sess) => (
                  <div
                    key={sess.id}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition-colors flex items-center justify-between text-xs group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-slate-900 truncate">{sess.topicTitle}</p>
                      <div className="text-2xs text-slate-500 font-mono tabular-nums">
                        <span>{sess.durationMinutes} min</span>
                        <span> · </span>
                        <span className="capitalize">{sess.subjectId}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteSession(sess.id)}
                      className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete log"
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Log Study Session</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Record your takeaways for {selectedTopic?.title}
              </p>
            </div>

            <form onSubmit={handleSaveSession} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Study Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={600}
                  value={completedMinutes}
                  onChange={(e) => setCompletedMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic Comprehension (1-5 stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSessionRating(star)}
                      className={`text-lg transition-transform hover:scale-110 cursor-pointer ${
                        star <= sessionRating ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 font-mono ml-2">
                    {sessionRating === 5
                      ? 'Solid understanding'
                      : sessionRating >= 4
                      ? 'Good progress'
                      : sessionRating >= 3
                      ? 'Needs review'
                      : 'Challenging'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Notes & Formulas Covered
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Solved 5 NCERT exercises on acceleration; reviewed v²-u²=2as graphical proof."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer font-semibold"
                >
                  Save to Study Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
