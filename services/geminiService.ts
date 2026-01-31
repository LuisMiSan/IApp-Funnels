import { GoogleGenAI, Type } from "@google/genai";
import { FunnelInput, GeneratedFunnel, AdminSettings, DEFAULT_ADMIN_SETTINGS } from "../types";

// SEGURIDAD: Nunca escribir claves API directamente en el código.
const apiKey = process.env.API_KEY;

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const generateFunnel = async (
  input: FunnelInput, 
  settings: AdminSettings = DEFAULT_ADMIN_SETTINGS
): Promise<GeneratedFunnel> => {
  // Validación estricta de seguridad
  if (!apiKey) {
    throw new Error("MISSING_API_KEY_SECURITY_WARNING");
  }

  const prompt = `
    ${settings.basePromptTemplate}
    
    Product Name: ${input.productName}
    Target Audience: ${input.targetAudience}
    Main Pain Points: ${input.painPoints}
    Key Benefits: ${input.benefits}
    Tone of Voice: ${input.tone}
    Language: ${input.language === 'es' ? 'Spanish (Español)' : 'English'}

    Generate the content in strict JSON format tailored for high conversion.
    Include:
    1. A Landing Page structure (Hero section, features, etc).
    2. A sequence of 3 emails (Welcome, Nurture, Sales).
    3. 2 Ad variants (Facebook/Instagram).
    4. A brief strategy summary.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: settings.systemInstruction, // Uses admin setting
      temperature: settings.modelTemperature, // Uses admin setting
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strategySummary: { type: Type.STRING, description: "A brief paragraph explaining the funnel strategy." },
          landingPage: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              subheadline: { type: Type.STRING },
              heroButton: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              testimonials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Invent 2 realistic testimonials based on the persona." },
              cta: { type: Type.STRING }
            },
            required: ["headline", "subheadline", "heroButton", "features", "testimonials", "cta"]
          },
          emails: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["welcome", "nurture", "sales"] },
                subject: { type: Type.STRING },
                body: { type: Type.STRING, description: "The email body content. Use <br> for line breaks if needed." }
              },
              required: ["type", "subject", "body"]
            }
          },
          ads: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                primaryText: { type: Type.STRING },
                headline: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["platform", "primaryText", "headline", "description"]
            }
          }
        },
        required: ["strategySummary", "landingPage", "emails", "ads"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    const data = JSON.parse(text) as GeneratedFunnel;
    // Add metadata
    data.createdAt = new Date().toISOString();
    data.id = crypto.randomUUID();
    data.input = input;
    return data;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse AI response");
  }
};