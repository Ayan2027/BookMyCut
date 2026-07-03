import { GoogleGenAI } from "@google/genai";
import UserProfile from "../users/user.model.js";
import { env } from "../../config/env.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const PROMPT = `You are a professional hairstylist and image analyst.
Look at the uploaded photo of a person's face and:
1. Identify their face shape (Oval, Round, Square, Heart, Diamond, Oblong, Triangle).
2. Recommend exactly 3 hairstyles that suit this face shape best.
3. For each, give a 1-2 sentence description of why it works.

Respond ONLY in this strict JSON format, no markdown, no extra text:
{
  "faceShape": "string",
  "hairstyles": [
    { "name": "string", "description": "string" },
    { "name": "string", "description": "string" },
    { "name": "string", "description": "string" }
  ]
}`;

export const analyzeFace = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: PROMPT },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image
              }
            }
          ]
        }
      ]
    });

    const cleaned = response.text.trim().replace(/```json|```/g, "").trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ message: "AI returned an unexpected format. Please try again." });
    }

    await UserProfile.findOneAndUpdate(
      { account: req.user._id },
      {
        faceShape: result.faceShape,
        hairstyleRecommendation: result.hairstyles,
        hairstyleRecommendedAt: new Date()
      },
      { upsert: true }
    );

    res.json(result);
  } catch (err) {
    console.error("AI analyze error:", err);
    res.status(500).json({ message: "Failed to analyze image" });
  }
};

export const getLatest = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ account: req.user._id });
    if (!profile || !profile.hairstyleRecommendation?.length) {
      return res.json(null);
    }
    res.json({
      faceShape: profile.faceShape,
      hairstyles: profile.hairstyleRecommendation,
      recommendedAt: profile.hairstyleRecommendedAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};