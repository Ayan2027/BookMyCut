import express from "express";
import multer from "multer";
import imagekit from "../../config/imagekit.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname
    });

    res.json({ url: result.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
