import { DSATopic, PracticeChallenge, QuizQuestion } from "../types";

export const DSA_TOPICS: DSATopic[] = [
  {
    id: "stack",
    name: "Stack (LIFO)",
    category: "DS",
    difficulty: "Easy",
    shortDesc: "Last-In-First-Out data structure ideal for tracking histories, undo buffers, and matching nested tokens.",
    fullDesc: "A Stack is a linear data structure that follows the LIFO (Last In First Out) principle. The last element inserted is the first one to be removed. In TypeScript and modern JavaScript engines, arrays can serve as stacks natively using push() and pop() which run in constant time O(1). However, implementing a custom generic Stack provides strong interfaces and memory efficiency.",
    realWorldUse: "Browser navigation action history (Back/Forward), Text-editor undo/redo buffers, compiler parenthesis matching, and Call Stack tracking in the V8 engine.",
    complexity: {
      time: "O(1) for push, pop, peek",
      space: "O(N) total storage size",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)"
    },
    typescriptTemplate: `/**
 * Generic Stack implementation in TypeScript
 */
export class Stack<T> {
  private items: T[] = [];

  // Add an item to the top of the stack (O(1))
  push(element: T): void {
    this.items.push(element);
  }

  // Remove and return the top item (O(1))
  pop(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items.pop();
  }

  // Check the top item without removing it (O(1))
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // Check if stack is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Get active size
  size(): number {
    return this.items.length;
  }

  // Clear all items
  clear(): void {
    this.items = [];
  }
}`,
    explanationSteps: [
      "Items are always added to the 'top' and removed from the 'top'.",
      "No index access is permitted; you cannot visit items under the top elements directly.",
      "Pushing elements increases the depth; popping retrieves the most recently pushed item.",
      "Extremely fast constant O(1) time complexity for insertions and deletions."
    ]
  },
  {
    id: "queue",
    name: "Queue (FIFO)",
    category: "DS",
    difficulty: "Easy",
    shortDesc: "First-In-First-Out data structure crucial for task scheduling, messaging queues, and tree/graph BFS depth-sweeping.",
    fullDesc: "A Queue is a linear data structure that operates under the FIFO (First In First Out) protocol. The first element added is the first to be retrieved. While standard arrays shift() can serve as dequeuing, they require shifting all remaining items, making dequeuing an O(N) operation. A proper Queue implementation uses dual index pointers or linked node lists to guarantee constant O(1) time.",
    realWorldUse: "Printer spoolers, background task schedulers, microtask queuing in the Event Loop, streaming buffers, and Breadth-First Search (BFS) graph traversals.",
    complexity: {
      time: "O(1) enqueue and dequeue",
      space: "O(N) total entries space",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)"
    },
    typescriptTemplate: `/**
 * High-performance double-ended pointer Queue in TypeScript
 */
export class Queue<T> {
  private items: Record<number, T> = {};
  private headIndex: number = 0;
  private tailIndex: number = 0;

  // Insert element to tail (O(1))
  enqueue(item: T): void {
    this.items[this.tailIndex] = item;
    this.tailIndex++;
  }

  // Retrieve and remove element from head (O(1))
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return item;
  }

  // Examine head item (O(1))
  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.headIndex];
  }

  isEmpty(): boolean {
    return this.tailIndex - this.headIndex === 0;
  }

  size(): number {
    return this.tailIndex - this.headIndex;
  }
}`,
    explanationSteps: [
      "Elements arrive at the back (tail) and depart from the front (head).",
      "By using an index Map/Record instead of standard Array.shift(), we avoid the O(N) array-reindexing penalty.",
      "Maintains separate front and rear pointers, both advancing infinitely to ensure constant O(1) time.",
      "Ideal model for rate-limitation filters and network package transfers."
    ]
  },
  {
    id: "linked_list",
    name: "Linked List (Singly Linked)",
    category: "DS",
    difficulty: "Easy",
    shortDesc: "Sequential collection of nodes connected with next-pointers, facilitating dynamic insertion and deletion operations.",
    fullDesc: "A Linked List is a linear data collection where element ordering is determined by pointer links rather than static memory array indices. Highly dynamic; elements (called Nodes) can be physically stored anywhere in memory. Singly linked list nodes possess an internal piece of data in addition to a pointer to the 'next' node.",
    realWorldUse: "Implementing Stacks, Queues, memory caches, music playlists (forward track transitions), and handling collisions in Hash Tables using Chaining.",
    complexity: {
      time: "Insertion O(1) to head; Searching O(N)",
      space: "O(N) memory allocation space",
      best: "O(1) head insertion/removal",
      average: "O(N) random lookup",
      worst: "O(N) lookup"
    },
    typescriptTemplate: `/**
 * Singly Linked List Implementation in TypeScript 
 */
export class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private sizeCount: number = 0;

  // Append new node to head (O(1))
  prepend(value: T): void {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
    this.sizeCount++;
  }

  // Append new node to tail (O(N) or O(1) with pointer tracker)
  append(value: T): void {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.sizeCount++;
  }

  // Search collection (O(N))
  find(value: T): ListNode<T> | null {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  getHead(): ListNode<T> | null {
    return this.head;
  }

  size(): number {
    return this.sizeCount;
  }
}`,
    explanationSteps: [
      "Each node houses a stored item value and a link to the subsequent neighbor.",
      "Accessing a specific arbitrary item requires starting from the top head and traversing one-by-one (O(N) access).",
      "Dynamic allocation; does not face static sizing thresholds or expensive array memory reallocation fees."
    ]
  },
  {
    id: "bst",
    name: "Binary Search Tree (BST)",
    category: "DS",
    difficulty: "Medium",
    shortDesc: "Hierarchical node structure where left subtrees host lesser elements, and right subtrees host larger values.",
    fullDesc: "A Binary Search Tree is a tree-shaped hierarchical node system. Each node has at most two children. Sorting constraint (BST Invariant): For any given node, all elements in the left subtree must be strictly less than the node's value, and all elements in the right subtree must be strictly greater. This structural paradigm maps search, insertion, and deletion paths to logarithmic time O(log N).",
    realWorldUse: "Database index tracking, file directories structuring, 3D gaming partition systems, and autocomplete query systems.",
    complexity: {
      time: "O(log N) lookup/insertion search (O(N) if skewed)",
      space: "O(N) total tree allocation",
      best: "O(log N)",
      average: "O(log N)",
      worst: "O(N) (unbalanced/skewed tree)"
    },
    typescriptTemplate: `/**
 * Strongly Typed Binary Search Tree structure in TypeScript
 */
export class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

export class BinarySearchTree {
  private root: TreeNode | null = null;

  // Insert value keeping BST rules intact (O(log N))
  insert(value: number): void {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    this.insertNode(this.root, newNode);
  }

  private insertNode(node: TreeNode, newNode: TreeNode): void {
    if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  // Search if path exists
  search(value: number): boolean {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: TreeNode | null, value: number): boolean {
    if (!node) return false;
    if (value === node.value) return true;
    return value < node.value 
      ? this.searchNode(node.left, value) 
      : this.searchNode(node.right, value);
  }

  getRoot(): TreeNode | null {
    return this.root;
  }
}`,
    explanationSteps: [
      "Start searching from the Root.",
      "If values are less than current node's, steer Left. If larger, branch Right.",
      "In-Order Traversals (Left -> Current -> Right) iterate over items in perfectly sorted numeric sequence.",
      "Unbalanced input strings (e.g. 1 -> 2 -> 3 -> 4) skew into simple linked structures, degrading performance to O(N)."
    ]
  },
  {
    id: "bubble_sort",
    name: "Bubble Sort Algorithm",
    category: "ALGO",
    difficulty: "Easy",
    shortDesc: "Introductory sorting protocol that continuously bubbles the largest element to the end of the collection using repetitive swaps.",
    fullDesc: "Bubble Sort is a simple comparison-based sorting algorithm. It traverses through the array iteratively, compares adjoining elements, and swaps them if they are in the wrong order. This pass-by-pass bubbling is executed until the array becomes sorted. While pedagogically valuable, it is highly ineffective for large collections due to its quadratic O(N²) average and worst cases.",
    realWorldUse: "Educational introduction to sorting mechanics, or sorting near-sorted lists where minor boundary alignments can be resolved in few linear operations.",
    complexity: {
      time: "O(N^2) average/worst; O(N) optimized helper best",
      space: "O(1) auxiliary variables",
      best: "O(N)",
      average: "O(N^2)",
      worst: "O(N^2)"
    },
    typescriptTemplate: `/**
 * Optimized Bubble Sort implementation in TypeScript
 */
export function bubbleSort(arr: number[]): number[] {
  const result = [...arr]; // Keep source pure
  const n = result.length;
  let swapped: boolean;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    // Last i elements are already bubbled into correct position
    for (let j = 0; j < n - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        // Swap values
        const temp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = temp;
        swapped = true;
      }
    }
    // If no values swapped during pass, the list is already sorted!
    if (!swapped) break;
  }
  return result;
}`,
    explanationSteps: [
      "Compare index j with index j + 1.",
      "If current is larger than next, swap them immediately.",
      "Each outer pass locks in the maximum unsorted value at the corresponding tail position.",
      "A swapped boolean tracker stops unnecessary loop cycles if array becomes fully sorted early."
    ]
  },
  {
    id: "recursion",
    name: "Recursion & Backtracking",
    category: "ALGO",
    difficulty: "Medium",
    shortDesc: "Algorithmic technique where a function invokes itself to process subset instances, combining base cases and call stacks.",
    fullDesc: "Recursion solves complex problems by dividing them into simpler sub-instances, solved via function self-invocation. It relies entirely on the Call Stack. Each recursive step must push the current frame details onto the memory stack. Essential features: a 'Base Case' (triggers exit conditions) and a 'Recursive Step' (shrinks size of target state). Backtracking is a refined exhaustive search technique that discards paths as soon as validity rules fail.",
    realWorldUse: "JSON parser traversals, HTML DOM node mapping, folder explorer tree walks, maze generation algorithms, and combinatorics.",
    complexity: {
      time: "Varies; O(2^N) for naive Fibonacci, O(N) optimized",
      space: "O(D) where D stands for depth of Call Stack limit",
      best: "O(1) base case hit",
      average: "O(N) or O(2^N)",
      worst: "O(2^N) or stack overflow"
    },
    typescriptTemplate: `/**
 * Elegant Recursive Binary Search implementation in TypeScript
 */
export function recursiveBinarySearch(
  arr: number[],
  target: number,
  low: number = 0,
  high: number = arr.length - 1
): number {
  // Base Case: element not found
  if (low > high) return -1;

  const mid = Math.floor(low + (high - low) / 2);

  // Base Case: Target found!
  if (arr[mid] === target) return mid;

  // Recursive Decision Paths
  if (target < arr[mid]) {
    // Search left half
    return recursiveBinarySearch(arr, target, low, mid - 1);
  } else {
    // Search right half
    return recursiveBinarySearch(arr, target, mid + 1, high);
  }
}`,
    explanationSteps: [
      "Identify the ultimate Base Case: if target boundaries cross without matching, return -1.",
      "Locate the middle value, halving the scope on every recursive iteration.",
      "The recursive engine creates isolated stack frames capturing parameter boundaries.",
      "TypeScript handles these stack calls natively in the JavaScript engine memory space."
    ]
  },
  {
    id: "dynamic_programming",
    name: "Dynamic Programming (DP)",
    category: "ALGO",
    difficulty: "Hard",
    shortDesc: "Advanced problem solving optimization combining overlapping subproblems with memoized lookup caches.",
    fullDesc: "Dynamic Programming is general algorithmic optimization used to solve complex problems by breaking them into overlapping, recursive subproblems. Instead of recomputing results for identical substates over and over (e.g. naive Fibonacci running in exponential O(2^N) time), Dynamic Programming saves completed subproblem values in a cache (Memoization) or builds them incrementally from base rules (Tabulation), dropping complexity to O(N).",
    realWorldUse: "Webpack dependency trees resolution, text file comparison diff algorithms (Levenshtein Distance), resource scheduling (Knapsack problems), and route navigation APIs.",
    complexity: {
      time: "O(N) with memoization / tabulation",
      space: "O(N) storage table allocation",
      best: "O(1)",
      average: "O(N)",
      worst: "O(N)"
    },
    typescriptTemplate: `/**
 * Highly optimized, memoized Fibonacci implementation in TypeScript
 */
export class FibonacciDP {
  private memo: Map<number, number> = new Map();

  // Top-Down DP using Memoization (O(N))
  getTerms(n: number): number {
    // Base Cases
    if (n <= 0) return 0;
    if (n === 1) return 1;

    // Return cached value if we computed this state before
    if (this.memo.has(n)) {
      return this.memo.get(n)!;
    }

    // Compute, cache, and return
    const result = this.getTerms(n - 1) + this.getTerms(n - 2);
    this.memo.set(n, result);
    return result;
  }

  // Clear memoization cache to free memory
  clearCache(): void {
    this.memo.clear();
  }
}`,
    explanationSteps: [
      "Analyze the overlapping subproblem tree (e.g. computing fib(5) computes fib(3) twice).",
      "Draft a structured data lookup cache - typically a TypeScript Map<number, number> or standard Array.",
      "Check the cache first on each execution turn prior to processing the recurse cascade.",
      "Saves thousands of duplicate, costly recursive loops, transforming exponential problems to linear cost."
    ]
  },
  {
    id: "hash_table",
    name: "Hash Table (Collision Chaining)",
    category: "DS",
    difficulty: "Medium",
    shortDesc: "Key-value store mapping hashes to bucket array indexes, using chaining linked lists to resolve collision overlaps.",
    fullDesc: "A Hash Table is a collection structure that associates keys with values. It achieves amortized constant O(1) time complexity for search, insertion, and deletion by using a mathematical hash function to translate keys into bucket positions. When different keys generate the same hash value (a Collision), Chaining resolves this by appending values to a linked list inside the bucket.",
    realWorldUse: "High speed database keys query indexing, browser caching systems, web session registries, and unique set/frequency tables.",
    complexity: {
      time: "O(1) average lookup/insert; O(N) worst case if skewed collisions",
      space: "O(N) memory allocation table size",
      best: "O(1)",
      average: "O(1)",
      worst: "O(N)"
    },
    typescriptTemplate: `/**
 * Generic Hash Table with Collision Chaining in TypeScript
 */
export class HashTable<K, V> {
  private buckets: Array<Array<[K, V]>> = Array.from({ length: 16 }, () => []);

  // Simple hashing function
  private hash(key: string): number {
    let hashValue = 0;
    for (let i = 0; i < key.length; i++) {
      hashValue += key.charCodeAt(i);
    }
    return hashValue % this.buckets.length;
  }

  // Insert or update key-value pair
  set(key: K, value: V): void {
    const idx = this.hash(String(key));
    const bucket = this.buckets[idx];
    for (const pair of bucket) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }
    bucket.push([key, value]);
  }

  // Retrieve stored value
  get(key: K): V | undefined {
    const idx = this.hash(String(key));
    const bucket = this.buckets[idx];
    for (const pair of bucket) {
      if (pair[0] === key) return pair[1];
    }
    return undefined;
  }
}`,
    explanationSteps: [
      "Compute key's hash value, translating characters to integer codes.",
      "Map the code to a buckets index using modulo divisions.",
      "Navigate to the bucket index and find the match or append a new tuple.",
      "Maintain a low load factor to prevent performance degradation to O(N)."
    ]
  },
  {
    id: "binary_search",
    name: "Binary Search (Divide & Conquer)",
    category: "ALGO",
    difficulty: "Easy",
    shortDesc: "Efficiently locates a target in a pre-sorted array by repeatedly halving the inspection boundaries.",
    fullDesc: "Binary Search is a classic divide-and-conquer algorithm. Rather than scanning sequentially (O(N)), it requires a sorted list and maintains lower and upper indices. In each step, it checks the center element. If the target matches, it exits. Otherwise, it halves the search space, reducing time to logarithmic O(log N).",
    realWorldUse: "C++ std::lower_bound, database B-Tree leaf traversal, system configuration debugging (git bisect commit tracing).",
    complexity: {
      time: "O(log N) search queries",
      space: "O(1) constant variables",
      best: "O(1)",
      average: "O(log N)",
      worst: "O(log N)"
    },
    typescriptTemplate: `/**
 * Classical Binary Search implementation in TypeScript
 */
export function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;

    if (arr[mid] < target) {
      low = mid + 1; // Discard left half
    } else {
      high = mid - 1; // Discard right half
    }
  }
  return -1; // Target missing
}`,
    explanationSteps: [
      "Confirm input array is sorted prior to invocation.",
      "Initialize low and high pointers mapping the outer list indices.",
      "Examine middle value; adjust bounds to continue searching Left or Right.",
      "Saves exponential time compared to simple linear arrays lookup."
    ]
  },
  {
    id: "graph_traversals",
    name: "Graph Traversals (BFS & DFS)",
    category: "ALGO",
    difficulty: "Medium",
    shortDesc: "Explores node networks iteratively with queues (Breadth-First Search) or recursively with stack frames (Depth-First Search).",
    fullDesc: "Graph Traversal is the process of visiting all vertices in a network of nodes connected by edges. Breadth-First Search (BFS) explores layer-by-layer using a FIFO Queue, making it ideal for finding the shortest path. Depth-First Search (DFS) dives as deep as possible before backtracking, using a recursion Stack.",
    realWorldUse: "GPS route planners, social link recommendation engines, garbage collection trace markers, and internet web crawler scrapers.",
    complexity: {
      time: "O(V + E) where V=vertices, E=edges",
      space: "O(V) storage tracking queues",
      best: "O(1)",
      average: "O(V + E)",
      worst: "O(V + E)"
    },
    typescriptTemplate: `/**
 * Adjacency-list Graph Breadth-First search in TypeScript
 */
export class Graph {
  private adjList: Map<number, number[]> = new Map();

  // Insert vertex link
  addEdge(u: number, v: number): void {
    if (!this.adjList.has(u)) this.adjList.set(u, []);
    if (!this.adjList.has(v)) this.adjList.set(v, []);
    this.adjList.get(u)!.push(v);
    this.adjList.get(v)!.push(u);
  }

  // BFS Traversal
  bfs(start: number): number[] {
    const visited = new Set<number>([start]);
    const queue = [start];
    const result: number[] = [];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      result.push(curr);

      for (const neighbor of this.adjList.get(curr) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return result;
  }
}`,
    explanationSteps: [
      "Keep track of visited nodes using a Set to avoid infinite loop cycles.",
      "Queue up starting point for Breadth-First sweep search paths.",
      "Visit neighbors incrementally, establishing shortest hops counts.",
      "Perfect model for routing social recommendations and mapping pathways."
    ]
  }
];

export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q_stack_1",
    topicId: "stack",
    question: "Which of the following structures operates strictly under the LIFO (Last-In-First-Out) arrangement?",
    options: ["Queue", "Binary Search Tree", "Stack", "Singly Linked List"],
    correctIndex: 2,
    explanation: "A Stack utilizes a 'Last-In-First-Out' pattern. The newest element placed inside is the first one accessed."
  },
  {
    id: "q_stack_2",
    topicId: "stack",
    question: "Using a native JavaScript array, what is the best constant-time approach to perform standard push and pop actions on a Stack?",
    options: [
      "Using shift() and unshift() operations",
      "Using push() and pop() operations",
      "Manually resizing the array using array.length = k custom checks",
      "Using standard splice() insertions at position 0"
    ],
    correctIndex: 1,
    explanation: "In JS arrays, push() and pop() append and take items from the end of the array, requiring no re-indexing. Thus, they run in O(1) constant time. (shift/unshift require shifting every subsequent element, degrading to O(N))."
  },
  {
    id: "q_queue_1",
    topicId: "queue",
    question: "What is the primary drawback of using standard Array.shift() to perform dequeues in a simple Queue array model?",
    options: [
      "It causes memory leaks on Node servers",
      "It requires O(N) complexity because the engine must shift every remaining array item leftward",
      "It returns a string instead of maintaining generics type info",
      "It permanently locks the array size"
    ],
    correctIndex: 1,
    explanation: "Array.shift() removes the first element and shifts all subsequent elements to the left, which has active O(N) complexity. Dedicated high-performance models use dual pointer trackers on dynamic objects instead."
  },
  {
    id: "q_list_1",
    topicId: "linked_list",
    question: "What is the time complexity to retrieve or access an element at index 'k' in a standard Singly Linked List of size 'N'?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctIndex: 2,
    explanation: "Unlike static arrays where memory is contiguous, Linked List nodes are scattered. You must crawl through the links start to index 'k', taking search time linear with list depth (O(N))."
  },
  {
    id: "q_bst_1",
    topicId: "bst",
    question: "What is the worst-case runtime complexity for performing search or insertion in an unbalanced, skewed Binary Search Tree?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctIndex: 2,
    explanation: "If a BST is unbalanced (skewed like a straight line 1 -> 2 -> 3 -> 4), looking up or adding elements requires traversing the entire cascade, reverting performance to linear O(N) like a standard list."
  },
  {
    id: "q_bubble_1",
    topicId: "bubble_sort",
    question: "How does the optimized Bubble Sort implementation achieve its best-case O(N) runtime?",
    options: [
      "By using divide-and-conquer strategy",
      "By tracking if any swaps occurred in a pass; if not, stopping the algorithm early",
      "By employing a binary lookup helper on comparative cycles",
      "By dividing original sizes using recursive loops"
    ],
    correctIndex: 1,
    explanation: "If an array is already sorted, tracking swaps with an active boolean flag lets the loop exit on the first pass, saving N-1 unnecessary passes and giving O(N) best-case performance."
  },
  {
    id: "q_dp_1",
    topicId: "dynamic_programming",
    question: "What are the two core conditions a problem must meet to be an optimal candidate for Dynamic Programming?",
    options: [
      "Unbalanced hierarchy and dynamic arrays",
      "Overlapping subproblems and optimal substructure",
      "Linear memory bounds and recursive limits",
      "Hash collisions and tree imbalances"
    ],
    correctIndex: 1,
    explanation: "Dynamic Programming operates on problems containing overlapping subproblems (re-computing state-splits) and optimal substructure (where overall optimal solutions can be constructed using localized, optimal sub-solutions)."
  }
];

export const MOCK_CHALLENGES: PracticeChallenge[] = [
  {
    id: "challenge_stack",
    topicId: "stack",
    title: "Valid Parentheses Checker",
    difficulty: "Easy",
    prompt: "Write a function `isValidParentheses(s: string): boolean` that takes a string containing bracket characters '(', ')', '{', '}', '[', and ']', and determines if the input string is valid.\n\nValidity criteria:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.",
    starterCode: `function isValidParentheses(s: string): boolean {
  // TODO: Implement using a Stack approach
  return false;
}`,
    solutionSnippet: `function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (char in map) {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
    hints: [
      "You can treat a standard array as a stack using push() and pop().",
      "When encountering an opening bracket, push it to your stack.",
      "When encountering a closing bracket, pop the top element and check if it matches the counterpart bracket type.",
      "In the end, if the stack is completely empty, all bracket openings were correctly paired!"
    ],
    testRunner: (userCode: string) => {
      const logs: string[] = [];
      try {
        // Create evaluation wrapper safely
        const compiled = new Function(`
          ${userCode}
          return isValidParentheses;
        `)();

        if (typeof compiled !== "function") {
          return { passed: false, logs: ["Error: `isValidParentheses` function not declared or visible."] };
        }

        const cases = [
          { input: "()", expected: true },
          { input: "()[]{}", expected: true },
          { input: "(]", expected: false },
          { input: "([)]", expected: false },
          { input: "{[]}", expected: true }
        ];

        let allPassed = true;
        cases.forEach((tc, idx) => {
          const res = compiled(tc.input);
          const passed = res === tc.expected;
          logs.push(`Test Case ${idx + 1}: input="${tc.input}", got=${res}, expected=${tc.expected} -> ${passed ? "✅ PASSED" : "❌ FAILED"}`);
          if (!passed) allPassed = false;
        });

        return { passed: allPassed, logs };
      } catch (err: any) {
        return { passed: false, logs: [`Internal execution error during compilation: ${err.message}`] };
      }
    }
  },
  {
    id: "challenge_queue",
    topicId: "queue",
    title: "Implement Stacks using Dual Queues",
    difficulty: "Medium",
    prompt: "Design a customized stack using two standard queues. Implement a class `QueueStack` with functions:\n- `push(x: number): void` (inserts element onto stack)\n- `pop(): number` (removes and returns top element)\n- `peek(): number` (returns the top element without removing it)\n- `empty(): boolean`",
    starterCode: `class QueueStack {
  private q1: number[] = [];
  private q2: number[] = [];

  push(x: number): void {
    // TODO: implement
  }

  pop(): number | undefined {
    // TODO: implement
    return undefined;
  }

  peek(): number | undefined {
    // TODO: implement
    return undefined;
  }

  empty(): boolean {
    // TODO: implement
    return true;
  }
}`,
    solutionSnippet: `class QueueStack {
  private q1: number[] = [];
  private q2: number[] = [];

  push(x: number): void {
    this.q2.push(x);
    while (this.q1.length > 0) {
      this.q2.push(this.q1.shift()!);
    }
    // Swap queues
    const temp = this.q1;
    this.q1 = this.q2;
    this.q2 = temp;
  }

  pop(): number | undefined {
    return this.q1.shift();
  }

  peek(): number | undefined {
    return this.q1[0];
  }

  empty(): boolean {
    return this.q1.length === 0;
  }
}`,
    hints: [
      "Queues are FIFO, meaning you insert at the back and dequeue from the front.",
      "To make pop() or push() O(N) so the top element of the stack rests at the front of q1, we shuffle items.",
      "Pushing an element 'x' onto q2 first, then shifting all items from q1 to q2, then swapping references makes sure the latest element resides at q1's front!"
    ],
    testRunner: (userCode: string) => {
      const logs: string[] = [];
      try {
        const compiled = new Function(`
          ${userCode}
          return QueueStack;
        `)();

        if (typeof compiled !== "function" && typeof compiled !== "object") {
          return { passed: false, logs: ["Error: `QueueStack` class definition could not be correctly targeted."] };
        }

        const stack = new compiled();
        stack.push(10);
        stack.push(20);
        
        let p1 = stack.peek();
        let pop1 = stack.pop();
        let p2 = stack.peek();
        let emp = stack.empty();
        
        const r1 = p1 === 20;
        const r2 = pop1 === 20;
        const r3 = p2 === 10;
        const r4 = emp === false;

        logs.push(`Push(10), Push(20) -> Peek expected=20, got=${p1} : ${r1 ? "✅" : "❌"}`);
        logs.push(`Pop() expected=20, got=${pop1} : ${r2 ? "✅" : "❌"}`);
        logs.push(`Peek after pop expected=10, got=${p2} : ${r3 ? "✅" : "❌"}`);
        logs.push(`Empty() expected=false, got=${emp} : ${r4 ? "✅" : "❌"}`);

        const passed = r1 && r2 && r3 && r4;
        return { passed, logs };
      } catch (err: any) {
        return { passed: false, logs: [`Compilation or execution failure: ${err.message}`] };
      }
    }
  },
  {
    id: "challenge_list",
    topicId: "linked_list",
    title: "Reverse Singly Linked List",
    difficulty: "Easy",
    prompt: "Given the head of a singly linked list, reverse the list, and return its new head node.\nNodes are structured as: `ListNode { value: number; next: ListNode | null }`",
    starterCode: `// Nodes possess standard format: { value: number; next: ListNode | null }
function reverseLinkedList(head: any): any {
  // TODO: Re-align pointers to flip the sequence
  return head;
}`,
    solutionSnippet: `function reverseLinkedList(head: any): any {
  let prev = null;
  let current = head;
  while (current !== null) {
    const nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }
  return prev;
}`,
    hints: [
      "To reverse a dynamic chain, keep trackers for: previous element, current element, and next element.",
      "Iterating through the nodes, update current.next to point backward to previous.",
      "Careful! Before changing current.next, cache current.next in a temp variable so you do not lose the rest of your original list."
    ],
    testRunner: (userCode: string) => {
      const logs: string[] = [];
      try {
        const compiled = new Function(`
          ${userCode}
          return reverseLinkedList;
        `)();

        // Build a mock list: 1 -> 2 -> 3
        const n3 = { value: 3, next: null as any };
        const n2 = { value: 2, next: n3 };
        const n1 = { value: 1, next: n2 };

        logs.push("Input LinkedList: 1 -> 2 -> 3");
        const revHead = compiled(n1);

        if (!revHead) {
          return { passed: false, logs: ["Error: Returned head node is null."] };
        }

        const v1 = revHead.value === 3;
        const v2 = revHead.next && revHead.next.value === 2;
        const v3 = revHead.next && revHead.next.next && revHead.next.next.value === 1;
        const v4 = revHead.next && revHead.next.next && revHead.next.next.next === null;

        logs.push(`Reversed Node 1: got=${revHead.value}, expected=3 : ${v1 ? "✅" : "❌"}`);
        logs.push(`Reversed Node 2: got=${revHead.next?.value}, expected=2 : ${v2 ? "✅" : "❌"}`);
        logs.push(`Reversed Node 3: got=${revHead.next?.next?.value}, expected=1 : ${v3 ? "✅" : "❌"}`);

        const passed = !!(v1 && v2 && v3 && v4);
        return { passed, logs };
      } catch (err: any) {
        return { passed: false, logs: [`Execution error: ${err.message}`] };
      }
    }
  }
];
