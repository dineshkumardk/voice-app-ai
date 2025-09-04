import axios from "axios";

export async function summarizeText(text) {
  try {
    // Example with OpenAI API (adjust to your setup)
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Summarize the given text." },
          { role: "user", content: text },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Error in summarizeText:", error.message);
    throw error;
  }
}
