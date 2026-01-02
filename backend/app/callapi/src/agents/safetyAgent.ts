

import { model } from "../services/geminiClient";

export async function safetyAgent(content: string): Promise<"SAFE"> {
  const prompt = `
Classify the content below.

Reply with ONLY ONE WORD:
SAFE or UNSAFE

Content:
${content}
`;

  const result = await model.generateContent(prompt);
  const verdict = result.response.text().trim().toUpperCase();

  if (verdict !== "SAFE") {
    throw new Error("Gemini classified content as UNSAFE");
  }

  return "SAFE";
}
