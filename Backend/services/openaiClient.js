import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeWithOpenAI(summary) {
  const prompt = `
You are an expert productivity coach.
Analyze this JSON and return ONLY valid JSON with keys:
summary, metrics, top_time_wasters, recommended_routine, actions_to_cut.

Input:
${JSON.stringify(summary)}

Return only JSON.
`;

  const resp = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    max_output_tokens: 1500,
  });

  const raw = resp.output?.[0]?.content?.[0]?.text ?? JSON.stringify(resp);
  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}
