import axios from "axios";
import fs from "fs";

export async function transcribeWithOpenAI(filePath) {
  const file = fs.createReadStream(filePath);

  const response = await axios.post(
    "https://api.openai.com/v1/audio/transcriptions",
    file,
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "audio/webm",
      },
    }
  );

  return response.data.text;
}