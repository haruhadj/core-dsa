import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// Initialize Gemini SDK with telemetry and fallback checking
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY is not configured or still set to placeholder. AI Coach operates in offline simulation mode.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini SDK:", error);
}

// System instruction to guide the AI Coach
const DSA_SYSTEM_INSTRUCTION = `You are a high-caliber Data Structures and Algorithms (DSA) Coach, custom-tailored for TypeScript developers. 
Your tone should be helpful, clear, precise, and encouraging.
When writing code snippets, explaining concepts, or answering questions:
1. Always write implementations in clean, modern, strongly-typed TypeScript (prefer interfaces, generics <T>, custom types, and explicit returns).
2. Avoid generic JavaScript. Capitalize on TypeScript strengths like strict type safety, type arguments, and structural typing.
3. For every solution or data structure discussed, explicitly provide a Complexity Panel showing:
   - Time Complexity: Best, Average, Worst with brief explanations of why.
   - Space Complexity: Explaining memory layout (auxiliary vs total).
4. Feel free to explain common TypeScript-native structures (e.g., how JS Arrays are implemented as dynamic arrays, utilizing Map<K, V>, Set<T>, or implementing custom trees or hash tables).
5. If the user presents a code snippet, debug it point-by-point, specify bugs with line-referencing, and write a correct, strongly-typed alternative.
6. Support interactive learning: Ask checking questions, propose small exercises, or generate quick challenges when appropriate.`;

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Chat session with AI coach
app.post("/api/dsa-chat", async (req, res) => {
  const { messages, userCode, contextTopic } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
  }

  // If Gemini is not configured, send a friendly educational simulated response
  if (!ai) {
    const lastMessage = messages[messages.length - 1]?.content || "";
    return res.json({
      role: "model",
      content: `### 🤖 [Coach Mode: Offline Mode]
It looks like the API key isn't fully configured yet, but I can help you review **${contextTopic || 'DSA Concepts'}**!

Here is a quick TypeScript-focused overview of typical questions for your topic:
1. **Generics**: Essential for reusable data structures. Always write:
   \`\`\`typescript
   class TreeNode<T> {
     value: T;
     left: TreeNode<T> | null = null;
     right: TreeNode<T> | null = null;
     constructor(value: T) {
       this.value = value;
     }
   }
   \`\`\`
2. **Built-in Map/Set**: Did you know TypeScript's standard \`Map<K, V>\` is a hash-table implementation with key insert ordering? Lookups are amortized \`O(1)\`.

*To enable real-time custom answers and live code reviews, please ensure a valid **GEMINI_API_KEY** is configured in your project secrets!*`
    });
  }

  try {
    // Collect message content aligned to Gemini user/model roles block
    // Map client roles: 'user' | 'assistant' (or 'coach') -> 'user' | 'model'
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" || msg.role === "model" || msg.role === "coach" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    // Inject contextual code or topics as helper context if provided
    if (userCode || contextTopic) {
      let contextHeader = "## Current Study Context:\n";
      if (contextTopic) contextHeader += `- Active Topic: ${contextTopic}\n`;
      if (userCode) contextHeader += `- Code under review:\n\`\`\`typescript\n${userCode}\n\`\`\`\n`;
      contextHeader += "\nPlease incorporate this context when crafting your response.";
      
      // Prepend context to the last user message to avoid messing with turn orders
      const lastIndex = contents.length - 1;
      if (lastIndex >= 0 && contents[lastIndex].role === "user") {
        contents[lastIndex].parts[0].text = `${contextHeader}\n\nUser Question: ${contents[lastIndex].parts[0].text}`;
      } else {
        contents.push({
          role: "user",
          parts: [{ text: `${contextHeader}\n\nPlease analyze this active study context.` }]
        });
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: DSA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const aiText = response.text || "I was unable to generate a response. Please try again.";
    return res.json({ role: "model", content: aiText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Failed to communicate with AI Coach",
      details: error.message || String(error)
    });
  }
});

// Configure Vite or Static files serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in Development Mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in Production Mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error("Failed to start server:", err);
});
