import dotenv from "dotenv";
import fs from "fs/promises";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getTranslations(d) {
  const data = JSON.parse(d);
  const obj = {
    name: data.name,
    description: data.des,
    originalLanguage: data.lang,
  };

  const prompt = `
  You are a strict JSON generation engine.

  INPUT PRODUCT DOCUMENT:
  ${JSON.stringify(obj, null, 2)}

  SUPPORTED LANGUAGES:
  [hindi, english, bengali, telugu, marathi, tamil, urdu, gujarati, bhojpuri, malyalam,punjabi]

  TASK:
  Translate the product name and description into ALL the languages above.
  Translate with correct grammar and context. Dont just phrase the same word in different language, instead find its translated word in the language
  Output a JSON array of objects with the following structure:
  {
    "lang": "<target language>",
    "name": "<translated name>",
    "description": "<translated description>"
  }

  RULES:
  - If target language equals originalLanguage, return text unchanged.
  - Output MUST be a valid JSON ARRAY.
  - Do NOT include markdown formatting (like \`\`\`json).
  - Do NOT output any conversational text. Just the array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemma-3-27b-it",
      contents: prompt,
    });

    let cleanText = response.text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(cleanText);
    await fs.writeFile("output.json", JSON.stringify(parsed, null, 2));
    // console.log("Successfully saved translations to output.json");
    return cleanText;
  } catch (error) {
    console.error("Error Details:", error.message);
    if (error.response) {
      console.error("API Response:", error.response);
    }
  }
  return "";
}

export default getTranslations;
