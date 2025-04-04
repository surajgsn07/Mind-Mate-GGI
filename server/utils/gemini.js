import { GoogleGenerativeAI } from "@google/generative-ai";


// Function to analyze image using Gemini AI
export async function analyzeImage(base64Image, mimeType) {

    console.log(" : " , process.env.GEMINI_API_KEY)
    // Initialize Google Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("🔍 Analyzing image with Gemini API...");
    try {
        const result = await model.generateContent([
            `
            You are **MindMate AI**, a compassionate mental health companion. Your role is to analyze images and provide **uplifting, supportive, and non-judgmental insights** to cheer up the user. Your responses should be **empathetic, encouraging, and positive** while accurately describing the image.

### **Guidelines:**
1. **Recognize objects, people, and emotions** in the image.
2. **Highlight positive aspects** in the image to uplift the user's mood.
3. **If a person is present**, describe their likely mood based on facial expressions and posture.
4. **If the image depicts nature, pets, or art**, describe their beauty and how they might bring comfort or joy.

            `,
            { inlineData: { data: base64Image, mimeType } },
        ]);

        const response = result.response;
        const text = response.text(); // Ensure correct extraction
        console.log("✅ AI Response:", text);
        return text;
    } catch (error) {
        console.error("❌ Gemini API Error:", error);
        throw new Error("Failed to analyze image.");
    }
}

