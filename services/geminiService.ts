import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  // Safely check for process.env to avoid runtime crashes in browser environments
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateRetroGoalDetails = async (goalInput: string) => {
  const client = getClient();
  if (!client) {
    // Fallback if no API key
    return {
      title: goalInput,
      description: "A classic broadcast of personal achievement.",
      category: "Documentary"
    };
  }

  const prompt = `
    Transform the user's personal goal: "${goalInput}" into a 1970s TV show listing.
    1. Create a catchy, retro TV show title (max 5 words).
    2. Write a short, punchy TV guide description (max 20 words) that sounds like a synopsis.
    3. Categorize it as one of: Sitcom, News, Drama, Sports, Documentary.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Sitcom', 'News', 'Drama', 'Sports', 'Documentary'] }
          },
          required: ['title', 'description', 'category']
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini generation error:", error);
    return {
      title: goalInput,
      description: "Broadcast signal interrupted. Reverting to manual override.",
      category: "News"
    };
  }
};