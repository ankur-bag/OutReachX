

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const ENV = {
  PORT: Number(process.env.PORT ?? 3000),

  GEMINI_API_KEY: requireEnv("GEMINI_API_KEY"),

  TWILIO_ACCOUNT_SID: requireEnv("TWILIO_ACCOUNT_SID"),
  TWILIO_AUTH_TOKEN: requireEnv("TWILIO_AUTH_TOKEN"),
  TWILIO_PHONE_NUMBER: requireEnv("TWILIO_PHONE_NUMBER")
};
