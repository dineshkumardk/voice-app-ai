import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeWithOpenAIBuffer(audioBuffer) {
  try {
    const response = await openai.audio.transcriptions.create({
      file: audioBuffer,
      model: "whisper-1",
    });

    return response.text;
  } catch (err) {
    console.error("❌ Transcription failed:", err.response?.data || err.message);
    throw err;
  }
}