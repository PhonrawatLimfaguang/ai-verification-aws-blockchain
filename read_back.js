// read_back.js
import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// โหลด ABI ของสัญญา
const abi = JSON.parse(fs.readFileSync("./abi.json", "utf8"));
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDR, abi, provider);

// ใช้ fileHash เดียวกับ report_text.json ที่ส่งขึ้นไปก่อนหน้านี้
const fileHash = "2f776f8ab1e0e6c0f7c8f3b2a9d3b1a5c3d7e8f90123456789abcdef01234567";

const main = async () => {
  console.log("🔍 Reading data from blockchain...");
  const count = await contract.getAttestationCount(fileHash);
  console.log("🧾 Attestation count:", count.toString());

  if (count > 0n) {
    const att = await contract.getAttestationByIndex(fileHash, 0);
    console.log("📜 Attestation #0:");
    console.log({
      verifier: att.verifier,
      modality: Number(att.modality),
      isAI: att.isAI,
      confidence: Number(att.confidence),
      fileHash: att.fileHash,
      modelId: att.modelId,
      modelVersion: att.modelVersion,
      reportURI: att.reportURI,
      timestamp: Number(att.timestamp),
    });
  } else {
    console.log("⚠️ No attestation found for this fileHash.");
  }
};

main().catch(console.error);
