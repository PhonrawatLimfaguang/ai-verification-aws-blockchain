import React, { useMemo, useState } from "react";
// ⛔ ลบ ethers และ abi.json ออกไป
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

// ⛔ ลบ shortHash, safeIpfs, fetchReportFromIPFS ออกไป

function App() {
  // ⛔ ลบ fileHash, attestation, loading ออกไป
  const [allData, setAllData] = useState([]); // 👈 เหลือแค่ตารางรวม
  const [analyzing, setAnalyzing] = useState(false);
  const [liveResult, setLiveResult] = useState(null);

  // ⛔ ลบ RPC_URL, CONTRACT_ADDR ออกไป
  // ⛔ ลบ handleLoadAll และ handleSearch ออกไป

  // ✅ นี่คือฟังก์ชันเดียวที่เราต้องใช้
  const handleAnalyzeText = async () => {
    const textEl = document.getElementById("inputText");
    const text = textEl ? textEl.value : "";
    if (!text) return alert("กรุณาใส่ข้อความก่อน");

    setAnalyzing(true);
    setLiveResult(null);
    try {
      // ✅ ⭐️⭐️⭐️ ใช้ IP ใหม่ ⭐️⭐️⭐️
      const res = await fetch("http://3.90.1.22:5005/api/verify-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (data.success) {
        setLiveResult({
          isAI: Boolean(data.result.isAI),
          confidence: Number(data.result.confidence),
          explanation: data.result.explanation || "—",
          // ⛔ ไม่มี txHash, ไม่มี ipfs
          modelId: data.result.modelId,
          createdAt: new Date(data.result.createdAt).toLocaleString(),
        });

        const snippet =
          data.result.textSnippet ||
          (text.length > 120 ? text.slice(0, 120) + "…" : text || "—");

        // ✅ อัปเดตตาราง (ง่ายขึ้น)
        setAllData((prev) => {
          const nowTs = Date.now();
          const newItem = {
            isAI: Boolean(data.result.isAI),
            confidence: Number(data.result.confidence),
            modelId: data.result.modelId,
            ts: nowTs,
            timestamp: new Date(nowTs).toLocaleString(),
            explanation: data.result.explanation || "—",
            textSnippet: snippet,
          };
          // เพิ่มอันใหม่เข้าไปข้างบน
          return [newItem, ...prev];
        });

      } else {
        alert("เกิดข้อผิดพลาดในการตรวจข้อความ");
      }
    } catch (err) {
      alert("เชื่อมต่อ API ไม่ได้ กรุณาเช็กว่า server.js รันอยู่");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // ... (ส่วน KPI + Chart data ยังใช้ได้)
  const aiCount = useMemo(
    () => allData.filter((d) => d.isAI).length,
    [allData]
  );
  const humanCount = useMemo(() => allData.length - aiCount, [allData]);
  const lastModel = allData[0]?.modelId || "-";

  const chartData = useMemo(
    () => [
      { name: "AI", value: aiCount },
      { name: "Human", value: humanCount },
    ],
    [aiCount, humanCount]
  );

  return (
    <div className="container">
      <div className="header">
        <div className="brand" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="brand-badge">AuthChain</div>
          <h1>AI Verification Dashboard</h1>
        </div>
        {/* ⛔ ลบ RPC/Contract ออกไป */}
      </div>

      <div className="hero" style={{ display: "grid", gap: 12, gridTemplateColumns: "1.2fr 1fr" }}>
        {/* ====== Left: Realtime verify ====== */}
        <div className="card">
          <h2>🧠 ตรวจข้อความแบบเรียลไทม์</h2>
          <p className="muted">
         เว็บไซต์นี้เป็นแพลตฟอร์มอัจฉริยะสำหรับ "ตรวจสอบความน่าเชื่อถือของเนื้อหา" (Content Verification) โดยมีวัตถุประสงค์เพื่อแยกแยะว่าข้อความที่ปรากฏนั้นถูกเขียนขึ้นโดย มนุษย์ (Human) หรือถูกสร้างขึ้นโดย ปัญญาประดิษฐ์ (AI) ระบบทำงานโดยเชื่อมต่อกับโมเดลภาษาขั้นสูง (Google Gemini) เพื่อวิเคราะห์บริบท รูปแบบภาษา และความซับซ้อนของประโยค พร้อมทั้งจัดเก็บประวัติการตรวจสอบทั้งหมดลงในระบบคลาวด์ (AWS S3) ที่มีความปลอดภัยสูง เพื่อใช้เป็นหลักฐานอ้างอิงในอนาคตของผู้ใช้ได้
          </p>

          <textarea
            id="inputText"
            className="textarea"
            placeholder="พิมพ์ข้อความที่ต้องการตรวจ..."
          />
          <div className="row">
            <button className="btn" onClick={handleAnalyzeText} disabled={analyzing}>
              {/* ⛔ เปลี่ยนข้อความปุ่ม */}
              {analyzing ? "กำลังวิเคราะห์..." : "🔍 วิเคราะห์ข้อความ"}
            </button>
            <button
              className="btn secondary"
              onClick={() => {
                const el = document.getElementById("inputText");
                if (el) el.value = "";
                setLiveResult(null);
              }}
            >
              เคลียร์ข้อความ
            </button>
          </div>

          {liveResult && (
            <div className="result" style={{ marginTop: 12 }}>
              <p>
                <span className={`badge ${liveResult.isAI ? "ai" : "human"}`}>
                  {liveResult.isAI ? "🧠 AI" : "👤 Human"}
                </span>{" "}
                <span className="badge muted">ความมั่นใจ {liveResult.confidence}%</span>{" "}
                <span className="badge tag">{liveResult.modelId}</span>
              </p>
              <p><b>คำอธิบาย:</b> {liveResult.explanation}</p>
              
              {/* ⛔ ลบ Tx Hash และ IPFS ออกไป */}

              <p className="muted">Created: {liveResult.createdAt}</p>
            </div>
          )}
        </div>

        {/* ====== Right: KPI + Controls ====== */}
        <div className="card">
          <h2>📌 ภาพรวม</h2>
          <div className="kpis">
            <div className="kpi">
              <div className="label">ทั้งหมด</div>
              <div className="val">{allData.length}</div>
            </div>
            <div className="kpi">
              <div className="label">AI</div>
              <div className="val" style={{ color: "#DE5D7A" }}>{aiCount}</div>
            </div>
            <div className="kpi">
              <div className="label">Human</div>
              <div className="val" style={{ color: "#86efac" }}>{humanCount}</div>
            </div>
          </div>

          <div className="section">
            <p className="muted">
              โมเดลล่าสุด: <span className="badge tag">{lastModel}</span>
            </p>
          </div>

          {/* ⛔ ลบปุ่ม "Load from Chain" และ "Search by fileHash" ทั้งหมด */}
          
          <div className="chart-box" style={{ padding: 0, marginTop: 16 }}>
            <h2 className="chart-title">📊 สัดส่วน AI vs Human</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={100}
                  label
                >
                  <Cell fill="var(--chart-ai)" />
                  <Cell fill="var(--chart-human)" />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ====== Table ====== */}
      {allData.length > 0 && (
        <div className="section">
          <h2 style={{ margin: 0 }}>🧾 รายการผลลัพธ์ล่าสุด</h2>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                {/* ⛔ ลบ Verifier ออก */}
                <th>ผล</th>
                <th>Confidence</th>
                <th>Model</th>
                <th>ข้อความ</th>
                {/* ⛔ ลบ Report (IPFS) ออก */}
                <th>เวลา</th>
              </tr>
            </thead>
            <tbody>
              {allData.map((d, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <span className={`badge ${d.isAI ? "ai" : "human"}`}>
                      {d.isAI ? "AI" : "Human"}
                    </span>
                  </td>
                  <td>{Number(d.confidence)}%</td>
                  <td><span className="badge tag">{d.modelId}</span></td>
                  <td className="mono">
                    {d.textSnippet
                      ? (d.textSnippet.length > 40 ? d.textSnippet.slice(0, 40) + "…" : d.textSnippet)
                      : <span className="muted">—</span>}
                  </td>
                  <td className="muted">{d.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="footer" style={{ marginTop: 30, display: "flex", gap: 8, alignItems: "center" }}>
        <span>© AuthChain · AI Verification · {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}

export default App;