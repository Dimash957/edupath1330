
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentResult, Message, MediationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const mentorChat = async (history: Message[], userInput: string): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: userInput }] });

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: "You are EduPath AI, a world-class career mentor and university admissions expert. You help high school students choose professions, resolve conflicts with parents about career choices, and plan university admissions. Be encouraging, precise, and professional. Always provide actionable next steps.",
    }
  });

  return response.text || "I'm sorry, I couldn't process that. Let's try again.";
};

// Added generateCareerRecommendations for CareerQuiz.tsx
export const generateCareerRecommendations = async (interests: string, skills: string): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: `Recommend career paths based on these interests: "${interests}" and skills: "${skills}". Provide brief explanations for each.`,
    config: {
      systemInstruction: "You are a professional career advisor. Provide helpful and detailed career path suggestions based on the user's profile.",
    }
  });
  return response.text || "I was unable to generate recommendations at this time.";
};

// Added resolveFamilyConflict for FamilyMediator.tsx
export const resolveFamilyConflict = async (studentView: string, parentView: string): Promise<MediationResult> => {
  // Use gemini-3-pro-preview for the complex reasoning required for mediation tasks
  const model = 'gemini-3-pro-preview';
  const prompt = `
    Conduct a mediation between a student and their parents regarding career choice.
    
    Student's Dream: ${studentView}
    Parents' Expectations: ${parentView}
    
    Task:
    1. Propose an "Ideal Career" that is a modern compromise (e.g., Computational Bio if they want Art vs Medicine).
    2. Explain why both parties should love it.
    3. Provide a brief explanation of the compromise.
    4. Suggest 3 top universities for this specific path.
    
    Output strictly as JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          idealCareer: { type: Type.STRING },
          whyStudentLovesIt: { type: Type.STRING },
          whyParentApproves: { type: Type.STRING },
          compromiseExplanation: { type: Type.STRING },
          suggestedUniversities: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["idealCareer", "whyStudentLovesIt", "whyParentApproves", "compromiseExplanation", "suggestedUniversities"]
      }
    }
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse mediation result", error);
    throw new Error("Mediation analysis failed. Please check your inputs and try again.");
  }
};

export const analyzeFullAssessment = async (studentData: any, parentData: any): Promise<AssessmentResult> => {
  // Upgrading to gemini-3-pro-preview for the complex reasoning involved in the full career assessment
  const model = 'gemini-3-pro-preview';
  const prompt = `
    Conduct a professional career mediation between a student and their parents.
    
    Student Profile (Qualities & Strengths):
    ${JSON.stringify(studentData)}
    
    Parent Profile (Expectations & Desired Jobs):
    ${JSON.stringify(parentData)}
    
    Task:
    1. Identify a "Unified Career Path" (The primary intersection).
    2. Provide 5-10 "Career Scenarios" (Alternative paths that still satisfy both parties).
    3. Recommend a specific "Major".
    4. Define academic targets (SAT, IELTS, GPA).
    5. List skills and summer programs.
    6. Infer "locationPreference".
    
    Output strictly as JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          unifiedCareer: { type: Type.STRING },
          recommendedMajor: { type: Type.STRING },
          rationale: { type: Type.STRING },
          scenarios: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                whyMatch: { type: Type.STRING },
                marketDemand: { type: Type.STRING, enum: ['High', 'Very High', 'Emerging'] }
              },
              required: ["title", "description", "whyMatch", "marketDemand"]
            }
          },
          academicTargets: {
            type: Type.OBJECT,
            properties: {
              sat: { type: Type.NUMBER },
              ielts: { type: Type.NUMBER },
              gpa: { type: Type.STRING }
            },
            required: ["sat", "ielts", "gpa"]
          },
          skillsToImprove: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          summerPrograms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "description"]
            }
          },
          suggestedUniversities: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          locationPreference: { type: Type.STRING }
        },
        required: ["unifiedCareer", "recommendedMajor", "rationale", "scenarios", "academicTargets", "skillsToImprove", "summerPrograms", "suggestedUniversities", "locationPreference"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
