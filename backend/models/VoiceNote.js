import mongoose from "mongoose";

const VoiceNoteSchema = new mongoose.Schema({
  audioUrl: String,
  transcript: String,
  summary: String,
  transcriptEdited: { type: Boolean, default: false },
  summaryGeneratedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const VoiceNote = mongoose.model("VoiceNote", VoiceNoteSchema);

export default VoiceNote;
