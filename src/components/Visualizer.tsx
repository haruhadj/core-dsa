import React, { useState, useEffect } from "react";
import { Plus, Trash2, ArrowRight, RefreshCw, Play, Pause, Search, HelpCircle } from "lucide-react";
import { CodeTraceVisualizer } from "./CodeTraceVisualizer";

type VisualizerMode = "STACK" | "QUEUE" | "SORTING" | "BST" | "CODE_TRACE";

interface BSTNode {
  value: number;
  left?: BSTNode;
  right?: BSTNode;
}

export const Visualizer: React.FC = () => {
  const [mode, setMode] = useState<VisualizerMode>("CODE_TRACE");

  // Stack State
  const [stackItems, setStackItems] = useState<number[]>([15, 23, 42]);
  const [stackVal, setStackVal] = useState<string>("");

  // Queue State
  const [queueItems, setQueueItems] = useState<number[]>([10, 20, 30, 40]);
  const [queueVal, setQueueVal] = useState<string>("");

  // Sorting State
  const [sortArr, setSortArr] = useState<number[]>([35, 12, 48, 26, 8, 19, 31]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [sortingInterval, setSortingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isSorted, setIsSorted] = useState<boolean>(false);

  // BST State
  const [bstRoot, setBstRoot] = useState<BSTNode | null>({
    value: 20,
    left: { value: 10, left: { value: 5 }, right: { value: 15 } },
    right: { value: 30, left: { value: 25 }, right: { value: 35 } }
  });
  const [bstInput, setBstInput] = useState<string>("");
  const [bstSearchHit, setBstSearchHit] = useState<number | null>(null);
  const [bstSearchPath, setBstSearchPath] = useState<number[]>([]);

  // Cleanup timers on change or unmount
  useEffect(() => {
    return () => {
      if (sortingInterval) clearInterval(sortingInterval);
    };
  }, [sortingInterval]);

  // STACK Actions
  const handlePush = () => {
    const val = parseInt(stackVal);
    if (isNaN(val)) return;
    if (stackItems.length >= 8) return; // Prevent screen clutter
    setStackItems([...stackItems, val]);
    setStackVal("");
  };

  const handlePop = () => {
    if (stackItems.length === 0) return;
    const items = [...stackItems];
    items.pop();
    setStackItems(items);
  };

  const resetStack = () => setStackItems([12, 24, 48]);

  // QUEUE Actions
  const handleEnqueue = () => {
    const val = parseInt(queueVal);
    if (isNaN(val)) return;
    if (queueItems.length >= 8) return;
    setQueueItems([...queueItems, val]);
    setQueueVal("");
  };

  const handleDequeue = () => {
    if (queueItems.length === 0) return;
    const items = [...queueItems];
    items.shift();
    setQueueItems(items);
  };

  const resetQueue = () => setQueueItems([10, 20, 30, 40]);

  // SORTING Bubble Sort Steps
  const randomizeSortingArr = () => {
    if (sortingInterval) {
      clearInterval(sortingInterval);
      setSortingInterval(null);
    }
    const rand = Array.from({ length: 8 }, () => Math.floor(Math.random() * 45) + 5);
    setSortArr(rand);
    setActiveIndices([]);
    setSortedIndices([]);
    setIsSorted(false);
  };

  const startBubbleSort = () => {
    if (sortingInterval) return;

    let items = [...sortArr];
    let i = 0;
    let j = 0;
    let swapped = false;

    const interval = setInterval(() => {
      // If fully sorted, clear interval
      if (i >= items.length - 1) {
        clearInterval(interval);
        setSortingInterval(null);
        setSortedIndices(items.map((_, idx) => idx));
        setActiveIndices([]);
        setIsSorted(true);
        return;
      }

      // Highlight active comparison
      setActiveIndices([j, j + 1]);

      if (items[j] > items[j + 1]) {
        const temp = items[j];
        items[j] = items[j + 1];
        items[j + 1] = temp;
        swapped = true;
        setSortArr([...items]);
      }

      j++;

      if (j >= items.length - i - 1) {
        // Last element of this loop passes is sorted
        setSortedIndices((prev) => [...prev, items.length - i - 1]);
        j = 0;
        i++;
        if (!swapped) {
          // No swaps means sorted
          clearInterval(interval);
          setSortingInterval(null);
          setSortedIndices(items.map((_, idx) => idx));
          setActiveIndices([]);
          setIsSorted(true);
        }
        swapped = false;
      }
    }, 450);

    setSortingInterval(interval);
  };

  const stopSorting = () => {
    if (sortingInterval) {
      clearInterval(sortingInterval);
      setSortingInterval(null);
    }
  };

  // BST Actions
  const insertBST = (node: BSTNode | null, val: number): BSTNode => {
    if (!node) return { value: val };
    if (val < node.value) {
      node.left = insertBST(node.left || null, val);
    } else if (val > node.value) {
      node.right = insertBST(node.right || null, val);
    }
    return node;
  };

  const handleInsertBST = () => {
    const val = parseInt(bstInput);
    if (isNaN(val)) return;
    const tree = bstRoot ? { ...bstRoot } : null;
    const updated = insertBST(tree, val);
    setBstRoot(updated);
    setBstInput("");
    setBstSearchHit(null);
    setBstSearchPath([]);
  };

  const handleSearchBST = () => {
    const val = parseInt(bstInput);
    if (isNaN(val)) return;
    setBstSearchHit(null);
    setBstSearchPath([]);

    // Trace path
    const path: number[] = [];
    let current = bstRoot;
    let found = false;

    while (current) {
      path.push(current.value);
      if (val === current.value) {
        found = true;
        break;
      } else if (val < current.value) {
        current = current.left || null;
      } else {
        current = current.right || null;
      }
    }

    setBstSearchPath(path);
    if (found) {
      setBstSearchHit(val);
    } else {
      setBstSearchHit(-1); // Indicator of missing
    }
  };

  const resetBST = () => {
    setBstRoot({
      value: 20,
      left: { value: 10, left: { value: 5 }, right: { value: 15 } },
      right: { value: 30, left: { value: 25 }, right: { value: 35 } }
    });
    setBstInput("");
    setBstSearchHit(null);
    setBstSearchPath([]);
  };

  const renderBSTNode = (node: BSTNode | null, x: number, y: number, offset: number) => {
    if (!node) return null;

    const inPath = bstSearchPath.includes(node.value);
    const isTarget = bstSearchHit === node.value;

    return (
      <React.Fragment key={node.value}>
        {/* Connection pointers */}
        {node.left && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={`${x}%`}
              y1={`${y}px`}
              x2={`${x - offset}%`}
              y2={`${y + 70}px`}
              stroke="rgb(51, 65, 85)"
              strokeWidth="2"
            />
          </svg>
        )}
        {node.right && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={`${x}%`}
              y1={`${y}px`}
              x2={`${x + offset}%`}
              y2={`${y + 70}px`}
              stroke="rgb(51, 65, 85)"
              strokeWidth="2"
            />
          </svg>
        )}

        {/* Node entity */}
        <div
          style={{ left: `${x}%`, top: `${y}px`, transform: "translate(-50%, -50%)" }}
          className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 transition-all duration-300 z-10 select-none shadow-md ${
            isTarget
              ? "bg-emerald-500 text-white border-emerald-400 scale-125 ring-4 ring-emerald-500/30"
              : inPath
              ? "bg-indigo-600 text-indigo-100 border-indigo-400"
              : "bg-slate-800 text-slate-300 border-slate-705"
          }`}
        >
          {node.value}
        </div>

        {/* Child level recurse */}
        {renderBSTNode(node.left || null, x - offset, y + 70, offset / 1.7)}
        {renderBSTNode(node.right || null, x + offset, y + 70, offset / 1.7)}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100">
      {/* Visualizer navbar */}
      <div className="flex bg-slate-950 border-b border-slate-800 scrollbar-thin overflow-x-auto">
        {(["CODE_TRACE", "STACK", "QUEUE", "SORTING", "BST"] as VisualizerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              stopSorting();
            }}
            className={`flex-1 py-4 px-6 text-sm font-semibold tracking-wider transition-all duration-250 select-none border-b-2 flex items-center justify-center gap-1.5 shrink-0 ${
              mode === m
                ? "bg-slate-900/80 border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/35"
            }`}
          >
            {m === "CODE_TRACE" && "▶ Line-by-Line Debugger"}
            {m === "STACK" && "🥞 Stack Class"}
            {m === "QUEUE" && "⏳ Queue Class"}
            {m === "SORTING" && "📊 Bubble Sort"}
            {m === "BST" && "🌳 Binary Search Tree"}
          </button>
        ))}
      </div>

      {mode === "CODE_TRACE" ? (
        <div className="p-4 md:p-6">
          <CodeTraceVisualizer />
        </div>
      ) : (
        <div className="p-6 md:p-8 space-y-6">
          {/* Info panel */}
          <div className="bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl flex items-start gap-3.5">
          <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-normal space-y-1">
            {mode === "STACK" && (
              <p>
                <strong>Stack Action Rules:</strong> The Stack follows the <strong>LIFO (Last-In-First-Out)</strong> order. 
                Pushes insert onto the top pointer; Pops strip the newest block from the top first. Try adding values to see them stack up!
              </p>
            )}
            {mode === "QUEUE" && (
              <p>
                <strong>Queue Action Rules:</strong> The Queue follows the <strong>FIFO (First-In-First-Out)</strong> order. 
                Enqueues are added onto the tail; Dequeues strip blocks from the head. Check how pointers follow the queue!
              </p>
            )}
            {mode === "SORTING" && (
              <p>
                <strong>Bubble Sort Simulation:</strong> Bubble sort parses the collection, comparing adjacent values, and swaps them if the left block is greater than the right. Watch items bubble into place step-by-step!
              </p>
            )}
            {mode === "BST" && (
              <p>
                <strong>BST Insertion & Tracing:</strong> In a binary search tree, items less than parent branch Left, larger items branch Right. 
                Enter a number to <strong>Insert</strong> it, or <strong>Search</strong> to watch the path trace in real-time!
              </p>
            )}
          </div>
        </div>

        {/* Interactive canvas box */}
        <div className="bg-slate-950/80 rounded-2xl h-72 border border-slate-800 relative py-8 px-4 flex items-center justify-center overflow-hidden">
          {/* 1. STACK CANVAS */}
          {mode === "STACK" && (
            <div className="flex flex-col-reverse items-center justify-start h-full max-w-[240px] w-full border-b-4 border-l-4 border-r-4 border-slate-700/60 rounded-b-xl px-4 py-2 relative">
              {stackItems.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs font-mono">
                  Stack is Empty
                </div>
              ) : (
                stackItems.map((val, idx) => {
                  const isTop = idx === stackItems.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`w-full py-3 px-4 rounded-lg flex items-center justify-between text-xs font-mono font-bold font-semibold border text-center transition-all duration-300 animate-[fadeIn_0.2s_ease-out] mb-1.5 ${
                        isTop
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/10 scale-102"
                          : "bg-slate-800 border-slate-700 text-slate-300"
                      }`}
                    >
                      <span className="bg-slate-950/50 px-1.5 py-0.5 rounded text-[10px] text-slate-400 select-none">
                        index: {idx}
                      </span>
                      <span className="text-sm">{val}</span>
                      {isTop ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/30 text-white border border-indigo-400">
                          Top Pointer (LIFO)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">item</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 2. QUEUE CANVAS */}
          {mode === "QUEUE" && (
            <div className="flex items-center gap-2 w-full p-4 justify-center relative">
              {queueItems.length === 0 ? (
                <div className="text-slate-500 text-xs font-mono">Queue is Empty</div>
              ) : (
                <div className="flex items-center gap-3 w-full max-w-lg justify-start overflow-x-auto py-2">
                  {queueItems.map((val, idx) => {
                    const isHead = idx === 0;
                    const isTail = idx === queueItems.length - 1;
                    return (
                      <div key={idx} className="flex items-center shrink-0">
                        <div
                          className={`px-4 py-5 rounded-xl border flex flex-col items-center justify-center font-mono font-bold w-20 relative transition-all duration-200 ${
                            isHead
                              ? "bg-indigo-600 border-indigo-400 text-white shadow-lg"
                              : isTail
                              ? "bg-slate-800 border-slate-705 text-slate-200"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          <span className="text-lg">{val}</span>
                          <span className="text-[9px] text-slate-500 mt-1">idx: {idx}</span>

                          {/* Head indicator pin */}
                          {isHead && (
                            <span className="absolute -top-6 text-[9px] uppercase tracking-wider bg-emerald-500/25 text-emerald-300 font-bold px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                              Head (FIFO)
                            </span>
                          )}

                          {/* Tail indicator pin */}
                          {isTail && (
                            <span className="absolute -bottom-6 text-[9px] uppercase tracking-wider bg-indigo-500/25 text-indigo-300 font-bold px-1.5 py-0.5 rounded-md border border-indigo-500/30">
                              Tail (Rear)
                            </span>
                          )}
                        </div>
                        {idx < queueItems.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-700 mx-1 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. SORTING CANVAS */}
          {mode === "SORTING" && (
            <div className="flex items-end justify-center gap-3.5 h-full w-full max-w-sm px-6">
              {sortArr.map((val, idx) => {
                const isActive = activeIndices.includes(idx);
                const isSortedItem = sortedIndices.includes(idx);
                
                // Max height utility is 180px
                const barHeight = `${Math.max(val * 3.5, 20)}px`;

                return (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <span className="text-[10px] font-mono text-slate-500 mb-1">{val}</span>
                    <div
                      style={{ height: barHeight }}
                      className={`w-full rounded-t-lg border transition-all duration-250 ${
                        isActive
                          ? "bg-amber-500 border-amber-400 animate-pulse ring-2 ring-amber-500/20"
                          : isSortedItem
                          ? "bg-emerald-600 border-emerald-400"
                          : "bg-slate-800 border-slate-705"
                      }`}
                    />
                    <span className="text-[9px] font-mono mt-1 text-slate-600 bg-slate-900/50 px-1 rounded">i:{idx}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. BST CANVAS */}
          {mode === "BST" && (
            <div className="absolute inset-0 w-full h-full">
              {bstRoot ? (
                <div className="relative w-full h-full pt-10">
                  {renderBSTNode(bstRoot, 50, 40, 24)}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs font-mono">
                  BST is Empty
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inputs and actions rows */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch bg-slate-950 p-4 rounded-xl border border-slate-800">
          {/* Action Row for Stack */}
          {mode === "STACK" && (
            <>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="number"
                  value={stackVal}
                  onChange={(e) => setStackVal(e.target.value)}
                  placeholder="Number to Push"
                  className="bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 w-full md:max-w-[160px] outline-none"
                />
                <button
                  onClick={handlePush}
                  className="bg-indigo-600 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Push Node
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePop}
                  disabled={stackItems.length === 0}
                  className="bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-900/40 text-slate-300 hover:text-red-300 disabled:opacity-40 disabled:bg-slate-800 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors flex-1 md:flex-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Pop Top
                </button>
                <button
                  onClick={resetStack}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* Action Row for Queue */}
          {mode === "QUEUE" && (
            <>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="number"
                  value={queueVal}
                  onChange={(e) => setQueueVal(e.target.value)}
                  placeholder="Number to Enqueue"
                  className="bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 w-full md:max-w-[160px] outline-none"
                />
                <button
                  onClick={handleEnqueue}
                  className="bg-indigo-600 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Enqueue
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDequeue}
                  disabled={queueItems.length === 0}
                  className="bg-slate-800 hover:bg-red-950/40 border border-slate-705 hover:border-red-900/40 text-slate-300 hover:text-red-300 disabled:opacity-40 disabled:bg-slate-800 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all flex-1 md:flex-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Dequeue First
                </button>
                <button
                  onClick={resetQueue}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* Action Row for Sorting */}
          {mode === "SORTING" && (
            <>
              <div className="flex items-center gap-2.5 flex-1">
                {sortingInterval ? (
                  <button
                    onClick={stopSorting}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    Pause Bubble
                  </button>
                ) : (
                  <button
                    onClick={startBubbleSort}
                    disabled={isSorted}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Run Bubble Sort Step
                  </button>
                )}
                {isSorted && (
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                    ✅ Array Sorted!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={randomizeSortingArr}
                  className="bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Scramble Values
                </button>
              </div>
            </>
          )}

          {/* Action Row for BST */}
          {mode === "BST" && (
            <>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="number"
                  value={bstInput}
                  onChange={(e) => setBstInput(e.target.value)}
                  placeholder="Key (e.g. 17)"
                  className="bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 w-full md:max-w-[130px] outline-none"
                />
                <button
                  onClick={handleInsertBST}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Node
                </button>
                <button
                  onClick={handleSearchBST}
                  className="bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  Search Node
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {bstSearchHit !== null && (
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-1 rounded border ${
                      bstSearchHit === -1
                        ? "bg-rose-950/20 text-rose-400 border-rose-900/30"
                        : "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                    }`}
                  >
                    {bstSearchHit === -1 ? "❌ Missing Node" : `Found at: ${bstSearchPath.join(" → ")}`}
                  </span>
                )}
                <button
                  onClick={resetBST}
                  title="Reset tree to template"
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
