import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : {};
};

export const analyzeFaceService = async (imageBase64) => {
  try {
    // FIX 1: Use 'gemini-1.5-flash-latest' or just 'gemini-1.5-flash'
    // Some regions/keys prefer the explicit 'latest' tag
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Data = imageBase64.includes(",") 
      ? imageBase64.split(",")[1] 
      : imageBase64;

    const prompt = `
      Analyze this face image. 
      Return ONLY JSON:
      {
        "faceShape": "",
        "hairstyles": [
          { "name": "", "description": "" }
        ]
      }
      Rules: Give exactly 4 hairstyles, keep descriptions short, no extra text.
    `;

    // FIX 2: Explicitly pass the parts as an array
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    return extractJSON(response.text());
  } catch (err) {
    // Log the specific error to see if it's a model issue or an API Key issue
    console.error("Internal SDK Error:", err);
    throw err;
  }
};