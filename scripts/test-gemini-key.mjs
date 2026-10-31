import { GoogleGenerativeAI } from "@google/generative-ai";

async function testKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  console.log("Testing model:", modelName);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Respond with the single word: OK");
    console.log("SUCCESS! Model response:", result.response.text());
  } catch (err) {
    console.error("API call failed with error:");
    console.error(err.message || err);
  }
}

testKey();
