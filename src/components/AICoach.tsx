import React, { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { Sparkles, Send, Bot, User, Trash2, ArrowRight, Loader2, Code, HelpCircle } from "lucide-react";

interface AICoachProps {
  activeTopicId?: string;
  activeTopicName?: string;
  sandboxCode?: string;
}

export const AICoach: React.FC<AICoachProps> = ({
  activeTopicId,
  activeTopicName,
  sandboxCode,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your TypeScript DSA Coach. 🚀
      
I can help you break down data structures, debug your algorithms, analyze space/time complexity, or run a practice mockup.

Want to start? Select one of the quick prompts below or write your own question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/dsa-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userCode: textToSend.includes("review") || textToSend.includes("analyze") ? sandboxCode : undefined,
          contextTopic: activeTopicName,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not connect with remote coach.");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      console.error("Coach error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          role: "assistant",
          content: `⚠️ **Server connection offline or API Key missing.**
          
I encountered a technical hiccup attempting to connect to Gemini. However, let me guide you offline!
- **Active Topic**: ${activeTopicName || "Data Structures"}
- **Code Status**: Remember, any code that iterates linearly nested (e.g. bubble sort loops) is O(N²).
- To resolve this connection issue, make sure your **GEMINI_API_KEY** is registered in the panel!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome_reset",
        role: "assistant",
        content: `Chat session refreshed. Let's delve into another DSA milestone! What would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const QUICK_PROMPTS = [
    {
      label: `Explain ${activeTopicName || "BST"} clearly`,
      prompt: `Please explain the core mechanics of ${activeTopicName || "Binary Search Tree (BST)"} using simple words and concrete analogies in TypeScript.`
    },
    {
      label: "Map vs Hash Table in JavaScript",
      prompt: "What is the difference between custom Hash Tables and JavaScript's Map or standard Objects under the hood? Contrast their lookups complexity."
    },
    {
      label: "Explain Amortized Complexity",
      prompt: "What does 'amortized O(1) time complexity' mean? Use JavaScript array push/resizing as a practical example."
    },
    ...(sandboxCode ? [{
      label: "Critique my Playground Code",
      prompt: `Please analyze my TypeScript code implementation of ${activeTopicName || 'this structure'}. Critique its efficiency, look for edge-cases, and suggest performance optimizations:\n\n\`\`\`typescript\n${sandboxCode}\n\`\`\``
    }] : [])
  ];

  return (
    <div className="flex flex-col h-[650px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden font-sans shadow-xl">
      {/* Coach Header */}
      <div className="flex items-center justify-between bg-slate-950 border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              Gemini AI Coach
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                TS Dev Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">Master Data Structures, step-by-step</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Clear session history"
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Actor Logo */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === "user"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-indigo-500/15 border-indigo-500/30 text-indigo-400"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-3.5 rounded-2xl text-sm leading-relaxed border ${
                msg.role === "user"
                  ? "bg-slate-800/80 text-emerald-100 border-slate-700/60 rounded-tr-none"
                  : "bg-slate-950/80 text-slate-200 border-slate-850 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans break-words pr-2">
                {/* Parse simple markdown headers, code blocks, lists inside message */}
                {msg.content.split("\n").map((line, idx) => {
                  if (line.startsWith("###")) {
                    return <h4 key={idx} className="font-bold text-slate-100 mt-2 mb-1 text-sm">{line.replace("###", "")}</h4>;
                  }
                  if (line.startsWith("##")) {
                    return <h3 key={idx} className="font-bold text-indigo-300 mt-3 mb-1.5 text-base">{line.replace("##", "")}</h3>;
                  }
                  if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
                    return <li key={idx} className="ml-4 list-disc text-slate-300 py-0.5">{line.substring(2)}</li>;
                  }
                  if (line.includes("`") && !line.includes("```")) {
                    // Quick inline highlight fallback helper
                    return (
                      <p key={idx} className="py-0.5">
                        {line.split("`").map((part, pIdx) => 
                          pIdx % 2 === 1 
                            ? <code key={pIdx} className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300 font-mono text-xs">{part}</code>
                            : part
                        )}
                      </p>
                    );
                  }
                  if (line.startsWith("```")) {
                    return null; // Strip code block anchors in simple parse
                  }
                  return <p key={idx} className="mb-1">{line}</p>;
                })}
              </div>
              <span className="block mt-2 text-[10px] text-slate-500 text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-xs text-slate-400 font-mono">Coach is thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Prompts Grid */}
      <div className="bg-slate-950/40 p-4 border-t border-slate-800 space-y-2">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 font-mono">Learning Shortcuts:</div>
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              disabled={isLoading}
              className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-left shrink-0 active:scale-95 disabled:opacity-50"
            >
              {qp.label.includes("Code") ? <Code className="w-3.5 h-3.5 text-indigo-400" /> : <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />}
              {qp.label}
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2 items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Ask the Coach... (e.g., "What is the Time Complexity of DFS?")`}
          rows={1}
          className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 resize-none outline-none font-sans max-h-20"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
