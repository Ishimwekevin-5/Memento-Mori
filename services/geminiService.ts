
import { GoogleGenAI } from "@google/genai";

export const getReflection = async (daysPassed: number, totalDays: number, year: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const percent = Math.round((daysPassed / totalDays) * 100);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: This is a minimalist calendar app showing the passage of time. 
      Today is day ${daysPassed} of ${year}. ${percent}% of the year has passed.
      Task: Provide a short, profound, stoic reflection on the passage of time. 
      Vibe: Minimalist, elegant, slightly melancholic but motivating (memento mori style). 
      Limit to exactly one sentence. Do not include any intros or outros.`,
    });

    return response.text || "Time is the most valuable thing a man can spend.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The trouble is, you think you have time.";
  }
};
