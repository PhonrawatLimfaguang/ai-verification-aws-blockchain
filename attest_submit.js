// attest_submit.js
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// โหลด config จาก .env
const { RPC_URL, CONTRACT_ADDR, VERIFIER_PRIVKEY, IPFS_URL } = process.env;

// ✅ สร้าง client สำหรับเชื่อม IPFS Desktop (local)
const client = create({ url: IPFS_URL });

// ✅ โหลด abi ของ smart contract
const abi = JSON.parse(fs.readFileSync("./abi.json", "utf8"));

// ✅ สร้าง provider + signer (บัญชี verifier)
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(VERIFIER_PRIVKEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDR, abi, signer);

// ✅ อ่านไฟล์รายงานจาก argument
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: node attest_submit.js <file.json> <TEXT|VIDEO>");
  process.exit(1);
}

const [filePath, modalityType] = args;
const modality = modalityType === "VIDEO" ? 1 : 0;

// =====================================================
async function main() {
  console.log("🚀 Connecting to IPFS...");
  const file = fs.readFileSync(filePath);
  const added = await client.add(file);
  const cid = `ipfs://${added.path}`;
  console.log("✅ IPFS:", cid);

  const report = JSON.parse(file);
  const tx = await contract.submitAttestation(
    report.fileHash,
    modality,
    report.isAI,
    report.confidence,
    report.modelId,
    report.modelVersion,
    cid
  );

  console.log("⛓️  Tx sent:", tx.hash);
  await tx.wait();
  console.log("✅ Submitted successfully!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
});
