import { analyzeFaceService } from "./ai.service.js";

export const analyzeFace = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const result = await analyzeFaceService(image);

    res.status(200).json(result);
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      message: "Failed to analyze image",
    });
  }
};