const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function generateFoodzoneDescription(prompt) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    let priceCategory;
    if (prompt.avgPrice <= 200) {
        priceCategory = "Budget-friendly";
    } else if (prompt.avgPrice > 200 && prompt.avgPrice <= 500) {
        priceCategory = "Mid-range";
    } else {
        priceCategory = "Premium";
    }

    const fullPrompt = `Generate a professional review-style description (max 45 words).
Inputs:
Name: ${prompt.name}
Avg. Price: ${prompt.avgPrice} INR — "${priceCategory}" range
Location: ${prompt.location}
User Description: ${prompt.description}
Rules:
If ${prompt.description} is detailed or relevant (mentions taste, uniqueness, specialties), rephrase it in a restaurant review tone.
If it's vague or irrelevant (e.g., "abc", "test"), ignore it and instead:
a. Write a 1-liner using priceCategory + location 'only'. Donot add any guessed data without proof.
b. Add (auto-generated content) at the end and keep it professional`;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
}


module.exports = { generateFoodzoneDescription };
