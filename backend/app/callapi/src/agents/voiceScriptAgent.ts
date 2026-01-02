

import { model } from "../services/geminiClient";

interface VoiceScriptInput {
  campaignName: string;
  description: string;
}

export async function voiceScriptAgent({ campaignName, description }: VoiceScriptInput): Promise<string> {
  const prompt = `
Generate a voice-call script.

Rules:
- Max 15 seconds spoken
- Natural conversational tone
- No markdown
- No emojis
- Suitable for automated phone calls

Campaign: ${campaignName}
Description: ${description}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
