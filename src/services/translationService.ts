import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Question } from "../data/questions";

// Initialize Gemini API
// The API key is handled by the platform and available in process.env.GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const translationCache: Record<string, Question> = {};

export const translationService = {
  async translateQuestion(question: Question): Promise<Question> {
    // Check cache first
    if (translationCache[question.id]) {
      return translationCache[question.id];
    }

    // If it's already translated (not fallback English), return it
    if (question.text.bn !== question.text.en) {
      return question;
    }

    try {
      const model = "gemini-3-flash-preview";
      const response = await genAI.models.generateContent({
        model,
        contents: `Translate the following UK Driving Theory Test content into clear, accurate, and natural Bengali.

        Context: This is for the UK DVSA Driving Theory Test. Use standard driving terminology in Bengali. 
        For specific UK road terms (like 'dual carriageway', 'hard shoulder', 'zebra crossing'), use the most common and understandable Bengali equivalent, or keep the English term in brackets if the Bengali term is not commonly used in the UK Bengali community.

        Question: ${question.text.en}
        Options:
        ${question.options.map(o => `${o.id}: ${o.text.en}`).join('\n')}
        Explanation: ${question.explanation.en}`,
        config: {
          systemInstruction: "You are an expert translator specializing in the UK Highway Code and Driving Theory Test. Your goal is to translate English driving questions into Bengali that is technically accurate, easy to understand for learners, and culturally appropriate for the UK Bengali-speaking community. Avoid literal translations that lose meaning. Ensure driving-specific terms are translated correctly according to standard UK driving terminology.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The Bengali translation of the question" },
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
              explanation: { type: Type.STRING, description: "The Bengali translation of the explanation" }
            },
            required: ["text", "options", "explanation"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      
      if (!result.text) return question;

      const translatedQuestion = {
        ...question,
        text: { ...question.text, bn: result.text },
        options: question.options.map(o => ({
          ...o,
          text: { ...o.text, bn: result.options[o.id] || o.text.en }
        })),
        explanation: { ...question.explanation, bn: result.explanation }
      };

      // Store in cache
      translationCache[question.id] = translatedQuestion;
      
      return translatedQuestion;
    } catch (error) {
      console.error("Translation error:", error);
      return question;
    }
  }
};
