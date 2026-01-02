

import { twilioClient } from "../services/twilioClient";
import "dotenv/config";
import { ENV } from "../config/env";

interface CallInput {
  phoneNumbers: string[];
  script: string;
}

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function callAgent({ phoneNumbers, script }: CallInput): Promise<"CALLS_COMPLETED"> {
  for (const number of phoneNumbers) {
    try {
      await twilioClient.calls.create({
        to: number,
        from: ENV.TWILIO_PHONE_NUMBER,
        twiml: `<Response><Say>${script}</Say></Response>`
      });
    } catch (error) {
      console.log(`Call to ${number} is not possible:`, (error as Error).message);
      continue;
    }

    await wait(60000); // 60 seconds
  }
  return "CALLS_COMPLETED";
}
