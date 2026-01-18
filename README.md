# 🛡️ AI Content Verification & Blockchain Audit Platform

แพลตฟอร์มวิเคราะห์ความถูกต้องของเนื้อหาด้วย AI (Google Gemini) พร้อมระบบจัดเก็บ Log บน Cloud และยืนยันความโปร่งใสผ่านเทคโนโลยี Blockchain

---

## 🏗️ System Architecture
<img width="974" height="711" alt="image" src="https://github.com/user-attachments/assets/3a3e5eb8-1005-4c74-8a88-c7c2b4d16552" />
<img width="884" height="423" alt="image" src="https://github.com/user-attachments/assets/736bb4f3-cd5e-4e44-9784-aa999e544232" />
<img width="884" height="524" alt="image" src="https://github.com/user-attachments/assets/f802c156-5f5b-49f5-899e-06a2f65896c1" />


---

## 🌟 Key Features
* **AI Authenticity Scoring:** ใช้โมเดล **Gemini 2.5 Flash** ในการประเมินเนื้อหาและให้ค่าความเชื่อมั่น (Confidence Score)
* **Data Cleansing Pipeline:** ระบบ Node.js API ที่ทำหน้าที่กรองข้อมูล (Input Validation) และปรับโครงสร้างข้อมูลให้อยู่ในรูปแบบ JSON ที่สมบูรณ์ก่อนบันทึก
* **Immutable Cloud Logging:** บันทึกผลการวิเคราะห์ลงใน **Amazon S3** โดยตรง เพื่อเป็น Audit Trail ที่แก้ไขไม่ได้
* **Blockchain Registry:** ใช้ **Smart Contract (Solidity)** ในการลงทะเบียนข้อมูลการตรวจสอบ (Attestation) เพื่อการยืนยันตัวตนระดับสากล
* **Operational Excellence:** ติดตั้งบน **AWS EC2 (Amazon Linux)** และควบคุมการทำงานด้วย **PM2** เพื่อความเสถียรของระบบ 24/7

---

## 🛠️ Tech Stack
| Layer | Technology Used |
|---|---|
| **Frontend** | React.js, Recharts, Tailwind CSS |
| **Backend** | Node.js (Express), ethers.js, AWS SDK |
| **AI Engine** | Google Gemini API (Generative AI) |
| **Cloud** | AWS (EC2, S3 Static Web Hosting) |
| **Blockchain** | Solidity, Hardhat/Remix, EVM Compatible Network |

---

## 📂 Project Structure
ai-verificationAWS/
├── 📄 AIVerificationRegistryV2.sol   # Smart Contract หลักสำหรับบันทึกข้อมูล
├── 📄 server.js                       # ระบบ Backend และ AI Logic (Express)
├── 📄 abi.json                        # ข้อมูล Interface สำหรับเชื่อมต่อ Blockchain
├── 📁 dashboard/                      # โฟลเดอร์โปรเจกต์ React (Frontend)
│   ├── 📁 src/                        # โค้ดต้นฉบับของหน้าจอ Dashboard
│   └── 📁 public/                     # ไฟล์สาธารณะสำหรับเว็บแอป
├── 📁 artifacts/                      # ไฟล์ที่ได้จากการ Compile Smart Contract
├── 📄 attest_submit.js                # สคริปต์สำหรับส่งข้อมูลยืนยัน
├── 📄 fetch_all_events.mjs            # สคริปต์ดึงข้อมูลเหตุการณ์จาก Blockchain
├── 📄 package.json                    # รายการ Library ที่โปรเจกต์ต้องการ
├── 📄 .env.example                    # ตัวอย่างการตั้งค่าสภาพแวดล้อม
└── 📄 .gitignore                      # ไฟล์ระบุส่วนที่ไม่ต้องนำขึ้น GitHub
