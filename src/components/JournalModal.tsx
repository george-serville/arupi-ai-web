import React, { useState } from "react";
import { 
  X, Plus, Trash2, Search, Filter, BookOpen, AlertCircle, 
  Heart, Brain, Zap, Shield, Sparkles, Edit2, Check, RotateCcw, Calendar 
} from "lucide-react";
import { JournalEntry } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean; // Retained in props signature but ignored for the container's interior to satisfy "always in lighter colors"
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, "id" | "timestamp">) => void;
  onDeleteEntry: (id: string) => void;
  onUpdateEntry: (entry: JournalEntry) => void;
}

export default function JournalModal({
  isOpen,
  onClose,
  entries,
  onAddEntry,
  onDeleteEntry,
  onUpdateEntry,
}: JournalModalProps) {
  const [category, setCategory] = useState<"thought" | "obsession" | "anxiety" | "fear">("thought");
  const [content, setContent] = useState("");
  const [followUpAction, setFollowUpAction] = useState("");
  const [intensity, setIntensity] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<"thought" | "obsession" | "anxiety" | "fear">("thought");
  const [editContent, setEditContent] = useState("");
  const [editFollowUp, setEditFollowUp] = useState("");
  const [editIntensity, setEditIntensity] = useState<number>(3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddEntry({
      category,
      content: content.trim(),
      intensity,
      followUpAction: followUpAction.trim(),
    });

    setContent("");
    setFollowUpAction("");
    setIntensity(3);
    setIsAdding(false);
  };

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEditCategory(entry.category);
    setEditContent(entry.content);
    setEditIntensity(entry.intensity);
    setEditFollowUp(entry.followUpAction || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateSubmit = (id: string) => {
    if (!editContent.trim()) return;
    
    onUpdateEntry({
      id,
      category: editCategory,
      content: editContent.trim(),
      intensity: editIntensity,
      followUpAction: editFollowUp.trim(),
      timestamp: entries.find(e => e.id === id)?.timestamp || new Date().toISOString()
    });
    setEditingId(null);
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.followUpAction && entry.followUpAction.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || entry.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const categoryIcons = {
    thought: <Brain className="w-4 h-4 text-sky-500" />,
    obsession: <Zap className="w-4 h-4 text-violet-500" />,
    anxiety: <Heart className="w-4 h-4 text-pink-500" />,
    fear: <Shield className="w-4 h-4 text-rose-500" />,
  };

  const categoryStyles = {
    thought: "bg-sky-50 text-sky-700 border border-sky-200/80",
    obsession: "bg-violet-50 text-violet-700 border border-violet-200/80",
    anxiety: "bg-pink-50 text-pink-700 border border-pink-250/80",
    fear: "bg-rose-50 text-rose-700 border border-rose-200/80",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box (Open Journal Binder - Always styled as an exquisite warm cream book/journal) */}
      <div
        id="journal-modal-container"
        className="relative w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-2 bg-[#FDFBF7] text-stone-900 border-pink-200/80 transition-all duration-300 select-none font-sans"
      >
        {/* Book Spine Visual Accent on Left Margin */}
        <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-stone-600/10 to-transparent pointer-events-none z-20" />
        <div className="absolute left-0 top-0 bottom-0 w-4 border-r border-stone-400/20 pointer-events-none z-20" />

        {/* Spiral Binder Rings down the left side */}
        <div className="absolute left-6 top-10 bottom-10 flex flex-col justify-between pointer-events-none z-30 w-3.5 select-none opacity-60">
          {Array.from({ length: 14 }).map((_, i) => (
            <div 
              key={i} 
              className="w-5 h-3 rounded-full bg-gradient-to-r from-stone-400 via-stone-200 to-stone-500 shadow-sm border border-stone-400/30 -ml-2" 
            />
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-pink-100/80 pl-16 z-10 bg-[#FAF7F2]/95">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-base font-bold tracking-tight font-sans text-stone-900">Self-Reflection Journal</h3>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-mono font-medium">
                Ruled pages of self-reflection and actions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full transition-colors cursor-pointer hover:bg-stone-200/50 text-stone-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters and New Page Button Panel */}
        <div className="px-8 py-4 pl-16 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 z-10 border-b border-pink-100/80 bg-[#FAF7F2]/90">
          {/* Search & Category Filter */}
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-xs min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search reflections or actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border outline-none focus:border-indigo-500/50 transition-all bg-white border-blue-200 text-stone-900 placeholder-stone-400"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer focus:border-indigo-500/50 transition-all bg-white border-blue-200 text-stone-900"
              >
                <option value="all">All Categories</option>
                <option value="thought">Thoughts</option>
                <option value="obsession">Obsessions</option>
                <option value="anxiety">Anxieties</option>
                <option value="fear">Fears</option>
              </select>
            </div>
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl active:scale-95 transition-all self-end sm:self-auto cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Log New State</span>
            </button>
          )}
        </div>

        {/* Content Area (Lined ruled page of book) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 pl-16 relative bg-[#FCFAF5]">
          {/* Notebook Red/Pink Margin Lines */}
          <div className="absolute left-10 top-0 bottom-0 w-[1px] border-l border-pink-300 pointer-events-none" />
          <div className="absolute left-[41px] top-0 bottom-0 w-[1px] border-l border-pink-200/50 pointer-events-none" />

          <AnimatePresence mode="wait">
            {/* 1. Add Entry Form (Visualized as a new diary page insertion) */}
            {isAdding && (
              <motion.div
                key="add-form"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative p-6 mb-8 rounded-xl border shadow-xs bg-white border-pink-200"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-pink-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      New Journal Entry Page
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setIsAdding(false)}
                      className="text-stone-400 hover:text-stone-600 text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Category Selection */}
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5 font-bold">
                        Category Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["thought", "obsession", "anxiety", "fear"] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                              category === cat
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-semibold"
                                : "bg-stone-50 border-stone-150 text-stone-600 hover:bg-stone-100"
                            }`}
                          >
                            {categoryIcons[cat]}
                            <span className="capitalize">{cat}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Intensity Slider */}
                    <div className="md:col-span-7">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                          Intensity / Weight
                        </span>
                        <span className="text-xs font-bold text-indigo-500">{intensity} / 5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={intensity}
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer py-1.5"
                      />
                      <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-1">
                        <span>Mild</span>
                        <span>Moderate</span>
                        <span>Severe</span>
                      </div>
                    </div>

                    {/* Thought Content Input */}
                    <div className="md:col-span-12">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5 font-bold">
                        Thought / Reflection / State
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="What state is your consciousness currently in? Write down the honest reflection..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed bg-stone-50 border-stone-200 text-stone-800 placeholder-stone-400"
                      />
                    </div>

                    {/* Follow Up Action Input */}
                    <div className="md:col-span-12">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-indigo-500 mb-1.5 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Follow up Action / Thought
                      </label>
                      <textarea
                        rows={2}
                        placeholder="What acts of release, counter-weights, or plans can alleviate this state?"
                        value={followUpAction}
                        onChange={(e) => setFollowUpAction(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed bg-stone-50 border-stone-200 text-stone-800 placeholder-stone-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      Save Reflection
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. Journal Entry Pages list (Lined Paper Blocks with light pink/blue borders) */}
          <div className="space-y-8 pl-4">
            {filteredEntries.length === 0 ? (
              <div className="py-20 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-stone-300 mb-3 stroke-[1]" />
                <h4 className="text-sm font-semibold text-stone-700">Pages are blank</h4>
                <p className="text-xs text-stone-400 italic max-w-sm mx-auto mt-1">
                  No states matching your queries have been written down yet. Write one above to start reflecting.
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {filteredEntries.map((entry) => {
                  const isEditing = editingId === entry.id;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`relative p-6 sm:p-8 rounded-xl border shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 ${
                        isEditing
                          ? "bg-white border-blue-200"
                          : "bg-white hover:bg-[#FDFBF7] border-pink-150 hover:border-blue-200"
                      }`}
                    >
                      {/* Decorative Left Notebook Margin Ribbon in pink */}
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-pink-300/70" />

                      {isEditing ? (
                        /* Inline Editor Mode */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-pink-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                              <Edit2 className="w-3.5 h-3.5" />
                              Editing Journal Entry
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateSubmit(entry.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center gap-1 px-3 py-1 bg-stone-500 hover:bg-stone-400 text-white rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Cancel
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Edit Category */}
                            <div>
                              <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1 font-bold">
                                Edit Category
                              </label>
                              <div className="flex flex-wrap gap-1.5">
                                {(["thought", "obsession", "anxiety", "fear"] as const).map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setEditCategory(cat)}
                                    className={`py-1 px-2 rounded text-[11px] font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                                      editCategory === cat
                                        ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                                    }`}
                                  >
                                    {categoryIcons[cat]}
                                    <span className="capitalize">{cat}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Edit Intensity */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                                  Intensity ({editIntensity}/5)
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={editIntensity}
                                onChange={(e) => setEditIntensity(Number(e.target.value))}
                                className="w-full accent-indigo-500 cursor-pointer"
                              />
                            </div>

                            {/* Edit Content */}
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1 font-bold">
                                Thought / Reflection / State
                              </label>
                              <textarea
                                rows={3}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded border outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed bg-white border-blue-200 text-stone-900"
                              />
                            </div>

                            {/* Edit Follow Up */}
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-mono uppercase tracking-wider text-indigo-500 mb-1 font-bold">
                                Follow up Action / Thought
                              </label>
                              <textarea
                                rows={2}
                                value={editFollowUp}
                                onChange={(e) => setEditFollowUp(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded border outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed bg-white border-blue-200 text-stone-900"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Normal Read Mode (The Beautiful Ruled Book Page View) */
                        <div className="space-y-5">
                          {/* Entry Metadata Header */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-pink-100/60">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${categoryStyles[entry.category]}`}>
                                {categoryIcons[entry.category]}
                                <span>{entry.category}</span>
                              </span>
                              
                              {/* Intensity Notches */}
                              <div className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded-full border border-pink-100">
                                <span className="text-[9px] font-mono uppercase text-stone-400 mr-1 font-bold">WT:</span>
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <span 
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      i <= entry.intensity
                                        ? entry.category === "thought" ? "bg-sky-500"
                                          : entry.category === "obsession" ? "bg-violet-500"
                                          : entry.category === "anxiety" ? "bg-pink-500"
                                          : "bg-rose-500"
                                        : "bg-stone-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Actions + Timestamp */}
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center gap-1 text-[10px] text-stone-500 font-mono font-bold">
                                <Calendar className="w-3 h-3 text-indigo-400" />
                                {new Date(entry.timestamp).toLocaleString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>

                              {/* Edit & Delete Action Buttons */}
                              <div className="flex items-center gap-1 pl-2 border-l border-pink-100">
                                <button
                                  onClick={() => startEdit(entry)}
                                  className="p-1.5 rounded transition-all cursor-pointer hover:bg-stone-100 text-stone-500 hover:text-indigo-600"
                                  title="Edit entry"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteEntry(entry.id)}
                                  className="p-1.5 rounded transition-all cursor-pointer hover:bg-red-50 text-stone-500 hover:text-red-600"
                                  title="Delete entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Ruled Notebook Line - Thought / Reflection / State */}
                          <div className="relative pl-6 border-l-2 border-blue-200">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-2 font-bold select-none">
                              Thought / Reflection / State
                            </div>
                            <div 
                              className="font-serif text-sm sm:text-base text-stone-900 leading-8 relative pl-1"
                              style={{
                                backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(147, 197, 253, 0.4) 31px, rgba(147, 197, 253, 0.4) 32px)",
                                backgroundSize: "100% 32px",
                                lineHeight: "32px",
                                paddingTop: "1px",
                              }}
                            >
                              {entry.content}
                            </div>
                          </div>

                          {/* Ruled Notebook Line - Follow up Action / Thought */}
                          <div className="relative pl-6 border-l-2 border-pink-200 mt-4 pt-1">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-500 mb-2 font-bold select-none flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Follow up Action / Thought</span>
                            </div>
                            <div 
                              className="font-serif text-sm text-stone-850 leading-7 relative pl-1"
                              style={{
                                backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(147, 197, 253, 0.25) 27px, rgba(147, 197, 253, 0.25) 28px)",
                                backgroundSize: "100% 28px",
                                lineHeight: "28px",
                                paddingTop: "1px",
                              }}
                            >
                              {entry.followUpAction || (
                                <span className="text-stone-400 italic">
                                  No follow-up action plan registered. Click edit to add.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 pl-16 flex items-center justify-between border-t border-pink-100 pl-16 text-[10px] font-mono tracking-wider text-stone-500 uppercase z-10 bg-[#FAF7F2]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Integrated with Clone core memory and release protocols</span>
          </div>
          <span>Total logged: {entries.length} pages</span>
        </div>
      </div>
    </div>
  );
}

