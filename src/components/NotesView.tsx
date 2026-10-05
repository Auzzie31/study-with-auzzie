import React, { useState } from 'react';
import {
  Search,
  Plus,
  Pin,
  Trash2,
  Edit3,
  Copy,
  Check,
  Tag,
  BookOpen,
  Sparkles,
  FileText,
  BookmarkPlus,
  BookMarked,
  User,
} from 'lucide-react';
import { Chapter, StudyNote, SubjectId } from '../types';
import { READY_MADE_NOTES } from '../data/readyMadeNotes';

interface NotesViewProps {
  notes: StudyNote[];
  chapters: Chapter[];
  onSaveNote: (note: StudyNote) => void;
  onDeleteNote: (noteId: string) => void;
  initialTopicId?: string;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  chapters,
  onSaveNote,
  onDeleteNote,
  initialTopicId,
}) => {
  const [noteSource, setNoteSource] = useState<'ready_made' | 'my_notes'>('ready_made');
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Active note selection
  const currentPool = noteSource === 'ready_made' ? READY_MADE_NOTES : notes;
  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    if (initialTopicId) {
      const match = READY_MADE_NOTES.find((n) => n.topicId === initialTopicId) || notes.find((n) => n.topicId === initialTopicId);
      if (match) return match.id;
    }
    return READY_MADE_NOTES[0]?.id || '';
  });

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clonedNotice, setClonedNotice] = useState(false);

  // Active note in current pool
  const activeNote = currentPool.find((n) => n.id === activeNoteId) || currentPool[0] || null;

  // Editor states
  const [editTitle, setEditTitle] = useState(activeNote?.title || '');
  const [editContent, setEditContent] = useState(activeNote?.content || '');
  const [editSubject, setEditSubject] = useState<SubjectId>(activeNote?.subjectId || 'physics');
  const [editTags, setEditTags] = useState(activeNote?.tags.join(', ') || '');

  const handleSelectNote = (n: StudyNote) => {
    setActiveNoteId(n.id);
    setEditTitle(n.title);
    setEditContent(n.content);
    setEditSubject(n.subjectId);
    setEditTags(n.tags.join(', '));
    setIsEditing(false);
  };

  const handleSwitchSource = (source: 'ready_made' | 'my_notes') => {
    setNoteSource(source);
    setIsEditing(false);
    const pool = source === 'ready_made' ? READY_MADE_NOTES : notes;
    if (pool.length > 0) {
      handleSelectNote(pool[0]);
    }
  };

  const handleCreateNewNote = () => {
    const newNote: StudyNote = {
      id: `custom-note-${Date.now()}`,
      title: 'Untitled Class 9 Study Note',
      subjectId: selectedSubject === 'all' ? 'physics' : selectedSubject,
      content: `# Topic Concept & Summary

## 1. Key Definitions & Core Concept
- Write your understanding in your own words...

## 2. Important Formulas & Equations
- Formula: 

## 3. Solved Numerical / Typical Exam Question
- **Problem**: 
- **Solution**: 
`,
      tags: ['Class9', 'MyNote'],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveNote(newNote);
    setNoteSource('my_notes');
    setActiveNoteId(newNote.id);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditSubject(newNote.subjectId);
    setEditTags(newNote.tags.join(', '));
    setIsEditing(true);
  };

  const handleCloneReadyMadeNote = (readyNote: StudyNote) => {
    const customized: StudyNote = {
      ...readyNote,
      id: `cloned-note-${Date.now()}`,
      title: `${readyNote.title} (My Notes)`,
      tags: [...readyNote.tags, 'Customized'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveNote(customized);
    setNoteSource('my_notes');
    handleSelectNote(customized);
    setClonedNotice(true);
    setTimeout(() => setClonedNotice(false), 2000);
  };

  const handleSaveActiveNote = () => {
    if (!activeNote || noteSource !== 'my_notes') return;

    const tagsArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updated: StudyNote = {
      ...activeNote,
      title: editTitle.trim() || 'Untitled Note',
      content: editContent,
      subjectId: editSubject,
      tags: tagsArray,
      updatedAt: new Date().toISOString(),
    };

    onSaveNote(updated);
    setIsEditing(false);
  };

  const handleTogglePin = (note: StudyNote) => {
    if (noteSource === 'my_notes') {
      onSaveNote({
        ...note,
        isPinned: !note.isPinned,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleCopyMarkdown = () => {
    if (activeNote) {
      navigator.clipboard.writeText(`${activeNote.title}\n\n${activeNote.content}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const insertSymbol = (sym: string) => {
    setEditContent((prev) => prev + sym);
  };

  const filteredNotes = currentPool
    .filter((n) => selectedSubject === 'all' || n.subjectId === selectedSubject)
    .filter((n) => {
      const term = searchTerm.toLowerCase();
      return (
        n.title.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term) ||
        n.tags.some((t) => t.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Header with segmented switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Class 9 Science & Mathematics</span>
            <span aria-hidden="true">·</span>
            <span>Revision Guides & Personal Notebook</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Study Notes Hub</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Note Source Switcher */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg">
            <button
              onClick={() => handleSwitchSource('ready_made')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                noteSource === 'ready_made'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Ready-Made Notes ({READY_MADE_NOTES.length})</span>
            </button>
            <button
              onClick={() => handleSwitchSource('my_notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                noteSource === 'my_notes'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Own Notes ({notes.length})</span>
            </button>
          </div>

          <button
            onClick={handleCreateNewNote}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Own Note</span>
          </button>
        </div>
      </div>

      {clonedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Note copied to <strong>My Own Notes</strong>! You can now freely edit, add personal examples, and save.</span>
        </div>
      )}

      {/* Main Split Layout: Sidebar Notes List + Note View/Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Column: Note Finder & List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Subject Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedSubject('physics')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'physics'
                  ? 'bg-white text-sky-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Physics
            </button>
            <button
              onClick={() => setSelectedSubject('chemistry')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'chemistry'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chemistry
            </button>
            <button
              onClick={() => setSelectedSubject('mathematics')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedSubject === 'mathematics'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Math
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${noteSource === 'ready_made' ? 'ready-made' : 'personal'} notes...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Notes List */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[580px] pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                {noteSource === 'my_notes' ? (
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-700">No personal notes yet.</p>
                    <p>Create your own note from scratch, or browse "Ready-Made Notes" and save a copy to personalize.</p>
                    <button
                      onClick={handleCreateNewNote}
                      className="px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg text-xs"
                    >
                      Create First Note
                    </button>
                  </div>
                ) : (
                  <p>No ready-made notes matched your search query.</p>
                )}
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === activeNote?.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-2xs text-slate-500 mb-1">
                          <span className="capitalize font-semibold text-slate-700">
                            {note.subjectId}
                          </span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">
                            {note.updatedAt.split('T')[0]}
                          </span>
                          {noteSource === 'ready_made' && (
                            <>
                              <span>·</span>
                              <span className="text-indigo-600 font-medium">Ready-Made</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 truncate">{note.title}</h3>
                        <p className="text-2xs text-slate-500 line-clamp-2 mt-1">
                          {note.content.replace(/[#*`$]/g, '').trim()}
                        </p>
                      </div>

                      {note.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-2xs text-slate-500 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Viewer / Editor (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {activeNote ? (
            <>
              {/* Note Action Toolbar */}
              <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  {noteSource === 'my_notes' ? (
                    <>
                      <button
                        onClick={() => handleTogglePin(activeNote)}
                        title={activeNote.isPinned ? 'Unpin note' : 'Pin note to top'}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          activeNote.isPinned
                            ? 'border-amber-300 bg-amber-50 text-amber-600'
                            : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Pin className={`w-4 h-4 ${activeNote.isPinned ? 'fill-amber-500' : ''}`} />
                      </button>

                      <button
                        onClick={handleCopyMarkdown}
                        title="Copy note markdown"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => onDeleteNote(activeNote.id)}
                        title="Delete note"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleCloneReadyMadeNote(activeNote)}
                        title="Save as editable copy in My Notes"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Copy to My Notes</span>
                      </button>

                      <button
                        onClick={handleCopyMarkdown}
                        title="Copy content"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {noteSource === 'my_notes' && (
                    <>
                      {isEditing ? (
                        <button
                          onClick={handleSaveActiveNote}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Save Changes
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Note</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Math / Science Quick Symbol Inserter (when editing) */}
              {isEditing && (
                <div className="p-3 bg-slate-100 border-b border-slate-200">
                  <div className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">
                    Quick Insert Symbols & Formulas:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[
                      'Δ',
                      'λ',
                      'π',
                      'θ',
                      'ν',
                      'ρ',
                      '√',
                      '²',
                      '³',
                      '±',
                      '≈',
                      '≤',
                      '≥',
                      '→',
                      '⇌',
                      'v = u + at',
                      's = ut + ½at²',
                      'F = ma',
                      'p = mv',
                      'W = F·s',
                      'n = m/M',
                      'H₂O',
                      'CO₂',
                      'SO₄²⁻',
                    ].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => insertSymbol(sym)}
                        className="px-2 py-0.5 text-xs font-mono bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded transition-colors cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Note Content Area */}
              <div className="p-6 flex-1 overflow-y-auto">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Note Title
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Subject
                        </label>
                        <select
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value as SubjectId)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg capitalize"
                        >
                          <option value="physics">Physics</option>
                          <option value="chemistry">Chemistry</option>
                          <option value="mathematics">Mathematics</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="e.g. Kinematics, Formulas, High-Yield"
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Content (Markdown & Equation Friendly)
                      </label>
                      <textarea
                        rows={14}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* View mode */}
                    <div className="mb-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="capitalize font-semibold text-slate-700">
                          {activeNote.subjectId}
                        </span>
                        <span>·</span>
                        <span>{noteSource === 'ready_made' ? 'Ready-Made NCERT Guide' : `Updated ${activeNote.updatedAt.split('T')[0]}`}</span>
                        {noteSource === 'ready_made' && (
                          <>
                            <span>·</span>
                            {activeNote.subjectId === 'mathematics' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Theory & Formulas
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                Pure Theory Only (No Formulas)
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {activeNote.title}
                      </h2>

                      {activeNote.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Tag className="w-3 h-3 text-slate-400" />
                          <div className="flex gap-2 text-xs text-slate-500 font-mono">
                            {activeNote.tags.map((t, i) => (
                              <span key={i}>#{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Rendered content */}
                    <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-800">
                      {activeNote.content}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-slate-500">
              <p className="text-sm">Select or create a study note to start revising.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
