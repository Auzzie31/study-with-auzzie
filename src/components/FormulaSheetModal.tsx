import React, { useState } from 'react';
import { X, Search, Copy, Check, Filter } from 'lucide-react';
import { FORMULA_CHEATSHEET, FormulaItem } from '../data/formulaCheatsheet';
import { SubjectId } from '../types';

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<'all' | SubjectId>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredFormulas = FORMULA_CHEATSHEET.filter((item) => {
    const matchesSubject = subjectFilter === 'all' || item.subjectId === subjectFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleCopy = (item: FormulaItem) => {
    navigator.clipboard.writeText(`${item.title}: ${item.formula}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getSubjectColor = (subj: SubjectId) => {
    if (subj === 'physics') return 'text-sky-700 bg-sky-50 border-sky-200';
    if (subj === 'chemistry') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    return 'text-indigo-700 bg-indigo-50 border-indigo-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Class 9 STEM Formula Reference</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Physics</span>
              <span aria-hidden="true">·</span>
              <span>Chemistry</span>
              <span aria-hidden="true">·</span>
              <span>Mathematics</span>
              <span aria-hidden="true">·</span>
              <span>NCERT Aligned</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search formulas (e.g. motion, mole, heron, v=u+at)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setSubjectFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                subjectFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({FORMULA_CHEATSHEET.length})
            </button>
            <button
              onClick={() => setSubjectFilter('physics')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                subjectFilter === 'physics'
                  ? 'bg-white text-sky-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Physics
            </button>
            <button
              onClick={() => setSubjectFilter('chemistry')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                subjectFilter === 'chemistry'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chemistry
            </button>
            <button
              onClick={() => setSubjectFilter('mathematics')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                subjectFilter === 'mathematics'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mathematics
            </button>
          </div>
        </div>

        {/* Formula Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          {filteredFormulas.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No formulas matched your search query.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSubjectFilter('all');
                }}
                className="mt-2 text-xs text-indigo-600 hover:underline font-medium"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredFormulas.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="capitalize font-medium text-slate-700">{item.subjectId}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.chapter}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    
                    {/* Formula highlight block */}
                    <div className="mt-2 py-2 px-3 bg-slate-900 text-amber-200 font-mono text-sm rounded-lg overflow-x-auto tracking-wide selection:bg-amber-400 selection:text-slate-900">
                      <code>{item.formula}</code>
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1">
                      <p>{item.description}</p>
                      <span className="font-mono text-slate-600 shrink-0 italic">{item.unitsOrCondition}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item)}
                    title="Copy formula"
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredFormulas.length} formulas</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
