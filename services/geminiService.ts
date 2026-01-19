
import { GoogleGenAI } from "@google/genai";

export const getReflection = async (daysPassed: number, totalDays: number, year: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const percent = Math.round((daysPassed / totalDays) * 100);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: This is a minimalist calendar app showing the passage of time. 
      Today is day ${daysPassed} of ${year}. ${percent}% of the year has passed.
      Task: Provide a short, profound quote or reflection specifically about the value of Life and the flow of Time. 
      Vibe: Minimalist, elegant, inspiring, and stoic. 
      CRITICAL RULE: Do NOT use the word "death", "die", "dying", or "mortal". Focus entirely on living and existence.
      Limit to exactly one sentence. Do not include any intros, outros, or quotation marks.`,
    });

    return response.text?.trim() || "Life is long if you know how to use it.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The time is always right to do what is right.";
  }
};
