import { analyzeImage } from "../utils/gemini.js";
import { getGroqData } from "../utils/groq.js";
import Chat from "../models/chat.js";
import ChatAnalysis from "../models/analysis.js";
import { sendSMS } from "./sos.js";
import sendMail from "../helpers/mail.helper.js";
import Note from '../models/Note.js'; // adjust path if needed


const extractJSON = (text) => {
    const responseMatch = text.match(/Response:\s*(.+)/i);
    const emotionMatch = text.match(/Emotion:\s*(\w+)/i);

    return {
        response: responseMatch ? responseMatch[1].trim() : "Unknown",
        emotion: emotionMatch ? emotionMatch[1].trim().toLowerCase() : "neutral"
    };
};

const detectSOS = (response , message) => {
    return response.toLowerCase().includes("self-harm") || response.toLowerCase().includes("suicide") || response.toLowerCase().includes('emergency') || message.toLowerCase().includes('suicide');
};

  

export const chat = async(req,res)=>{
    try {
        const {message} = req.body;

        console.log({message})
        const id = req.user._id;
        const chats = await Chat.find({ sender: id })
        .select('message response emotion createdAt')
        .sort({ createdAt: -1 })
        .limit(0);

        const prompt = 
        `You are **MindMate AI**, a compassionate study companion. Your role is to provide **empathetic, supportive, and non-judgmental** responses, always prioritizing the user's well-being. Take into account the user's history to offer **personalized guidance**. Respond with **warmth, understanding, and encouragement**, keeping messages **concise yet meaningful**.
        **User message:** "${message}"
        **User details:** "name : ${req.user.name}" , "dob : ${req.user.dob}"
        **char history : ** "${chats}"
        
        Your response must be in the following format:
        Response: Your supportive response to the user
        Emotion: One of [happy, sad, angry, neutral, disgust, fear]

        Do not include any extra text, explanations, or formatting outside this format.`
        ;



        const groqResponse   = await getGroqData(prompt);
        console.log({groqResponse})
        const isSOS = detectSOS(groqResponse , message);
        if(isSOS){
            const message=`const message = "URGENT: ${req.user.name} might be in distress and needs support. Please check on them as soon as possible. Let them know they are not alone and encourage them to seek help. **sos**";
            `;
            await sendMail("URGENT : Friend in distress" , "iamaniketgupta1245@gmail.com" , "URGENT: ${req.user.name} might be in distress and needs support. Please check on them as soon as possible. Let them know they are not alone and encourage them to seek help. **sos**");

            const numbers =[
                "+918264475198",
                "+917717604056"
            ]
            const sos = await sendSMS(message,numbers);
            return res.status(200).json({response : "sos"});
        }
        const {emotion , response} = extractJSON(groqResponse);

        const chat = await Chat.create({
            sender : id,
            message,
            response,
            emotion
        })

        return res.json({chat , response });
    } catch (error) {
        console.log({error})
        return res.status(500).json({message:"Internal server error"});
    }

}

export const chatSummarize = async (req, res) => {
    try {
      const { prompt } = req.body;
  
      if (!prompt || prompt.trim() === '') {
        return res.status(400).json({ message: 'No input text provided to summarize.' });
      }
  
      const wrappedPrompt = `
      You are MinMate AI, a helpful assistant that converts study content into clear notes.
      
      Your response format **must strictly** follow this:
      
      - First line: "Title: <relevant topic of the input>" (strictly on the first line only)
      - Next lines: Bullet-point summary using only hyphens (-)
      - Do not write any intro or outro
      - Do not use markdown or asterisks (*)
      - Do not repeat sentences from input directly
      - Use clear, concise, beginner-friendly language
      
      Important:
      - The title must **accurately reflect the main topic** of the content.
      - Never say things like "Here is the summary..." or similar lines.
      - Only respond with the title line and the summary points.
      
      Input content:
      ${prompt}
      
      Now respond ONLY with the formatted summary as per the above rules:
      `;
      

  
      const summaryResponse = await getGroqData(wrappedPrompt);
  
      // Fallback raw trimming
      const raw = summaryResponse?.trim();
  
      // RegEx to extract the title (first non-empty line)
      const titleMatch = raw.match(/^\s*([^\n\r]+)\s*[\n\r]/);
      const title = titleMatch ? titleMatch[1].trim() : null;
  
      // Extract everything after the first line as the summary
      const summaryMatch = raw.match(/^[^\n\r]+\s*[\n\r]+([\s\S]+)/);
      const summary = summaryMatch ? summaryMatch[1].trim() : null;
  
      if (!title || !summary) {
        return res.status(500).json({ message: "Failed to extract title or summary using RegEx." });
      }
  
      // Save to MongoDB
      const newNote = new Note({
        user_id: req.user._id,
        title,
        summary
      });
  
      await newNote.save();
  
      return res.status(200).json({
        status: true,
        title,
        summary,
        message: 'Summary generated and saved successfully.'
      });
  
    } catch (error) {
      console.error("Error in chatSummarize:", error);
      return res.status(500).json({ message: "Failed to generate summary." });
    }
};

export const chatNotes=async(req,res)=>{
  const user_id=req.user._id;
  const notes=await Note.find({user_id}).sort({createdAt:-1});
  return res.status(200).json({status:true,notes});
};



// Function to encode image buffer to Base64
function encodeImageToBase64(buffer) {
    return buffer.toString("base64");
}

export const chatWithImg = async(req,res)=>{
    try {
        const {message  } = req.body;
        const id = req.user._id;
        // ✅ Correct:
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const base64Img = encodeImageToBase64(req.file.buffer); // req.file.buffer for memory storage
        const mimeType = req.file.mimetype;
        const imgResponse = await analyzeImage(base64Img , mimeType);

        
        const chats = await Chat.find({ sender: id })
        .select('message response emotion createdAt')
        .sort({ createdAt: -1 })
        .limit(4);

        const prompt = `
        You are MindMate AI, a compassionate study companion. Your role is to provide empathetic, supportive, and non-judgmental responses, always prioritizing the user's well-being. Take into account the user's history to offer personalized guidance. Respond with warmth, understanding, and encouragement, keeping your messages concise yet meaningful.
        Previous chat history: ${chats}
        
        User message: ${message}
        image summary:${imgResponse}

        
        Your response must be in the following format:
        Response: Your supportive response to the user  
        Emotion: One of [happy, sad, angry, neutral, disgust, fear]

        Do not include any extra text, explanations, or formatting outside this format.
        `

        

        const groqResponse   = await getGroqData(prompt);

        const {emotion , response} = extractJSON(groqResponse);

        const chat = await Chat.create({
            sender : id,
            message : message + " " + imgResponse,
            response,
            emotion
        })

        return res.json({ response , chat});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error" , error});
    }
}


export const chatWithVoice  = async(req,res)=>{
    try {
        const {emotion , message} = req.body;
        const prompt = `
        Your are mindmate AI bot . You are a study companion bot. Your goal is to provide empathetic and supportive responses to users. Please respond in a way that is non-judgmental, understanding, and encouraging. Keep your responses concise and focused on the user's well-being.
        user message:${message}
        Tone of user emotion:${emotion}
        `

        const response = await getGroqData(prompt);

        return res.json({output : response});

    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}


export const chatAnalysis = async (req, res) => {
    try {
        const userId = req.user._id; // Replace with dynamic user ID handling
        
        // Fetch chat data for the user
        const chats = await Chat.find({ sender: userId })
        .select('message response emotion createdAt')
        .sort({ createdAt: -1 })
        .limit(10);
        if (!chats.length) {
            return res.status(404).json({ message: "No chats found for this user." });
        }

        // Format chat data for AI analysis
        const formattedChats = chats.map(chat => ({
            userMessage: chat.message,
            botResponse: chat.response,
            emotion: chat.emotion,
            timestamp: chat.createdAt
        }));

        // Construct AI prompt
        const prompt = `
        You are an AI chat analysis tool. Your task is to analyze the following conversation history between a user and a bot to extract meaningful insights.

        Respond in pure JSON format without any additional text:

        Conversation Data:
        ${JSON.stringify(formattedChats)}

        Analyze the chat and return a *strictly JSON response* in the following format:

        {
            "totalMessages": "Total number of messages exchanged (Number)",
            "userMessages": "Number of messages sent by the user (Number)",
            "botMessages": "Number of responses given by the bot (Number)",
            "dominantEmotions": ["List of dominant emotions expressed by the user from ['happy', 'sad', 'angry', 'neutral', 'disgust', 'fear'] (Array of Strings)"],
            "conversationSummary": "A detailed yet concise summary of the overall conversation (String)",
            "recurringTopics": ["List of frequently discussed topics (Array of Strings)"],
            "sentimentTrend": "Overall sentiment trend of the conversation from ['happy', 'sad', 'angry', 'neutral', 'disgust', 'fear'] (String)",
            "engagementLevel": "Level of engagement from ['high', 'moderate', 'low'], based on response frequency, length, and depth (String) . Long ",
            "emotionalShifts": "A JSON object representing the timeline of emotional shifts detected throughout the conversation (String or JSON)",
            "botResponseAnalysis": {
                "effectiveness": "How well the bot responded (e.g., empathetic, neutral, repetitive, insightful) (String)",
                "missedOpportunities": "Any instances where the bot could have provided better responses (String)"
            },
            "solution": "A good and professional suggested solution to address the user's concerns according to his issues you got from his chat",
            "userEngagementScore": "A numerical score (1-10) representing how actively the user engaged with the bot (Number)",
            "keywordAnalysis": {
                "mostFrequentWords": ["Top words frequently used by the user (Array of Strings)"],
                "positiveWordsCount": "Number of positive words used (Number)",
                "negativeWordsCount": "Number of negative words used (Number)"
            }
        }

        Ensure that the response is *valid JSON* and contains no additional text.
        `;

        // Fetch AI-generated analysis
        const groqResponse = await getGroqData(prompt);

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(groqResponse);
        } catch (error) {
            return res.status(500).json({ message: "Failed to parse AI response", error });
        }

        // Store analysis result in the database
        const chatAnalysis = await ChatAnalysis.create({
            userId,
            ...parsedResponse
        });

        return res.json({ parsedResponse, chatAnalysis });
        
    } catch (error) {
        console.error("Chat Analysis Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getChats =async(req,res)=>{
    try {
        const userId = req.user._id; 
        const chats = await Chat.find({ sender: userId }).select('message response emotion createdAt');
        return res.json({chats});
    } catch (error) {
        return res.status(500).json({message : "Internal server error"});
    }
}

export const getReports = async(req,res)=>{
    try {
        const userId = req.user._id; 
        const reports = await ChatAnalysis.find({ userId }).sort({ createdAt: -1 });
        return res.json({reports});
    } catch (error) {
        return res.status(500).json({message : "Internal server error"});
    }
}

