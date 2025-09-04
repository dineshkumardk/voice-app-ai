import express from "express";
import multer from "multer";
import VoiceNote from "../models/VoiceNote.js";
import { transcribeWithOpenAIBuffer } from "../services/transcribe.js"; // new function
import { summarizeText } from "../services/summarize.js";

const router = express.Router();

// Memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload & transcribe audio
router.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const audioBuffer = req.file.buffer; // get audio as buffer
    const transcript = await transcribeWithOpenAIBuffer(audioBuffer);

    const note = await VoiceNote.create({
      audioUrl: req.file.originalname, // optional
      transcript,
    });

    res.json(note);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process audio upload" });
  }
});

export default router;