import React, { useState } from "react";
import { QuizQuestion } from "../types";
import { MOCK_QUIZ_QUESTIONS } from "../data/roadmapData";
import { ClipboardList, Sparkles, RefreshCw, CheckCircle, XCircle, ArrowRight, BookOpen } from "lucide-react";

export const QuizArena: React.FC = () => {
  const [questions] = useState<QuizQuestion[]>(MOCK_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const activeQuestion = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (hasSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || hasSubmitted) return;
    setHasSubmitted(true);

    if (selectedOption === activeQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasSubmitted(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100 font-sans leading-relaxed">
      {/* Quiz Title Banner */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Big-O & DSA Knowledge Arena</h3>
            <p className="text-[11px] text-slate-500">Test your conceptual lookup speeds</p>
          </div>
        </div>
        {!isFinished && (
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            Q: {currentIndex + 1} / {questions.length}
          </span>
        )}
      </div>

      {!isFinished ? (
        <div className="p-6 md:p-8 space-y-6">
          {/* Question stem */}
          <div className="space-y-2">
            <span className="text-[10px] tracking-wider uppercase font-bold text-indigo-400 font-mono">
              Topic Category: {activeQuestion.topicId}
            </span>
            <h2 className="text-base md:text-lg font-semibold text-slate-200">
              {activeQuestion.question}
            </h2>
          </div>

          {/* Options block */}
          <div className="space-y-3">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === activeQuestion.correctIndex;
              const isWrongAndSelected = isSelected && !isCorrect;

              let optionStyle = "border-slate-800 bg-slate-950/40 hover:bg-slate-950 text-slate-300";
              
              if (hasSubmitted) {
                if (isCorrect) {
                  optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20";
                } else if (isWrongAndSelected) {
                  optionStyle = "border-rose-500 bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/20";
                } else {
                  optionStyle = "border-slate-850 bg-slate-950/20 text-slate-500 pointer-events-none";
                }
              } else if (isSelected) {
                optionStyle = "border-indigo-505 bg-indigo-500/10 text-indigo-200 ring-1 ring-indigo-500/10";
              }

              return (
                <button
                  key={idx}
                  disabled={hasSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between gap-4 font-sans ${optionStyle}`}
                >
                  <span className="flex-1">{option}</span>
                  {hasSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {hasSubmitted && isWrongAndSelected && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation panel */}
          {hasSubmitted && (
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-2 animate-fadeIn">
              <div className="text-xs uppercase font-mono font-bold tracking-wide text-indigo-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Coach Analysis
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeQuestion.explanation}
              </p>
            </div>
          )}

          {/* Controls Footer */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {selectedOption === null ? "Please select an option" : hasSubmitted ? "Review choice" : "Confirm choice"}
            </div>
            {!hasSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors active:scale-95"
              >
                Validate Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
              >
                {currentIndex === questions.length - 1 ? "Complete Quiz" : "Next Question"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Finished State */
        <div className="p-8 text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-full flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-200">Arena Complete!</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              You parsed all DSA validation steps successfully! Let's examine your retrieval performance:
            </p>
          </div>

          {/* Score Circle Card */}
          <div className="bg-slate-950 rounded-2xl inline-block px-8 py-5 border border-slate-800">
            <div className="text-4xl font-extrabold text-indigo-300 font-mono">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-mono mt-1 select-none">
              Score: {score} / {questions.length} Correct
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={restartQuiz}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retake Code Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
