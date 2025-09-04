import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js"; 
import { fileURLToPath } from "url";

// Load .env variables
dotenv.config();
console.log("server.js")
// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB (options object no longer needed in Mongoose v7+)
mongoose
  .connect(process.env.MONGODB_URL || "mongodb://localhost:27017/voicenotes")
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// Routes
app.use("/api/notes", notesRouter);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root
app.get("/", (req, res) => {
  res.send("Voice Notes API running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});