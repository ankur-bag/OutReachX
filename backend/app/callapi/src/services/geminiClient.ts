
import "dotenv/config";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { ENV } from "../config/env";



const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});
