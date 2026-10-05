import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  BookmarkPlus,
  RotateCcw,
  Zap,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { SubjectId, StudyNote } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: SubjectId;
}

interface DoubtSolverViewProps {
  onSaveToNotes: (note: StudyNote) => void;
  defaultSubject?: SubjectId;
}

const SAMPLE_DOUBTS = [
  {
    subject: 'physics' as SubjectId,
    text: 'Derive the relation between distance, acceleration, and time (s = ut + ½at²) graphically.',
  },
  {
    subject: 'physics' as SubjectId,
    text: 'Why does a gun recoil backward when a bullet is fired? Explain using Newton’s third law.',
  },
  {
    subject: 'chemistry' as SubjectId,
    text: 'Differentiate between a true solution, a colloid, and a suspension with examples and Tyndall effect.',
  },
  {
    subject: 'chemistry' as SubjectId,
    text: 'State Bohr’s postulates of the atomic model and describe how electrons are arranged in shells.',
  },
  {
    subject: 'mathematics' as SubjectId,
    text: 'Find the distance between points P(2, -3) and Q(5, 1) and calculate the coordinates of their midpoint.',
  },
  {
    subject: 'mathematics' as SubjectId,
    text: 'If x + y + z = 0, prove that x³ + y³ + z³ = 3xyz with step-by-step working.',
  },
  {
    subject: 'mathematics' as SubjectId,
    text: 'In the sequence 3, 7, 11, 15, ..., how do I find the 20th term and the sum of the first 20 terms?',
  },
  {
    subject: 'mathematics' as SubjectId,
    text: 'A bag has 4 red and 6 black balls. What is the theoretical probability of picking a red ball?',
  },
];

export const DoubtSolverView: React.FC<DoubtSolverViewProps> = ({
  onSaveToNotes,
  defaultSubject = 'physics',
}) => {
  const [subject, setSubject] = useState<SubjectId>(defaultSubject);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `👋 **Hi! I am Auzzie, your Class 9 STEM AI Tutor.**

Ask me any doubt in **Physics, Chemistry, or Mathematics**! I will provide:
- Step-by-step numerical solutions with given values, applied formulas, and SI units.
- Concept clarifications (e.g. *mass vs weight*, *latent heat*, *congruence criteria*).
- Proofs and graphical derivations.

*Type your question below or click any of the suggested doubts to get started!*`,
      timestamp: 'Just now',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Send chat history to backend Gemini proxy
      const apiMessages = newHistory
        .filter((m) => m.id !== 'welcome-msg')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          subject,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${res.status}`);
      }

      const data = await res.json();
      const assistantText = data.text || 'I could not generate an answer at this time. Please try again.';

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error querying Auzzie:', err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Sorry, I could not process your doubt right now. (${err.message || 'Network error'}). Please verify your question and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSaveToNotes = (msg: Message, questionText: string) => {
    const newNote: StudyNote = {
      id: `doubt-note-${Date.now()}`,
      title: `Doubt Solution: ${questionText.slice(0, 45)}...`,
      subjectId: msg.subject || subject,
      content: `# Solved Doubt: ${questionText}\n\n${msg.content}`,
      tags: ['Class9', 'SolvedDoubt', msg.subject || subject],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveToNotes(newNote);
    setSavedId(msg.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `Chat history cleared. How can I help you with your Class 9 studies today?`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Powered by Gemini 3.8</span>
            <span aria-hidden="true">·</span>
            <span>Class 9 CBSE/NCERT Doubt Solver</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Auzzie AI Doubt Solver</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Subject Focus Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSubject('physics')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                subject === 'physics' ? 'bg-white text-sky-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Physics
            </button>
            <button
              onClick={() => setSubject('chemistry')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                subject === 'chemistry' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chemistry
            </button>
            <button
              onClick={() => setSubject('mathematics')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                subject === 'mathematics' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Math
            </button>
          </div>

          <button
            onClick={handleClearChat}
            title="Reset conversation"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Doubts Chips */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Frequently Asked Class 9 Doubts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_DOUBTS.map((doubt, i) => (
            <button
              key={i}
              onClick={() => {
                setSubject(doubt.subject);
                handleSendMessage(doubt.text);
              }}
              className="text-xs text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 py-1.5 px-3 rounded-lg text-left transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="capitalize font-mono text-2xs text-slate-400">[{doubt.subject.slice(0, 3)}]</span>
              <span>{doubt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col min-h-[500px] max-h-[680px]">
        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            // Find corresponding question for assistant messages to attach to notes
            const previousQuestion = !isUser && index > 0 ? messages[index - 1]?.content : '';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-xs rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Actions for assistant messages */}
                  {!isUser && msg.id !== 'welcome-msg' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-2xs text-slate-500">
                      <span className="font-mono">{msg.timestamp}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          title="Copy explanation"
                          className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600 transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSaveToNotes(msg, previousQuestion)}
                          title="Save this answer to My Notes"
                          className="flex items-center gap-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded text-indigo-700 font-semibold transition-colors cursor-pointer"
                        >
                          {savedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <BookmarkPlus className="w-3 h-3" />}
                          <span>{savedId === msg.id ? 'Saved to Notes!' : 'Save to My Notes'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                </span>
                <span className="font-medium text-slate-700">Auzzie is computing the step-by-step solution...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask your ${subject} doubt (e.g. Derive formula, solve numerical, explain concept)...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Ask Auzzie</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-1.5 text-2xs text-slate-400 text-center font-mono">
            NCERT / CBSE Class 9 curriculum aligned · Explanations verified step-by-step
          </div>
        </div>
      </div>
    </div>
  );
};
