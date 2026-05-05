import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { modeConfig } from "./Prompts/config.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:4200", // local dev
      "https://devgpt-ai-developer-assistant-frontend.onrender.com", // deployed frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json());

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat endpoint handling AI interaction
app.post("/chat", async (req, res) => {
  try {
    const { messages, mode } = req.body;

    // Select mode configuration to control AI behavior (prompt, temperature, tokens)
    const selectedMode = modeConfig[mode] || {};

    // Fallback to default assistant behavior if mode is not provided
    let systemPrompt = selectedMode.prompt || "You are a helpful AI assistant.";

    // Enable streaming response to send data in chunks (better UX, lower latency)
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: selectedMode.temperature || 0.5,
      max_tokens: selectedMode.max_tokens || 800,
      stream: true, // ✅ enable streaming
    });

    // Stream response chunks to client as they arrive
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        res.write(content); // 🔥 send chunk
      }
    }

    res.end();
  } catch (error) {
    // Handle API or server errors
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({
        error: "AI service error. Please try again.",
      });
    }
    if (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Server busy. Try again shortly.",
      });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
