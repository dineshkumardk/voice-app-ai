import express from "express";
import multer from "multer";
import VoiceNote from "../models/VoiceNote.js";
import { transcribeWithOpenAI } from "../services/transcribe.js";
import { summarizeText } from "../services/summarize.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload & transcribe audio
router.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const transcript = await transcribeWithOpenAI(filePath);
    const note = await VoiceNote.create({ audioUrl: filePath, transcript });
    res.json(note);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process audio upload" });
  }
});

// Edit transcript
router.put("/:id/transcript", async (req, res) => {
  try {
    const note = await VoiceNote.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    note.transcript = req.body.transcript;
    note.summary = "";
    note.transcriptEdited = true;
    note.summaryGeneratedAt = null;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error("Edit transcript error:", error);
    res.status(500).json({ error: "Failed to update transcript" });
  }
});

// Summarize
router.post("/summarize", async (req, res) => {
  try {
    const note = await VoiceNote.findById(req.body.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const summary = await summarizeText(note.transcript);
    note.summary = summary;
    note.summaryGeneratedAt = new Date();
    note.transcriptEdited = false;
    await note.save();

    res.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await VoiceNote.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Delete note
router.delete("/:id", async (req, res) => {
  try {
    await VoiceNote.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// ✅ Export as default for ESM
export default router;