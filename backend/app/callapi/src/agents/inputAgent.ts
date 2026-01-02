interface InputPayload {
  campaign_name: string;
  campaign_description: string;
  csvPath: string;
}

interface NormalizedPayload {
  campaignName: string;
  description: string;
  csvPath: string;
}

export async function inputAgent(payload: InputPayload): Promise<NormalizedPayload> {
  return {
    campaignName: payload.campaign_name,
    description: payload.campaign_description,
    csvPath: payload.csvPath
  };
}
