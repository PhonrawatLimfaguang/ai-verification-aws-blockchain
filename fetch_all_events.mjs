// fetch_all_events.mjs
import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const { RPC_URL, CONTRACT_ADDR } = process.env;
if (!RPC_URL || !CONTRACT_ADDR) {
  console.error("❌ Missing RPC_URL or CONTRACT_ADDR in .env");
  process.exit(1);
}
const abi = JSON.parse(fs.readFileSync("./abi.json", "utf8"));

function toTime(tsBn) {
  const n = Number(tsBn);
  return isFinite(n) ? new Date(n * 1000).toLocaleString() : "-";
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDR, abi, provider);

  // ⚠️ ชื่ออีเวนต์ต้องตรงกับในสัญญา (ส่วนใหญ่ตั้งว่า "Attested")
  const events = await contract.queryFilter("Attested");
  console.log(`🔎 Found ${events.length} Attested events`);

  const rows = events.map((ev, i) => {
    const a = ev.args || {};
    return {
      idx: i,
      txHash: ev.transactionHash,
      fileHash: a.fileHash,
      verifier: a.verifier,
      modality: Number(a.modality),
      isAI: Boolean(a.isAI),
      confidence: Number(a.confidence),
      modelId: a.modelId,
      modelVersion: a.modelVersion,
      reportURI: a.reportURI,
      timestamp: toTime(a.timestamp),
    };
  });

  fs.writeFileSync("./attestations_events.json", JSON.stringify(rows, null, 2));
  console.log("✅ saved: attestations_events.json");

  // แสดงสรุปสั้น ๆ ในคอนโซล
  for (const r of rows) {
    console.log(
      `${r.idx}. ${r.isAI ? "AI" : "Human"} conf=${r.confidence}% | ${r.modelId}\n` +
      `   fileHash=${r.fileHash}\n   report=${r.reportURI}\n   tx=${r.txHash}\n   ts=${r.timestamp}\n`
    );
  }
}

main().catch(console.error);
