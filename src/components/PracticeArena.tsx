import React, { useState } from "react";
import { PracticeChallenge } from "../types";
import { MOCK_CHALLENGES } from "../data/roadmapData";
import { Code, Terminal, Play, HelpCircle, Eye, Sparkles, BookOpen, CheckCircle, AlertTriangle } from "lucide-react";

interface PracticeArenaProps {
  onSendToCoach?: (code: string) => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({ onSendToCoach }) => {
  const [activeChallenge, setActiveChallenge] = useState<PracticeChallenge>(MOCK_CHALLENGES[0]);
  const [userCode, setUserCode] = useState<string>(activeChallenge.starterCode);
  const [testResults, setTestResults] = useState<{ passed: boolean; logs: string[] } | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [hintIndex, setHintIndex] = useState<number>(-1);

  const handleSelectChallenge = (challenge: PracticeChallenge) => {
    setActiveChallenge(challenge);
    setUserCode(challenge.starterCode);
    setTestResults(null);
    setShowSolution(false);
    setHintIndex(-1);
  };

  const handleRunTests = () => {
    setTestResults(null);
    const results = activeChallenge.testRunner(userCode);
    setTestResults(results);
  };

  const showNextHint = () => {
    if (hintIndex < activeChallenge.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    } else {
      setHintIndex(0); // Loop back
    }
  };

  const handleAskCoachAboutCode = () => {
    if (onSendToCoach) {
      onSendToCoach(userCode);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed text-slate-100 font-sans">
      {/* Challenges sidebar */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">Select Arena</h3>
        </div>
        <div className="space-y-2">
          {MOCK_CHALLENGES.map((ch) => {
            const isActive = activeChallenge.id === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChallenge(ch)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm group ${
                  isActive
                    ? "bg-indigo-600/15 border-indigo-500/80 text-white"
                    : "bg-slate-950/40 border-slate-850 hover:border-slate-700 text-slate-350 hover:text-slate-100"
                }`}
              >
                <div className="font-semibold mb-1 group-hover:text-white transition-colors">{ch.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 uppercase text-[9px]">
                    {ch.topicId}
                  </span>
                  <span
                    className={`font-semibold ${
                      ch.difficulty === "Easy"
                        ? "text-emerald-400"
                        : ch.difficulty === "Medium"
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {ch.difficulty}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2">
          <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Coaching Integration
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Stuck writing your solution? You can send your active editor code straight to the AI Coach with one click for a customized code review.
          </p>
        </div>
      </div>

      {/* Code Playground stage */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {/* Challenge guidelines card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h2 className="text-lg font-bold text-slate-100">{activeChallenge.title}</h2>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                activeChallenge.difficulty === "Easy"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                  : activeChallenge.difficulty === "Medium"
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  : "bg-rose-500/10 text-rose-300 border-rose-500/20"
              }`}
            >
              {activeChallenge.difficulty}
            </span>
          </div>
          <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-mono bg-slate-950/30 p-3 rounded-lg border border-slate-850">
            {activeChallenge.prompt}
          </div>
        </div>

        {/* Code Input */}
        <div className="bg-slate-950 border border-slate-805 rounded-2xl overflow-hidden flex flex-col h-[380px] shadow-lg">
          <div className="bg-slate-900 px-5 py-3 border-b border-slate-805 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>playground.ts</span>
            </div>
            <button
              onClick={handleAskCoachAboutCode}
              className="text-[11px] font-semibold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/30 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Ask AI Coach
            </button>
          </div>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="flex-1 bg-slate-950 p-5 text-sm font-mono text-emerald-200 outline-none resize-none focus:ring-0 leading-relaxed scrollbar-thin overflow-y-auto"
            placeholder="// Begin writing your custom TypeScript function inside this box..."
          />
        </div>

        {/* Action Panel */}
        <div className="flex flex-wrap gap-2.5 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleRunTests}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors active:scale-95 shadow-md shadow-emerald-950/20"
            >
              <Play className="w-4 h-4 fill-current" />
              Compile & Run Tests
            </button>
            <button
              onClick={showNextHint}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              {hintIndex === -1 ? "Get Hint" : "Next Hint"}
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-355 hover:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1 transition-all"
            >
              <Eye className="w-4 h-4" />
              {showSolution ? "Hide Answer" : "Expose Answer"}
            </button>
          </div>
        </div>

        {/* Hint text */}
        {hintIndex !== -1 && (
          <div className="bg-amber-950/15 border border-amber-900/40 rounded-xl p-4 text-xs text-amber-200 leading-normal flex items-start gap-2.5 animate-fadeIn">
            <HelpCircle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold font-mono">HINT #{hintIndex + 1}: </span>
              {activeChallenge.hints[hintIndex]}
            </div>
          </div>
        )}

        {/* User Code Solution Reference */}
        {showSolution && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2 animate-fadeIn">
            <div className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              Model Answer (TypeScript):
            </div>
            <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-slate-300 border border-slate-850 overflow-x-auto whitespace-pre">
              {activeChallenge.solutionSnippet}
            </pre>
          </div>
        )}

        {/* Test Console results */}
        {testResults && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg animate-[fadeIn_0.15s_ease-out]">
            <div className="bg-slate-950/50 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-mono">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Execution Console</span>
              </div>
              <span
                className={`text-xs font-bold flex items-center gap-1 font-mono ${
                  testResults.passed ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {testResults.passed ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> SUCCESS
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" /> FAILURES DETECTED
                  </>
                )}
              </span>
            </div>
            <div className="p-5 font-mono text-xs space-y-1.5 max-h-56 overflow-y-auto">
              {testResults.logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`py-1 ${
                    log.includes("✅") ? "text-slate-300" : log.includes("❌") ? "text-rose-400" : "text-slate-400"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
