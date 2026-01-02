import { inputAgent } from "./inputAgent";
import { safetyAgent } from "./safetyAgent";
import { voiceScriptAgent } from "./voiceScriptAgent";
import { callAgent } from "./callAgent";
import { parseCSV } from "../utils/csvParser";
import { detectPhoneNumbers } from "../utils/phoneDetector";

interface CampaignPayload {
  campaign_name: string;
  campaign_description: string;
  csvPath: string;
}

interface RunResult {
  status: "SUCCESS";
  calls_made: number;
}

export async function runCampaignAgents(payload: CampaignPayload): Promise<RunResult> {
  const normalized = await inputAgent(payload);

  const rows = await parseCSV(normalized.csvPath);
  const phoneNumbers = detectPhoneNumbers(rows);

  if (!phoneNumbers.length) {
    throw new Error("No phone numbers found in CSV");
  }

  await safetyAgent(normalized.description);
/////plug-in ur prev voicescript...
  const voiceScript = await voiceScriptAgent(normalized);
//
  await callAgent({
    phoneNumbers,
    script: voiceScript
  });

  return {
    status: "SUCCESS",
    calls_made: phoneNumbers.length
  };
}
