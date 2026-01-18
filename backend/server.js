import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt } from "./prompt.js";
import { getMemory, saveMessage } from "./memory.js";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    const sid = sessionId || crypto.randomUUID();
    const memory = getMemory(sid);

    saveMessage(sid, "user", message);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...memory.map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        }))
      ]
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    saveMessage(sid, "assistant", reply);

    res.json({ reply, sessionId: sid });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Scorpio AI running on port ${PORT}`);
});
