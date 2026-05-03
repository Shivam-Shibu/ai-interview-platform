"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";

const CATEGORY_PROMPTS = {
  FRONTEND: "React, JavaScript, CSS",
  BACKEND: "Node.js, APIs",
  FULLSTACK: "full-stack",
  DSA: "data structures and algorithms",
  SYSTEM_DESIGN: "distributed systems",
  BEHAVIORAL: "leadership and teamwork",
};

export const generateInterviewQuestions = async ({ category }) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const normalized = category?.toUpperCase();

  if (!normalized || !CATEGORY_PROMPTS[normalized]) {
    throw new Error("Invalid category");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  // 🔥 STRONG PROMPT (very important)
  const prompt = `
You are an expert interviewer.

Generate exactly 6 interview questions for ${normalized} (${CATEGORY_PROMPTS[normalized]}).

Return ONLY valid JSON array in this format:
[
  { "question": "string", "answer": "string" }
]

Rules:
- No markdown
- No explanation
- No trailing commas
- Proper double quotes
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const clean = text.replace(/^```json|^```|```$/gm, "").trim();

  let questions = [];

  try {
    // ✅ First attempt
    questions = JSON.parse(clean);
  } catch (err) {
    console.error("❌ JSON parse failed. Raw output:", clean);

    try {
      // ✅ Fallback: extract JSON array
      const match = clean.match(/\[\s*{[\s\S]*}\s*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        throw new Error("No valid JSON found");
      }
    } catch (err2) {
      console.error("❌ Fallback parsing failed:", err2);

      // ✅ अंतिम fallback (never crash UI)
      return {
        questions: [
          {
            question: "Failed to generate questions",
            answer: "Please try again.",
          },
        ],
      };
    }
  }

  return { questions };
};