// list_models_rest.js
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function main() {
  if (!API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in .env");
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("❌ Fetch error:", res.status, res.statusText);
    const text = await res.text();
    console.error(text);
    process.exit(1);
  }

  const data = await res.json();
  console.log("✅ Available Gemini Models:");
  console.log("==============================");

  for (const m of data.models || []) {
    console.log(`📌 Model ID: ${m.name}`);
    console.log(`   ✅ Supported Methods: ${m.supportedGenerationMethods?.join(", ")}`);
    console.log("------------------------------");
  }

  console.log("\n👉 Recommended models (can generateContent):");
  const rec = (data.models || []).filter(m =>
    (m.supportedGenerationMethods || []).includes("generateContent")
  );
  rec.forEach(m => console.log(" -", m.name));
}

main().catch(err => console.error(err));
