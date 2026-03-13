import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Question } from "../data/questions";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing. Translation will not work. If you have deployed this app, make sure to set the GEMINI_API_KEY environment variable.");
      return null;
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

const CACHE_KEY = 'driving_theory_translations';

const getInitialCache = (): Record<string, Question> => {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error("Failed to load translation cache:", e);
    return {};
  }
};

const translationCache: Record<string, Question> = getInitialCache();

const saveCache = () => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(translationCache));
  } catch (e) {
    console.error("Failed to save translation cache:", e);
  }
};

export const translationService = {
  async translateQuestion(question: Question, retryCount = 0): Promise<Question> {
    // Check cache first
    if (translationCache[question.id]) {
      return translationCache[question.id];
    }

    // If it's already translated in the static data (not fallback English), return it
    if (question.text.bn && question.text.bn !== question.text.en) {
      return question;
    }

    const ai = getGenAI();
    if (!ai) return question;

    try {
      const model = "gemini-3-flash-preview";
      const response = await ai.models.generateContent({
        model,
        contents: `Translate the following UK Driving Theory Test content into clear, accurate, and natural Bengali.

        Context: This is for the UK DVSA Driving Theory Test. Use standard driving terminology in Bengali. 
        For specific UK road terms (like 'dual carriageway', 'hard shoulder', 'zebra crossing'), use the most common and understandable Bengali equivalent, or keep the English term in brackets if the Bengali term is not commonly used in the UK Bengali community.

        Question: ${question.text.en}
        Options:
        ${question.options.map(o => `${o.id}: ${o.text.en}`).join('\n')}
        Explanation: ${question.explanation.en}`,
        config: {
          systemInstruction: "You are an expert translator specializing in the UK Highway Code and Driving Theory Test. Your goal is to translate English driving questions into Bengali that is technically accurate, easy to understand for learners, and culturally appropriate for the UK Bengali-speaking community. Avoid literal translations that lose meaning. Ensure driving-specific terms are translated correctly according to standard UK driving terminology. ALWAYS return a valid JSON object matching the schema.",
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

      const text = response.text?.trim();
      if (!text) throw new Error("Empty response from Gemini");

      // Handle potential markdown code blocks in response
      const jsonStr = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      const result = JSON.parse(jsonStr);
      
      if (!result.text) throw new Error("Invalid translation result");

      const translatedQuestion = {
        ...question,
        text: { ...question.text, bn: result.text },
        options: question.options.map(o => ({
          ...o,
          text: { ...o.text, bn: result.options[o.id] || o.text.en }
        })),
        explanation: { ...question.explanation, bn: result.explanation }
      };

      // Store in cache and persist
      translationCache[question.id] = translatedQuestion;
      saveCache();
      
      return translatedQuestion;
    } catch (error) {
      console.error(`Translation error (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < 2) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.translateQuestion(question, retryCount + 1);
      }
      
      return question;
    }
  }
};
