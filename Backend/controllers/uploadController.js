const xlsx = require("xlsx");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

exports.analyzeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No file uploaded" });
    }

    // 1️⃣ Read Excel buffer → JSON
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 2️⃣ Convert part of file into summary string
    const fileSummary = data
      .slice(0, 100)
      .map((row) => JSON.stringify(row))
      .join("\n");

    // 3️⃣ Create Gemini prompt
    const prompt = `
You are an AI productivity coach. Analyze this user's mobile activity log and produce a JSON object like:
{
  "summary": "short summary text",
  "metrics": { "totalMinutes": number, "productiveHours": number, "breakdownPercent": { "social": number, "work": number, "study": number } },
  "top_time_wasters": [ { "activity": string, "minutes": number } ],
  "recommended_routine": [ { "slot": string, "activity": string } ],
  "actions_to_cut": [ { "action": string, "reason": string } ]
}

Input (user activity logs):
${fileSummary}
`;

    // 4️⃣ Send to Gemini API
const response = await axios.post(
      // RECOMMENDED: Use the latest stable Flash model
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", 
      {
        contents: [
          {
            // Note: The 'role' field is optional for single-turn user prompts
            // but is required for multi-turn chat to alternate between 'user' and 'model'.
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
        // Passing the API key as a URL query parameter is correct for the REST API
        params: { key: process.env.GEMINI_API_KEY }, 
      }
    );

    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 5️⃣ Try to parse JSON result
    let gptResult;
    try {
      gptResult = JSON.parse(rawText);
    } catch {
      gptResult = { summary: rawText };
    }

    return res.status(200).json({ ok: true, gptResult });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    res.status(500).json({ ok: false, error: "Error analyzing file" });
  }
};
