// ==============================
// ✅ ระบบตรวจ AI ด้วย Gemini (Simple Version)
// ==============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. อ่าน ENV (เหลือแค่ 2 ตัว) ---
const { GEMINI_API_KEY, PORT } = process.env;

function must(name, value) {
  if (!value) throw new Error(`❌ Missing env: ${name}`);
  return value;
}
must("GEMINI_API_KEY", GEMINI_API_KEY);

const APP_PORT = PORT || 5005;

// --- 2. Setup Gemini ---
const MODEL_ID = "models/gemini-1.5-flash"; // 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: MODEL_ID });

// ✨ วิเคราะห์ด้วย Gemini (บังคับ JSON)
async function analyzeWithGemini(text) {
  const prompt = `
ช่วยวิเคราะห์ข้อความต่อไปนี้ว่าเขียนโดย “AI” หรือ “มนุษย์”
โปรดตอบ JSON เท่านั้น:

{
  "isAI": true หรือ false,
  "confidence": 0-100,
  "explanation": "อธิบายสั้น ๆ ว่าทำไมถึงคิดแบบนั้น"
}

ข้อความ:
"""${text}"""
  `;
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  const rawText = (response.text() || "").trim();

  try {
    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      isAI: !!parsed.isAI,
      confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 0)),
      explanation: parsed.explanation || "ไม่สามารถอธิบายได้",
      raw: rawText,
    };
  } catch {
    return {
      isAI: false,
      confidence: 10,
      explanation: "โมเดลตอบไม่ใช่ JSON ที่ถูกต้อง",
      raw: rawText,
    };
  }
}

// --- 3. ลบ Blockchain/IPFS ออกไป ---
// (ส่วนนี้ว่างเปล่า)

// --- 4. API (สั้นลงมาก) ---
app.post("/api/verify-text", async (req, res) => {
  try {
    const { text } = req.body ?? {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "missing text" });
    }

    // ✅ STEP 1: วิเคราะห์ด้วย Gemini
    const ai = await analyzeWithGemini(text);
    
    // ✅ STEP 2: สร้าง Report
    // (เราจะเก็บ log ง่ายๆ บน EC2 ชั่วคราว ถ้าต้องการ)
    // fs.appendFileSync("./simple_log.json", JSON.stringify(report) + "\n");

    const report = {
      modality: "TEXT",
      isAI: ai.isAI,
      confidence: ai.confidence,
      explanation: ai.explanation,
      modelId: MODEL_ID,
      createdAt: Date.now(),
      textSnippet: text.slice(0, 200),
      geminiRaw: ai.raw,
    };

    // ✅ STEP 3: ส่งผลกลับไปให้เว็บ (ไม่มี Blockchain/IPFS)
    return res.json({
      success: true,
      result: report,
      // ไม่มี ipfs, ไม่มี txHash
    });

  } catch (err) {
    console.error("verify-text error:", err);
    res.status(500).json({ error: err.message || "unknown error" });
  }
});

// --- 5. Start Server ---
// (ใช้โค้ดจาก STEP 0 ที่คุณส่งมาให้)
app.listen(APP_PORT, "0.0.0.0", () =>
  console.log(`✅ Gemini-powered AI Verification API running on port ${APP_PORT}`)
);