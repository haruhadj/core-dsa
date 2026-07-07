import { useState, useEffect } from "react";
import { UserProgress } from "./types";
import { DSA_TOPICS } from "./data/roadmapData";
import { RoadmapView } from "./components/RoadmapView";
import { Visualizer } from "./components/Visualizer";
import { PracticeArena } from "./components/PracticeArena";
import { QuizArena } from "./components/QuizArena";
import { AICoach } from "./components/AICoach";
import { 
  Trophy, 
  BookOpen, 
  Cpu, 
  Code2, 
  Sparkles, 
  Flame, 
  CheckCircle, 
  BookMarked,
  Info
} from "lucide-react";

type ActiveTab = "ROADMAP" | "VISUALIZER" | "ARENA" | "QUIZ" | "COACH";

const INITIAL_PROGRESS: UserProgress = {
  completedTopics: [],
  solvedChallenges: [],
  quizScores: {},
  streakCount: 1,
  lastActiveDate: new Date().toDateString(),
  savedNotes: {},
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("ROADMAP");
  
  // Persistence state
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem("dsa_hub_progress");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verify structure
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
        };
      }
    } catch {
      // safe fallback
    }
    return INITIAL_PROGRESS;
  });

  // Code transport bridge: sends editor code to the AI Coach chat context
  const [bridgeCode, setBridgeCode] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("dsa_hub_progress", JSON.stringify(progress));
  }, [progress]);

  // Streak tracker math on load
  useEffect(() => {
    const todayStr = new Date().toDateString();
    if (progress.lastActiveDate !== todayStr) {
      setProgress((prev) => {
        let newStreak = prev.streakCount;
        if (prev.lastActiveDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (prev.lastActiveDate === yesterday.toDateString()) {
            newStreak += 1;
          } else {
            newStreak = 1; // broken loop
          }
        }
        return {
          ...prev,
          streakCount: newStreak,
          lastActiveDate: todayStr,
        };
      });
    }
  }, []);

  const handleToggleCompleteTopic = (topicId: string) => {
    setProgress((prev) => {
      const list = [...prev.completedTopics];
      const index = list.indexOf(topicId);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(topicId);
      }
      return {
        ...prev,
        completedTopics: list,
      };
    });
  };

  const handleSaveNote = (topicId: string, noteText: string) => {
    setProgress((prev) => ({
      ...prev,
      savedNotes: {
        ...prev.savedNotes,
        [topicId]: noteText,
      },
    }));
  };

  // Callback from Practice Arena to bridge code block and cycle tabs to Chat
  const handleBridgeCodeToCoach = (code: string) => {
    setBridgeCode(code);
    setActiveTab("COACH");
  };

  // Completion ratio computation
  const totalSteps = DSA_TOPICS.length;
  const completedStepsCount = progress.completedTopics.length;
  const completionPercentage = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row h-screen font-sans overflow-hidden">
      
      {/* 1. Left Sidebar Navigation Panel */}
      <aside className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 shrink-0 h-auto md:h-full overflow-y-auto">
        <div className="space-y-8">
          
          {/* Header Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-2xl shadow-lg ring-4 ring-indigo-500/10">
              <Code2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
                TS <span className="text-indigo-400 font-bold">DSA Hub</span>
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 block">Ultimate Study Companion</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {[
              { id: "ROADMAP", label: "Curriculum Pathways", icon: BookMarked },
              { id: "VISUALIZER", label: "Interactive Playrooms", icon: Cpu },
              { id: "ARENA", label: "Coding Challenge Arena", icon: Code2 },
              { id: "QUIZ", label: "Big-O Quiz Arena", icon: Trophy },
              { id: "COACH", label: "Gemini Coach Chat", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-semibold tracking-wide transition-all select-none border border-transparent ${
                    isActive
                      ? "bg-indigo-600 hover:bg-indigo-550 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                      : "text-slate-400 hover:text-slate-250 hover:bg-slate-950/20 hover:border-slate-850"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-350"}`} />
                  <span>{tab.label}</span>
                  {tab.id === "COACH" && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Active Statistics cards in sidebar */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Your Achievements</h3>
            
            {/* Completion card */}
            <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400 inline" /> Progress
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-300">
                  {completedStepsCount} / {totalSteps}
                </span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  style={{ width: `${completionPercentage}%` }}
                  className="bg-gradient-to-r from-indigo-505 to-emerald-500 h-full rounded-full transition-all duration-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                {completionPercentage}% of roadmap milestones reached
              </span>
            </div>

            {/* Streak card */}
            <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block font-mono">Daily Streak</span>
                <div className="text-xl font-mono font-black text-amber-400 flex items-center gap-1">
                  <Flame className="w-5 h-5 text-amber-500 fill-current" />
                  <span>{progress.streakCount} {progress.streakCount === 1 ? "Day" : "Days"}</span>
                </div>
              </div>
              <CheckCircle className={`w-8 h-8 ${completedStepsCount > 0 ? "text-emerald-505" : "text-slate-700"}`} />
            </div>

          </div>

        </div>

        {/* Footer block */}
        <div className="pt-6 border-t border-slate-850 space-y-1 select-none">
          <div className="text-[10px] font-mono text-slate-600 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-505" />
            TypeScript Sandbox Edition
          </div>
          <div className="text-[9px] text-slate-505 leading-relaxed font-sans pr-2">
            Practice space complexity indices, graph logic, and search stacks interactively.
          </div>
        </div>

      </aside>

      {/* 2. Main Workstation Display Body */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:p-10 relative bg-slate-950/20">
        
        {/* Dynamic Context Headers depending on current screen */}
        <div className="mb-8 space-y-1 animate-fadeIn">
          <h2 className="text-2xl font-extrabold text-white">
            {activeTab === "ROADMAP" && "Data Structures & Algorithms Roadmap"}
            {activeTab === "VISUALIZER" && "Interactive Structural Visualizers"}
            {activeTab === "ARENA" && "Live Coding Sandbox"}
            {activeTab === "QUIZ" && "Algorithmic Concept Evaluator"}
            {activeTab === "COACH" && "Ask the DSA Coach Partner"}
          </h2>
          <p className="text-xs text-slate-400">
            {activeTab === "ROADMAP" && "Crawl through standard lessons, test logic templates, and jot master cheat notes."}
            {activeTab === "VISUALIZER" && "Trace Stack indices, queue pointers, sorting bubble swapping, and tree branches."}
            {activeTab === "ARENA" && "Write algorithms inside our compiler and run instant automated test suites."}
            {activeTab === "QUIZ" && "Verify your asymptotic memory thresholds. Perfect preparation for technical engineering screens."}
            {activeTab === "COACH" && "Review custom sandbox codes, request Big-O reviews, or generate bespoke problem sheets."}
          </p>
        </div>

        {/* Tab display routing */}
        <div className="animate-fadeIn">
          {activeTab === "ROADMAP" && (
            <RoadmapView 
              completedTopics={progress.completedTopics}
              onToggleCompleteTopic={handleToggleCompleteTopic}
              savedNotes={progress.savedNotes}
              onSaveNote={handleSaveNote}
            />
          )}

          {activeTab === "VISUALIZER" && (
            <Visualizer />
          )}

          {activeTab === "ARENA" && (
            <PracticeArena 
              onSendToCoach={handleBridgeCodeToCoach}
            />
          )}

          {activeTab === "QUIZ" && (
            <QuizArena />
          )}

          {activeTab === "COACH" && (
            <AICoach 
              activeTopicName="General DSA Study"
              sandboxCode={bridgeCode}
            />
          )}
        </div>

      </main>

    </div>
  );
}
