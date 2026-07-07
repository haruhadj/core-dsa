import React, { useState } from "react";
import { DSATopic, DifficultyLevel, TopicCategory } from "../types";
import { DSA_TOPICS } from "../data/roadmapData";
import { BookOpen, Search, Filter, Cpu, CheckSquare, Sparkles, Copy, Check, FileText, Bookmark } from "lucide-react";

interface RoadmapViewProps {
  onSelectTopic?: (topicId: string) => void;
  completedTopics: string[];
  onToggleCompleteTopic: (topicId: string) => void;
  savedNotes: Record<string, string>;
  onSaveNote: (topicId: string, note: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  onSelectTopic,
  completedTopics,
  onToggleCompleteTopic,
  savedNotes,
  onSaveNote,
}) => {
  const [topics] = useState<DSATopic[]>(DSA_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<DSATopic>(DSA_TOPICS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TopicCategory | "ALL">("ALL");
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel | "ALL">("ALL");
  const [copied, setCopied] = useState(false);
  const [noteText, setNoteText] = useState(savedNotes[selectedTopic.id] || "");

  // Update note text state, ensuring sync on topic shift
  React.useEffect(() => {
    setNoteText(savedNotes[selectedTopic.id] || "");
  }, [selectedTopic, savedNotes]);

  const handleSaveNoteLocal = () => {
    onSaveNote(selectedTopic.id, noteText);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(selectedTopic.typescriptTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTopics = topics.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "ALL" || t.category === activeCategory;
    const matchesDifficulty = activeDifficulty === "ALL" || t.difficulty === activeDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 leading-relaxed text-slate-100 font-sans">
      
      {/* 1. Roadmap curriculum explorer list (Left Side) */}
      <div className="xl:col-span-4 space-y-4">
        {/* Search header & configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search curriculum..."
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Navigation filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase font-mono">
              <Filter className="w-3 h-3" /> Filters
            </div>
            {/* Category selection */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(["ALL", "DS", "ALGO"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all select-none ${
                    activeCategory === cat
                      ? "bg-slate-850 text-indigo-400 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat === "ALL" ? "All Types" : cat === "DS" ? "Data Str" : "Algorithms"}
                </button>
              ))}
            </div>

            {/* Difficulty selection */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(["ALL", "Easy", "Medium", "Hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setActiveDifficulty(diff)}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all select-none ${
                    activeDifficulty === diff
                      ? "bg-slate-850 text-indigo-400 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nodes checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-mono pl-1">
            Learning Pathways ({filteredTopics.length} steps)
          </div>
          {filteredTopics.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-mono">No steps matching filters.</div>
          ) : (
            filteredTopics.map((item) => {
              const isSelected = selectedTopic.id === item.id;
              const isCompleted = completedTopics.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-indigo-600/15 border-indigo-500/80 text-white"
                      : "bg-slate-955 hover:bg-slate-850 border-slate-850 hover:border-slate-700 text-slate-300"
                  }`}
                  onClick={() => setSelectedTopic(item)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompleteTopic(item.id);
                      }}
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                        isCompleted
                          ? "bg-emerald-600 border-emerald-400 text-white"
                          : "border-slate-700 group-hover:border-slate-500"
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="uppercase text-[9px] text-indigo-400 font-semibold">{item.category}</span>
                        <span>•</span>
                        <span className="text-[9px] text-slate-500">{item.complexity.time.split(";")[0].substring(0, 15)}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                      item.difficulty === "Easy"
                        ? "bg-emerald-505/10 text-emerald-400 border-emerald-500/20"
                        : item.difficulty === "Medium"
                        ? "bg-amber-505/10 text-amber-400 border-amber-500/20"
                        : "bg-rose-505/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Deep Topic Details (Right Side) */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Core Topic summary card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-md uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  {selectedTopic.category === "DS" ? "Data Structure" : "Algorithm"}
                </span>
                <span className="text-xs text-slate-500 font-mono">• {selectedTopic.difficulty} Tier</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1 select-all">{selectedTopic.name}</h2>
            </div>
            
            <button
              onClick={() => onToggleCompleteTopic(selectedTopic.id)}
              className={`px-4 py-2 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all select-none ${
                completedTopics.includes(selectedTopic.id)
                  ? "bg-emerald-600/15 border border-emerald-500/40 text-emerald-300"
                  : "bg-indigo-600 hover:bg-indigo-505 text-white shadow-lg"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {completedTopics.includes(selectedTopic.id) ? "Mark Incomplete" : "Mark as Completed"}
            </button>
          </div>

          <p className="text-sm text-slate-350 leading-relaxed font-sans">
            {selectedTopic.fullDesc}
          </p>

          {/* Big-O Complexity tables and stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-3">
              <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 font-mono">
                <Cpu className="w-4 h-4" /> Performance Panels (Time)
              </div>
              <table className="w-full text-xs font-mono text-slate-300">
                <tbody>
                  <tr className="border-b border-slate-800/60 py-2">
                    <td className="text-slate-500 py-1.5">Best Frame Complexity:</td>
                    <td className="text-right font-bold text-slate-100 pr-1">{selectedTopic.complexity.best || "O(1)"}</td>
                  </tr>
                  <tr className="border-b border-slate-800/60 py-2">
                    <td className="text-slate-500 py-1.5">Average Performance:</td>
                    <td className="text-right font-bold text-indigo-300 pr-1">{selectedTopic.complexity.average || "O(1)"}</td>
                  </tr>
                  <tr className="py-2">
                    <td className="text-slate-500 py-1.5">Worst-Case Execution:</td>
                    <td className="text-right font-bold text-orange-400 pr-1">{selectedTopic.complexity.worst || "O(1)"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 font-mono">
                  <Bookmark className="w-4 h-4" /> Space Constraints (Memory)
                </div>
                <div className="text-xs font-mono text-slate-300 mt-2">
                  <span className="text-slate-500 mr-1.5 font-mono">Space Complexity:</span>
                  <span className="font-bold text-slate-100">{selectedTopic.complexity.space}</span>
                </div>
              </div>
              <div className="bg-slate-900 px-3 py-2 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">REAL-WORLD DEMAND:</span>
                <p className="text-[11px] text-slate-400 leading-normal font-sans pr-1">{selectedTopic.realWorldUse}</p>
              </div>
            </div>
          </div>

          {/* Theoretical explanation list checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              Logical Steps Checklist
            </h3>
            <ul className="space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-slate-850 text-xs">
              {selectedTopic.explanationSteps.map((step, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-slate-300 leading-normal">
                  <span className="text-[11px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded shrink-0">{idx + 1}</span>
                  <span className="font-sans py-0.5">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TypeScript Code Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                Generic Target Code (TypeScript)
              </h3>
              <button
                onClick={copyCodeToClipboard}
                className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 py-1 px-2.5 bg-slate-950 rounded-lg border border-slate-850 transition-colors"
                title="Copy code template"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-950 border border-slate-850 p-5 rounded-2xl text-[11px] font-mono text-emerald-250 leading-relaxed overflow-x-auto whitespace-pre max-h-[380px] scrollbar-thin">
              {selectedTopic.typescriptTemplate}
            </pre>
          </div>

          {/* Notebook Section */}
          <div className="pt-4 border-t border-slate-850 space-y-3.5">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              📓 Personal Study Notes (Saves locally)
            </h3>
            <div className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Jot down formulas, weak sub-concepts, or study reminders for this topic..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 outline-none resize-none leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNoteLocal}
                  className="bg-indigo-600 hover:bg-indigo-550 text-white font-semibold text-[11px] py-2 px-4 rounded-xl transition-all shadow active:scale-95"
                >
                  Save Local Note
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
