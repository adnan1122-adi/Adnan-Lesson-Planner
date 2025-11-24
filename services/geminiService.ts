import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserMetadata, LessonPlanResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `
You are an advanced AI Lesson Plan Generator designed specifically for Mathematics education.
Your job is to read the uploaded PDF lesson plan, extract important information, use teacher inputs, and generate an enhanced, complete, structured lesson plan.

You must:
1. Support math equations (LaTeX-friendly).
2. Generate differentiated daily plans for each selected day.
3. Improve clarity, rigor, differentiation, and alignment with CCSS.
4. Output purely JSON based on the provided schema.

Logic for Differentiation:
- High Achievers: Enrichment, non-routine problems, algebraic thinking.
- Average Students: Standard practice, step-by-step structured tasks.
- Struggling Students: Scaffolding, visuals, worked examples.

Tone:
Professional, academic, rigorous math teaching, student-centered.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    generalInfo: {
      type: Type.OBJECT,
      properties: {
        focusSkill: { type: Type.STRING },
        ccssAlignment: { type: Type.STRING },
        assessmentPlanned: { type: Type.STRING },
        learningIntention: { type: Type.STRING },
        successCriteria: { type: Type.STRING },
        materials: { type: Type.STRING },
        prerequisites: { type: Type.STRING },
      },
      required: ["focusSkill", "ccssAlignment", "assessmentPlanned", "learningIntention", "successCriteria", "materials", "prerequisites"]
    },
    dailyPlans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          intro: {
            type: Type.OBJECT,
            properties: {
              warmUp: { type: Type.STRING },
              review: { type: Type.STRING },
              vocabulary: { type: Type.STRING },
              starter: { type: Type.STRING },
            },
            required: ["warmUp", "review", "vocabulary", "starter"]
          },
          presentation: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              modeling: { type: Type.STRING },
              examples: { type: Type.STRING },
              checkUnderstanding: { type: Type.STRING },
            },
            required: ["explanation", "modeling", "examples", "checkUnderstanding"]
          },
          guidedPractice: {
            type: Type.OBJECT,
            properties: {
              groupStructure: { type: Type.STRING },
              tasks: { type: Type.STRING },
            },
            required: ["groupStructure", "tasks"]
          },
          independentPractice: {
            type: Type.OBJECT,
            properties: {
              tasks: { type: Type.STRING },
              equations: { type: Type.STRING },
            },
            required: ["tasks", "equations"]
          },
          closure: {
            type: Type.OBJECT,
            properties: {
              selfAssessment: { type: Type.STRING },
              summary: { type: Type.STRING },
              exitTicket: { type: Type.STRING },
            },
            required: ["selfAssessment", "summary", "exitTicket"]
          },
          differentiation: {
            type: Type.OBJECT,
            properties: {
              strategies: { type: Type.ARRAY, items: { type: Type.STRING } },
              highAchievers: { type: Type.STRING },
              averageStudents: { type: Type.STRING },
              strugglingStudents: { type: Type.STRING },
            },
            required: ["strategies", "highAchievers", "averageStudents", "strugglingStudents"]
          },
          homework: {
            type: Type.OBJECT,
            properties: {
              support: { type: Type.STRING },
              core: { type: Type.STRING },
              challenge: { type: Type.STRING },
            },
            required: ["support", "core", "challenge"]
          },
        },
        required: ["day", "intro", "presentation", "guidedPractice", "independentPractice", "closure", "differentiation", "homework"]
      }
    }
  },
  required: ["generalInfo", "dailyPlans"]
};

// Helper to convert File to Base64
const fileToPart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        // Remove "data:application/pdf;base64," prefix
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateLessonPlan = async (metadata: UserMetadata, pdfFile: File): Promise<LessonPlanResponse> => {
  try {
    const pdfBase64 = await fileToPart(pdfFile);

    const prompt = `
      METADATA INPUTS:
      ${JSON.stringify(metadata, null, 2)}

      Please process the attached PDF and the metadata above to create a detailed Math Lesson Plan following the defined system instructions.
      Ensure strict adherence to the output JSON schema. Use LaTeX for all mathematical expressions (e.g., $x^2 + 2x$).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as LessonPlanResponse;
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw error;
  }
};