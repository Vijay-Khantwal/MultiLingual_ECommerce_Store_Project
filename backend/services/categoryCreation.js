import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";
import Category from "../models/Category.js"; 

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const categories = [
  "Clothing",
  "Furniture",
  "Groceries",
  "Electronics",
  "Footwear",
  "Home Decor",
  "Kitchen Essentials",
  "Beauty Products",
  "Personal Care",
  "Books",
  "Stationery",
  "Sports Equipment",
  "Fitness Accessories",
  "Toys",
  "Baby Products",
  "Pet Supplies",
  "Snacks",
  "Beverages",
  "Health Supplements",
  "Medicines",
  "Mobile Accessories",
  "Computer Accessories",
  "Gaming Accessories",
  "Watches",
  "Jewelry",
  "Bags",
  "Luggage",
  "Travel Accessories",
  "Office Supplies",
  "School Supplies",
  "Lighting",
  "Electrical Items",
  "Tools",
  "Automotive Accessories",
  "Bike Accessories",
  "Car Accessories",
  "Gardening Tools",
  "Outdoor Equipment",
  "Home Storage",
  "Cleaning Supplies",
  "Laundry Products",
  "Bathroom Accessories",
  "Bedsheets",
  "Curtains",
  "Pillows",
  "Mattresses",
  "Wall Art",
  "Photo Frames",
  "Gift Items",
  "Miscellaneous"
];

const LANGS = [
  "hindi",
  "english",
  "bengali",
  "telugu",
  "marathi",
  "tamil",
  "urdu",
  "gujarati",
  "bhojpuri",
  "malyalam",
  "punjabi",
];

async function translateCategory(name) {
  const prompt = `
You are a strict JSON generator.

INPUT CATEGORY:
"${name}"

SUPPORTED LANGUAGES:
${JSON.stringify(LANGS)}

TASK:
Translate the category name into ALL the languages above.

RULES:
- Use proper commonly-used translated terms (not transliteration)
- Output MUST be a valid JSON ARRAY
- Structure:
[
  {
    "language": "<language>",
    "name": "<translated name>",
    "description": ""
  }
]
- If language is english, keep the name unchanged
- No markdown
- No extra text
`;

  const res = await ai.models.generateContent({
    model: "gemma-3-27b-it",
    contents: prompt,
  });

  let text = res.text.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  return JSON.parse(text);
}

async function run() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("MongoDB connected");

  for (const category of categories) {
    console.log(`Processing: ${category}`);

    const translations = await translateCategory(category);

    await Category.create({
      translations,
    });

    // small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("All categories inserted");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
