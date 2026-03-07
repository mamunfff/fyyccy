import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../data/questions";

// Initialize Gemini API
// The API key is handled by the platform and available in process.env.GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const translationService = {
  async translateQuestion(question: Question): Promise<Question> {
    // If it's already translated (not fallback English), return it
    if (question.text.bn !== question.text.en) {
      return question;
    }

    try {
      const model = "gemini-3-flash-preview";
      const response = await genAI.models.generateContent({
        model,
        contents: `Translate the following UK Driving Theory Test question, its options, and explanation into Bengali. 
        Maintain the exact same structure.
        
        Question: ${question.text.en}
        Options:
        ${question.options.map(o => `${o.id}: ${o.text.en}`).join('\n')}
        Explanation: ${question.explanation.en}
        
        Return the translation in JSON format with the following structure:
        {
          "text": "Bengali translation of the question",
          "options": {
            "a": "Bengali translation of option a",
            "b": "Bengali translation of option b",
            ...
          },
          "explanation": "Bengali translation of the explanation"
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: {
                type: Type.OBJECT,
                properties: {
                  a: { type: Type.STRING },
                  b: { type: Type.STRING },
                  c: { type: Type.STRING },
                  d: { type: Type.STRING },
                  e: { type: Type.STRING }
                }
              },
              explanation: { type: Type.STRING }
            },
            required: ["text", "options", "explanation"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      
      if (!result.text) return question;

      return {
        ...question,
        text: { ...question.text, bn: result.text },
        options: question.options.map(o => ({
          ...o,
          text: { ...o.text, bn: result.options[o.id] || o.text.en }
        })),
        explanation: { ...question.explanation, bn: result.explanation }
      };
    } catch (error) {
      console.error("Translation error:", error);
      return question;
    }
  }
};
