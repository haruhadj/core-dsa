import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Layers, 
  Cpu, 
  CheckCircle, 
  HelpCircle,
  Eye,
  Sliders,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

interface VariableState {
  [key: string]: any;
}

interface TraceStep {
  lineIndex: number;
  variables: VariableState;
  state: any; // visual state data (e.g., array, stack list, etc.)
  actionDesc: string;
}

interface AlgorithmTrace {
  id: string;
  name: string;
  category: "ALGO" | "DS";
  complexity: string;
  code: string[];
  steps: TraceStep[];
}

const ALGORITHMS_TRACES: AlgorithmTrace[] = [
  {
    id: "binary_search",
    name: "Binary Search (Divide & Conquer)",
    category: "ALGO",
    complexity: "Time: O(log N) | Space: O(1)",
    code: [
      "function binarySearch(arr: number[], target: number): number {",
      "  let low = 0;",
      "  let high = arr.length - 1;",
      "  while (low <= high) {",
      "    let mid = Math.floor((low + high) / 2);",
      "    if (arr[mid] === target) {",
      "      return mid;", // Line 6
      "    }",
      "    if (arr[mid] < target) {", // Line 8
      "      low = mid + 1;", // Line 9
      "    } else {",
      "      high = mid - 1;", // Line 11
      "    }",
      "  }",
      "  return -1;",
      "}"
    ],
    steps: [
      {
        lineIndex: 0,
        variables: { target: 31 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: null, high: null, mid: null },
        actionDesc: "Start searching. We receive a sorted array and target '31' to look up."
      },
      {
        lineIndex: 1,
        variables: { target: 31, low: 0 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 0, high: null, mid: null },
        actionDesc: "Initialize the lower boundary 'low' pointer at index 0."
      },
      {
        lineIndex: 2,
        variables: { target: 31, low: 0, high: 6 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 0, high: 6, mid: null },
        actionDesc: "Initialize the upper boundary 'high' pointer at index 6 (length - 1)."
      },
      {
        lineIndex: 3,
        variables: { target: 31, low: 0, high: 6 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 0, high: 6, mid: null },
        actionDesc: "Check loop condition: is low (0) <= high (6)? Yes, search space is valid."
      },
      {
        lineIndex: 4,
        variables: { target: 31, low: 0, high: 6, mid: 3 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 0, high: 6, mid: 3 },
        actionDesc: "Calculate middle index: mid = Math.floor((0 + 6) / 2) = 3. arr[3] is 18."
      },
      {
        lineIndex: 5,
        variables: { target: 31, low: 0, high: 6, mid: 3, "arr[mid]": 18 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 0, high: 6, mid: 3 },
        actionDesc: "Compare arr[mid] (18) with target (31). They are not equal."
      },
      {
        lineIndex: 8,
        variables: { target: 31, low: 0, high: 6, mid: 3, "arr[mid]": 18 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 0, high: 6, mid: 3 },
        actionDesc: "Check if arr[mid] (18) is less than target (31). Yes, 18 < 31."
      },
      {
        lineIndex: 9,
        variables: { target: 31, low: 4, high: 6, mid: 3 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 4, high: 6, mid: null },
        actionDesc: "Discard the left half of the array. Advance 'low' to mid + 1 (4)."
      },
      {
        lineIndex: 3,
        variables: { target: 31, low: 4, high: 6 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 4, high: 6, mid: null },
        actionDesc: "Loop iteration 2: Check condition low (4) <= high (6). Yes, continue."
      },
      {
        lineIndex: 4,
        variables: { target: 31, low: 4, high: 6, mid: 5 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 4, high: 6, mid: 5 },
        actionDesc: "Re-calculate middle index: mid = Math.floor((4 + 6) / 2) = 5. arr[5] is 31."
      },
      {
        lineIndex: 5,
        variables: { target: 31, low: 4, high: 6, mid: 5, "arr[mid]": 31 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 4, high: 6, mid: 5 },
        actionDesc: "Compare arr[mid] (31) with target (31). Match found!"
      },
      {
        lineIndex: 6,
        variables: { target: 31, low: 4, high: 6, mid: 5, returnValue: 5 },
        state: { arr: [3, 8, 12, 18, 25, 31, 42], low: 4, high: 6, mid: 5, found: true },
        actionDesc: "Return middle index '5' and exit. Search completed successfully!"
      }
    ]
  },
  {
    id: "bubble_sort",
    name: "Bubble Sort Swap Pass",
    category: "ALGO",
    complexity: "Time: O(N²) | Space: O(1)",
    code: [
      "function bubbleSort(arr: number[]): number[] {",
      "  let n = arr.length;",
      "  for (let i = 0; i < n - 1; i++) {",
      "    for (let j = 0; j < n - i - 1; j++) {",
      "      if (arr[j] > arr[j + 1]) {",
      "        let temp = arr[j];", // Line 5
      "        arr[j] = arr[j + 1];", // Line 6
      "        arr[j + 1] = temp;", // Line 7
      "      }",
      "    }",
      "  }",
      "  return arr;",
      "}"
    ],
    steps: [
      {
        lineIndex: 0,
        variables: {},
        state: { arr: [24, 8, 35, 12], i: null, j: null, temp: null, swappers: [] },
        actionDesc: "Begin sorting of array: [24, 8, 35, 12]."
      },
      {
        lineIndex: 1,
        variables: { n: 4 },
        state: { arr: [24, 8, 35, 12], i: null, j: null, temp: null, swappers: [] },
        actionDesc: "Read array length: n = 4."
      },
      {
        lineIndex: 2,
        variables: { n: 4, i: 0 },
        state: { arr: [24, 8, 35, 12], i: 0, j: null, temp: null, swappers: [] },
        actionDesc: "Outer loop starts: i = 0 (first main pass)."
      },
      {
        lineIndex: 3,
        variables: { n: 4, i: 0, j: 0 },
        state: { arr: [24, 8, 35, 12], i: 0, j: 0, temp: null, swappers: [0, 1] },
        actionDesc: "Inner loop starts: j = 0. Comparing index 0 (24) and index 1 (8)."
      },
      {
        lineIndex: 4,
        variables: { n: 4, i: 0, j: 0, "arr[j]": 24, "arr[j+1]": 8 },
        state: { arr: [24, 8, 35, 12], i: 0, j: 0, temp: null, swappers: [0, 1] },
        actionDesc: "Is arr[0] (24) > arr[1] (8)? Yes. Triggering bubble swap!"
      },
      {
        lineIndex: 5,
        variables: { n: 4, i: 0, j: 0, temp: 24 },
        state: { arr: [24, 8, 35, 12], i: 0, j: 0, temp: 24, swappers: [0, 1] },
        actionDesc: "Store index 0's value (24) in temporary holding variable 'temp'."
      },
      {
        lineIndex: 6,
        variables: { n: 4, i: 0, j: 0, temp: 24 },
        state: { arr: [8, 8, 35, 12], i: 0, j: 0, temp: 24, swappers: [0, 1] },
        actionDesc: "Copy index 1's value (8) into index 0."
      },
      {
        lineIndex: 7,
        variables: { n: 4, i: 0, j: 0, temp: 24 },
        state: { arr: [8, 24, 35, 12], i: 0, j: 0, temp: 24, swappers: [0, 1] },
        actionDesc: "Write 'temp' (24) into index 1. Swap completed successfully!"
      },
      {
        lineIndex: 3,
        variables: { n: 4, i: 0, j: 1 },
        state: { arr: [8, 24, 35, 12], i: 0, j: 1, temp: null, swappers: [1, 2] },
        actionDesc: "Advance inner pointer: j = 1. Compare index 1 (24) and index 2 (35)."
      },
      {
        lineIndex: 4,
        variables: { n: 4, i: 0, j: 1, "arr[j]": 24, "arr[j+1]": 35 },
        state: { arr: [8, 24, 35, 12], i: 0, j: 1, temp: null, swappers: [1, 2] },
        actionDesc: "Is arr[1] (24) > arr[2] (35)? No, 24 <= 35. No swap needed."
      },
      {
        lineIndex: 3,
        variables: { n: 4, i: 0, j: 2 },
        state: { arr: [8, 24, 35, 12], i: 0, j: 2, temp: null, swappers: [2, 3] },
        actionDesc: "Advance inner pointer: j = 2. Compare index 2 (35) and index 3 (12)."
      },
      {
        lineIndex: 4,
        variables: { n: 4, i: 0, j: 2, "arr[j]": 35, "arr[j+1]": 12 },
        state: { arr: [8, 24, 35, 12], i: 0, j: 2, temp: null, swappers: [2, 3] },
        actionDesc: "Is arr[2] (35) > arr[3] (12)? Yes, trigger swap!"
      },
      {
        lineIndex: 5,
        variables: { n: 4, i: 0, j: 2, temp: 35 },
        state: { arr: [8, 24, 35, 12], i: 0, j: 2, temp: 35, swappers: [2, 3] },
        actionDesc: "Store index 2's value (35) in temporary holding variable 'temp'."
      },
      {
        lineIndex: 6,
        variables: { n: 4, i: 0, j: 2, temp: 35 },
        state: { arr: [8, 24, 12, 12], i: 0, j: 2, temp: 35, swappers: [2, 3] },
        actionDesc: "Copy index 3's value (12) into index 2."
      },
      {
        lineIndex: 7,
        variables: { n: 4, i: 0, j: 2, temp: 35 },
        state: { arr: [8, 24, 12, 35], i: 0, j: 2, temp: 35, swappers: [2, 3] },
        actionDesc: "Write 'temp' (35) into index 3. Swap completed. 35 is now locked in its final sorted position!"
      }
    ]
  },
  {
    id: "stack_ops",
    name: "Stack Push & Pop (LIFO)",
    category: "DS",
    complexity: "Time: O(1) | Space: O(N)",
    code: [
      "class CustomStack {",
      "  private items: number[] = [];",
      "  ",
      "  push(element: number): void {",
      "    this.items.push(element);", // Line 4
      "  }",
      "  ",
      "  pop(): number | undefined {",
      "    if (this.items.length === 0) return;", // Line 8
      "    return this.items.pop();", // Line 9
      "  }",
      "}"
    ],
    steps: [
      {
        lineIndex: 0,
        variables: { items: [] },
        state: { stack: [], activeNode: null, action: "INIT" },
        actionDesc: "Start Stack Class lifecycle simulation. Memory pool is empty."
      },
      {
        lineIndex: 1,
        variables: { items: [] },
        state: { stack: [], activeNode: null, action: "DECLARATION" },
        actionDesc: "Stack backing array initialized: items = []"
      },
      {
        lineIndex: 3,
        variables: { items: [], element: 42 },
        state: { stack: [], activeNode: 42, action: "PUSH_START" },
        actionDesc: "Inovking push(42) onto the stack."
      },
      {
        lineIndex: 4,
        variables: { items: [42], element: 42 },
        state: { stack: [42], activeNode: null, action: "PUSHED_1" },
        actionDesc: "items.push(42) completed. 42 resides at index 0 (bottom)."
      },
      {
        lineIndex: 3,
        variables: { items: [42], element: 15 },
        state: { stack: [42], activeNode: 15, action: "PUSH_START_2" },
        actionDesc: "Invoking push(15) onto the stack."
      },
      {
        lineIndex: 4,
        variables: { items: [42, 15], element: 15 },
        state: { stack: [42, 15], activeNode: null, action: "PUSHED_2" },
        actionDesc: "items.push(15) completed. 15 sits on top of 42 (LIFO target)."
      },
      {
        lineIndex: 7,
        variables: { items: [42, 15] },
        state: { stack: [42, 15], activeNode: null, action: "POP_START" },
        actionDesc: "Invoking pop() operation to fetch the top item."
      },
      {
        lineIndex: 8,
        variables: { items: [42, 15], "items.length": 2 },
        state: { stack: [42, 15], activeNode: null, action: "POP_CHECK" },
        actionDesc: "Check stack length: length is 2, which is > 0. Skip empty safeguard."
      },
      {
        lineIndex: 9,
        variables: { items: [42], poppedValue: 15 },
        state: { stack: [42], activeNode: 15, action: "POPPED" },
        actionDesc: "items.pop() removes and returns top-most item (15). Only 42 remains!"
      }
    ]
  },
  {
    id: "dp_fib",
    name: "Fibonacci Memoization (DP)",
    category: "ALGO",
    complexity: "Time: O(N) | Space: O(N)",
    code: [
      "function fib(n: number, memo: Record<number, number> = {}): number {",
      "  if (n <= 1) return n;", // Line 1
      "  if (n in memo) {", // Line 2
      "    return memo[n];", // Line 3
      "  }",
      "  let val = fib(n - 1, memo) + fib(n - 2, memo);", // Line 5
      "  memo[n] = val;", // Line 6
      "  return val;", // Line 7
      "}"
    ],
    steps: [
      {
        lineIndex: 0,
        variables: { n: 3, memo: {} },
        state: { n: 3, memo: {}, stackFrames: ["fib(3)"], result: null },
        actionDesc: "Begin fib(3) call. Subproblems will populate our memo lookup cache."
      },
      {
        lineIndex: 1,
        variables: { n: 3, memo: {} },
        state: { n: 3, memo: {}, stackFrames: ["fib(3)"], result: null },
        actionDesc: "Check base case n (3) <= 1. No, recursive lookup required."
      },
      {
        lineIndex: 2,
        variables: { n: 3, memo: {} },
        state: { n: 3, memo: {}, stackFrames: ["fib(3)"], result: null },
        actionDesc: "Check memo cache: is 3 in memo? No, first-time computation."
      },
      {
        lineIndex: 5,
        variables: { n: 3, memo: {} },
        state: { n: 3, memo: {}, stackFrames: ["fib(3)"], result: null },
        actionDesc: "Compute fib(3) by first making a recursive call to fib(2)."
      },
      {
        lineIndex: 0,
        variables: { n: 2, memo: {} },
        state: { n: 2, memo: {}, stackFrames: ["fib(3)", "fib(2)"], result: null },
        actionDesc: "Enter fib(2) frame. Call stack depth increases."
      },
      {
        lineIndex: 1,
        variables: { n: 2, memo: {} },
        state: { n: 2, memo: {}, stackFrames: ["fib(3)", "fib(2)"], result: null },
        actionDesc: "Is n (2) <= 1? No."
      },
      {
        lineIndex: 2,
        variables: { n: 2, memo: {} },
        state: { n: 2, memo: {}, stackFrames: ["fib(3)", "fib(2)"], result: null },
        actionDesc: "Is 2 in memo? No."
      },
      {
        lineIndex: 5,
        variables: { n: 2, memo: {} },
        state: { n: 2, memo: {}, stackFrames: ["fib(3)", "fib(2)"], result: null },
        actionDesc: "To resolve fib(2), recursively invoke fib(1)."
      },
      {
        lineIndex: 0,
        variables: { n: 1, memo: {} },
        state: { n: 1, memo: {}, stackFrames: ["fib(3)", "fib(2)", "fib(1)"], result: null },
        actionDesc: "Enter fib(1) frame."
      },
      {
        lineIndex: 1,
        variables: { n: 1, memo: {} },
        state: { n: 1, memo: {}, stackFrames: ["fib(3)", "fib(2)", "fib(1)"], result: null },
        actionDesc: "Is n (1) <= 1? Yes! Base case triggered. Return 1."
      },
      {
        lineIndex: 5,
        variables: { n: 2, memo: {}, resolved_left: 1 },
        state: { n: 2, memo: {}, stackFrames: ["fib(3)", "fib(2)"], result: null },
        actionDesc: "fib(1) returned 1. Now call right subproblem fib(0) recursively."
      },
      {
        lineIndex: 0,
        variables: { n: 0, memo: {} },
        state: { n: 0, memo: {}, stackFrames: ["fib(3)", "fib(2)", "fib(0)"], result: null },
        actionDesc: "Enter fib(0) frame."
      },
      {
        lineIndex: 1,
        variables: { n: 0, memo: {} },
        state: { n: 0, memo: {}, stackFrames: ["fib(3)", "fib(2)", "fib(0)"], result: null },
        actionDesc: "Is n (0) <= 1? Yes! Base case triggered. Return 0."
      },
      {
        lineIndex: 5,
        variables: { n: 2, memo: {}, val: 1 },
        state: { n: 2, memo: {}, stackFrames: ["fib(3)", "fib(2)"], result: null },
        actionDesc: "Add results of subproblems: fib(1) + fib(0) = 1 + 0 = 1."
      },
      {
        lineIndex: 6,
        variables: { n: 2, memo: { 2: 1 }, val: 1 },
        state: { n: 2, memo: { 2: 1 }, stackFrames: ["fib(3)", "fib(2)"], result: null },
        actionDesc: "Crucial DP step! Store solved term 2 in memo: memo[2] = 1."
      },
      {
        lineIndex: 7,
        variables: { n: 2, memo: { 2: 1 }, returnValue: 1 },
        state: { n: 2, memo: { 2: 1 }, stackFrames: ["fib(3)"], result: null },
        actionDesc: "fib(2) completes and returns 1. Frame popped from call stack."
      },
      {
        lineIndex: 5,
        variables: { n: 3, memo: { 2: 1 }, resolved_left: 1 },
        state: { n: 3, memo: { 2: 1 }, stackFrames: ["fib(3)"], result: null },
        actionDesc: "fib(2) resolved. Now recursively call fib(1) on right hand."
      },
      {
        lineIndex: 0,
        variables: { n: 1, memo: { 2: 1 } },
        state: { n: 1, memo: { 2: 1 }, stackFrames: ["fib(3)", "fib(1)"], result: null },
        actionDesc: "Enter fib(1) frame for right-hand subtree."
      },
      {
        lineIndex: 1,
        variables: { n: 1, memo: { 2: 1 } },
        state: { n: 1, memo: { 2: 1 }, stackFrames: ["fib(3)", "fib(1)"], result: null },
        actionDesc: "Check base case: n (1) <= 1. Yes! Return 1 immediately."
      },
      {
        lineIndex: 5,
        variables: { n: 3, memo: { 2: 1 }, val: 2 },
        state: { n: 3, memo: { 2: 1 }, stackFrames: ["fib(3)"], result: null },
        actionDesc: "Combine subproblems: fib(2) + fib(1) = 1 + 1 = 2."
      },
      {
        lineIndex: 6,
        variables: { n: 3, memo: { 2: 1, 3: 2 }, val: 2 },
        state: { n: 3, memo: { 2: 1, 3: 2 }, stackFrames: ["fib(3)"], result: null },
        actionDesc: "Cache resolved term 3 in memo cache: memo[3] = 2."
      },
      {
        lineIndex: 7,
        variables: { n: 3, memo: { 2: 1, 3: 2 }, returnValue: 2 },
        state: { n: 3, memo: { 2: 1, 3: 2 }, stackFrames: [], result: 2 },
        actionDesc: "fib(3) finishes. Return final value 2. Computation successful!"
      }
    ]
  }
];

export const CodeTraceVisualizer: React.FC = () => {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>("binary_search");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1200); // ms per step

  const activeAlgo = ALGORITHMS_TRACES.find((a) => a.id === selectedAlgoId) || ALGORITHMS_TRACES[0];
  const activeStep = activeAlgo.steps[currentStepIndex] || activeAlgo.steps[0];

  // Auto-play interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= activeAlgo.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playSpeed, activeAlgo]);

  // Reset steps when changing algorithm
  const handleAlgoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlgoId(e.target.value);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const stepForward = () => {
    if (currentStepIndex < activeAlgo.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const restartTrace = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Render Visualizer depending on active algorithm state
  const renderVisualPlayground = () => {
    const { state } = activeStep;
    if (!state) return null;

    switch (activeAlgo.id) {
      case "binary_search": {
        const { arr, low, high, mid, found } = state;
        return (
          <div className="space-y-6 w-full animate-fadeIn">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
              <span>Array Elements Pointer Map</span>
              {found && <span className="text-emerald-400 font-bold flex items-center gap-1">● Found Target!</span>}
            </div>

            <div className="grid grid-cols-7 gap-1.5 md:gap-3.5 pt-4">
              {arr.map((val: number, idx: number) => {
                const isLow = idx === low;
                const isHigh = idx === high;
                const isMid = idx === mid;
                const inRange = low !== null && high !== null && idx >= low && idx <= high;

                let borderStyle = "border-slate-800 bg-slate-900/40 text-slate-500";
                if (isMid) {
                  borderStyle = "border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-400/30 scale-105";
                } else if (isLow && isHigh) {
                  borderStyle = "border-indigo-500 bg-indigo-500/15 text-indigo-200";
                } else if (isLow) {
                  borderStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-200";
                } else if (isHigh) {
                  borderStyle = "border-rose-500 bg-rose-500/10 text-rose-200";
                } else if (inRange) {
                  borderStyle = "border-slate-700 bg-slate-800 text-slate-200";
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 relative">
                    {/* Index label */}
                    <span className="text-[10px] font-mono text-slate-600">idx: {idx}</span>
                    
                    {/* Element Block */}
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 flex items-center justify-center font-bold font-mono transition-all duration-300 ${borderStyle}`}>
                      {val}
                    </div>

                    {/* Pointer pins */}
                    <div className="flex flex-col items-center gap-0.5 mt-1 h-12">
                      {isLow && (
                        <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded border border-emerald-500/30 font-mono">
                          L
                        </span>
                      )}
                      {isHigh && (
                        <span className="text-[9px] font-bold bg-rose-500/20 text-rose-400 px-1 py-0.2 rounded border border-rose-500/30 font-mono">
                          H
                        </span>
                      )}
                      {isMid && (
                        <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded border border-amber-500/30 font-mono">
                          MID
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-4 text-[10px] font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-900">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/40"></span> L: Low ({low ?? "null"})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500/40"></span> H: High ({high ?? "null"})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500/40"></span> MID: Mid ({mid ?? "null"})</span>
            </div>
          </div>
        );
      }
      case "bubble_sort": {
        const { arr, i, j, temp, swappers } = state;
        return (
          <div className="space-y-4 w-full animate-fadeIn">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Array Bar Values</span>
            <div className="flex items-end justify-center gap-3.5 h-44 bg-slate-950/40 rounded-xl p-4 border border-slate-900">
              {arr.map((val: number, idx: number) => {
                const isActive = swappers.includes(idx);
                const isTemp = temp !== null && val === temp;
                const barHeight = `${Math.max(val * 3, 20)}px`;

                let barColor = "bg-slate-800 border-slate-700 text-slate-400";
                if (isActive) {
                  barColor = "bg-indigo-600 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-500/25";
                } else if (isTemp) {
                  barColor = "bg-amber-600 border-amber-400 text-white";
                }

                return (
                  <div key={idx} className="flex flex-col items-center flex-1 max-w-[50px] transition-all duration-300">
                    <span className="text-[10px] font-mono font-bold text-slate-400 mb-1">{val}</span>
                    <div 
                      style={{ height: barHeight }}
                      className={`w-full rounded-t-lg border transition-all duration-300 ${barColor}`}
                    />
                    <span className="text-[9px] font-mono text-slate-500 mt-1">idx:{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      case "stack_ops": {
        const { stack, activeNode, action } = state;
        return (
          <div className="grid grid-cols-2 gap-4 w-full h-44 animate-fadeIn">
            {/* Real pile block container */}
            <div className="border-b-4 border-l-4 border-r-4 border-slate-800 rounded-b-xl px-4 py-2 flex flex-col-reverse justify-start items-center h-full relative bg-slate-950/30">
              {stack.length === 0 ? (
                <span className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs font-mono">
                  Stack Array Empty
                </span>
              ) : (
                stack.map((val: number, idx: number) => {
                  const isTop = idx === stack.length - 1;
                  return (
                    <div 
                      key={idx} 
                      className={`w-full py-2.5 px-3 rounded-lg border text-xs font-mono font-bold text-center mb-1 transition-all duration-300 ${
                        isTop 
                          ? "bg-indigo-600 border-indigo-400 text-white shadow" 
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      [{idx}] Value: {val}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pointer / CPU holding state */}
            <div className="flex flex-col justify-center items-center bg-slate-950/50 rounded-xl p-4 border border-slate-900 gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wide">
                Register Variable View
              </span>
              <div className="h-16 w-full border border-dashed border-slate-800 rounded-xl flex items-center justify-center relative">
                {activeNode !== null ? (
                  <div className="bg-amber-500 border border-amber-400 text-slate-950 rounded-lg py-2 px-4 text-xs font-bold font-mono animate-bounce shadow">
                    Value: {activeNode}
                  </div>
                ) : (
                  <span className="text-slate-700 text-[10px] font-mono">No active nodes in register</span>
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-500 capitalize">
                Last Event: {action.toLowerCase().replace("_", " ")}
              </span>
            </div>
          </div>
        );
      }
      case "dp_fib": {
        const { n, memo, stackFrames, result } = state;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-fadeIn h-44 overflow-y-auto pr-1">
            {/* Call Stack frames */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex flex-col gap-1.5 overflow-y-auto">
              <span className="text-[10px] uppercase font-mono font-bold text-rose-400 flex items-center gap-1">
                <Layers className="w-3 h-3" /> Recursive Call Stack
              </span>
              {stackFrames.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-600 text-[10px] font-mono">
                  No active stack frames
                </div>
              ) : (
                <div className="flex flex-col-reverse gap-1">
                  {stackFrames.map((frame: string, idx: number) => {
                    const isTop = idx === stackFrames.length - 1;
                    return (
                      <div 
                        key={idx} 
                        className={`py-1 px-2 text-[10px] font-mono border rounded ${
                          isTop 
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-300 font-bold" 
                            : "bg-slate-900 border-slate-850 text-slate-500"
                        }`}
                      >
                        {isTop ? "▶ " : "  "} {frame} (n={n})
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Memoization Cache Table */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex flex-col gap-1.5 overflow-y-auto">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Memo Lookup Table
              </span>
              {Object.keys(memo).length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-600 text-[10px] font-mono">
                  Memo Table is empty
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1">
                  {Object.entries(memo).map(([k, v]) => (
                    <div key={k} className="bg-slate-900 border border-emerald-950 px-2 py-1 rounded flex flex-col items-center">
                      <span className="text-[9px] text-slate-500 font-mono">N: {k}</span>
                      <span className="text-[11px] font-bold text-emerald-400 font-mono">{v as any}</span>
                    </div>
                  ))}
                </div>
              )}
              {result !== null && (
                <div className="mt-auto bg-emerald-500/10 border border-emerald-500/20 rounded py-1 px-2.5 text-[10px] font-mono text-emerald-300 text-center font-bold">
                  Final Fibonacci Value: {result}
                </div>
              )}
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 font-sans" id="code-trace-panel">
      
      {/* Visualizer header & algorithm selection */}
      <div className="bg-slate-950 border-b border-slate-800/80 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/25 text-indigo-400 animate-pulse">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Dynamic Line-by-Line Code Visualizer</h3>
            <p className="text-[11px] text-slate-500 font-mono">{activeAlgo.complexity}</p>
          </div>
        </div>

        {/* Picker Dropdown */}
        <div className="w-full sm:w-auto relative">
          <select
            value={selectedAlgoId}
            onChange={handleAlgoChange}
            className="w-full sm:w-64 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl py-2 px-3 text-xs font-semibold text-indigo-300 outline-none cursor-pointer transition-all"
          >
            {ALGORITHMS_TRACES.map((algo) => (
              <option key={algo.id} value={algo.id} className="bg-slate-900 text-slate-200">
                {algo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main split work board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 border-b border-slate-850">
        
        {/* LEFT COLUMN: Line highlighted TypeScript Source Code */}
        <div className="lg:col-span-5 bg-slate-950 p-4 border-b lg:border-b-0 lg:border-r border-slate-850 font-mono text-[11px] md:text-xs overflow-x-auto max-h-[360px] lg:max-h-[440px] scrollbar-thin scrollbar-thumb-slate-800">
          <div className="flex items-center gap-1.5 mb-3 text-[10px] text-indigo-400 font-bold tracking-wider uppercase">
            <Eye className="w-3.5 h-3.5" /> TypeScript Debugger View
          </div>
          <div className="space-y-0.5 select-all">
            {activeAlgo.code.map((line, idx) => {
              const isExecuting = idx === activeStep.lineIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-start rounded py-1 px-1 transition-all duration-150 ${
                    isExecuting
                      ? "bg-indigo-600/25 border-l-4 border-indigo-500 text-white font-semibold pl-1.5"
                      : "text-slate-400 opacity-65 hover:opacity-100 pl-2.5"
                  }`}
                >
                  {/* Line Number indicator */}
                  <span className={`w-6 text-right shrink-0 select-none mr-3 text-[9px] font-bold font-mono ${isExecuting ? "text-indigo-400" : "text-slate-600"}`}>
                    {idx + 1}
                  </span>
                  
                  {/* Exec pointer symbol */}
                  <span className="w-3 shrink-0 select-none text-indigo-400 text-[10px] font-bold mr-1">
                    {isExecuting ? "▶" : " "}
                  </span>
                  
                  {/* Code Line Content */}
                  <pre className="whitespace-pre font-mono leading-relaxed truncate">{line}</pre>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive live canvas & watch boards */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6 bg-slate-900/40">
          
          {/* Sub-playground area */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-5 flex items-center justify-center min-h-[220px]">
            {renderVisualPlayground()}
          </div>

          {/* Variables watch block */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block select-none">
              Variables Watch Panel (Real-Time State)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(activeStep.variables).length === 0 ? (
                <div className="col-span-full text-slate-600 font-mono text-[10px] py-1">
                  No active stack or local frame variables declared yet
                </div>
              ) : (
                Object.entries(activeStep.variables).map(([key, val]) => (
                  <div key={key} className="bg-slate-900/60 border border-slate-850 px-2.5 py-1.5 rounded-lg flex items-center justify-between font-mono text-[10px] leading-none">
                    <span className="text-slate-500 font-bold mr-1.5">{key}:</span>
                    <span className="text-indigo-400 font-black truncate max-w-[120px]" title={String(val)}>
                      {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Coach live execution explanation */}
          <div className="bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-xl flex items-start gap-3">
            <div className="p-1 bg-indigo-500/15 rounded-lg border border-indigo-400/20 text-indigo-400 shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold font-mono tracking-wide text-indigo-400 uppercase">
                Coach Live Trace Analysis
              </span>
              <p className="text-xs text-slate-300 leading-normal mt-0.5">
                {activeStep.actionDesc}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Control bar footer */}
      <div className="bg-slate-950 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left side stats */}
        <div className="text-xs text-slate-400 font-mono">
          Step: <span className="font-extrabold text-indigo-400">{currentStepIndex + 1}</span> / <span className="text-slate-500">{activeAlgo.steps.length}</span>
        </div>

        {/* Central Controller buttons */}
        <div className="flex items-center gap-2">
          {/* Restart */}
          <button
            onClick={restartTrace}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            title="Rewind to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back */}
          <button
            onClick={stepBackward}
            disabled={currentStepIndex === 0}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"
            title="Step back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause toggle */}
          {isPlaying ? (
            <button
              onClick={() => setIsPlaying(false)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-550 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-600/10"
            >
              <Pause className="w-3.5 h-3.5" /> Pause Auto
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              disabled={currentStepIndex === activeAlgo.steps.length - 1}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-550 disabled:opacity-45 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/15"
            >
              <Play className="w-3.5 h-3.5" /> Auto Trace
            </button>
          )}

          {/* Step Forward */}
          <button
            onClick={stepForward}
            disabled={currentStepIndex === activeAlgo.steps.length - 1}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"
            title="Step forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Speed regulator selection */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Speed:</span>
          <div className="flex bg-slate-900 p-0.5 border border-slate-800 rounded-lg text-[10px] font-mono">
            {[
              { label: "0.5x", val: 2000 },
              { label: "1x", val: 1200 },
              { label: "2x", val: 600 }
            ].map((speed) => (
              <button
                key={speed.label}
                onClick={() => setPlaySpeed(speed.val)}
                className={`px-2 py-1 rounded transition-colors ${
                  playSpeed === speed.val
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
