
// File: tj-bazaar-chatbot.js
import Groq from 'groq-sdk';


export async function getGroqData(prompt) {
    try {
        const groqApiKey = process.env.GROQ_API_KEY;
        const groq = new Groq({ apiKey: groqApiKey });
        const result = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-8b-8192",
        });
        return result.choices[0]?.message?.content || "";
    } catch (error) {
        console.error('Error calling Groq AI API:', error);
        throw error;
    }
}

