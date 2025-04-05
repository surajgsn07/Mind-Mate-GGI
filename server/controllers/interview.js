import asynchandler from "express-async-handler";
import { getGroqData } from "../utils/groq.js";
import {InterviewReport} from "../models/interviewReport.js"

export const getInterviewQuestion = asynchandler(async(req,res)=>{
    const {history  , content} = req.body;
    const user = req.user;

    console.log({content})
    const prompt = `
      You are a professional interviewer conducting a mock job interview. 
      Your role is to ask relevant, challenging questions based on the conversation history.
      
      if provided , ask questions from the content given : ${content}
      user info : 
      name : ${user.name}
      
      Conversation History:
      ${JSON.stringify(history, null, 2)}
      
      Guidelines:
      1. Maintain professional tone
      2. Ask one clear question at a time
      3. Follow up on previous answers
      4. Progress logically through interview stages:
         - Start with introductions/warm-up
         - Move to technical/role-specific questions
         - Include behavioral questions
         - Conclude with closing questions
      5. Adapt based on candidate responses
      6. Never repeat questions
      
      Respond ONLY with your next interview question. No explanations or commentary.
      `;

    const groqResponse = await getGroqData(prompt);


    return res.status(201).json({response  : groqResponse});
})

export const generateInterviewReport = asynchandler(async(req,res)=>{
    const {history } = req.body;

    if(history.length < 2){
      return res.status(400).json({
        messgae:"Atleast history length should be 2"
      })
    }
    

    if(!history || !Array.isArray(history) || history.length === 0){
        return res.status(400).json({message: "Invalid or empty history provided"});
    }

    const prompt = `
    Analyze the following interview conversation and provide a detailed report with the following metrics:
    1. Duration (in minutes)
    2. Number of questions asked
    3. Average response time (in seconds)
    4. Clarity (score out of 10)
    5. Fluency (score out of 10)
    6. Tone analysis (professional, casual, or mixed)
    7. Architecture understanding (score out of 10)



    Conversation History:
    ${JSON.stringify(history, null, 2)}


    Analyze the conversation carefully and provide accurate metrics based on the content and timing of responses.
    `;

    try {
        const report = await getGroqData(prompt);
        const user = req.user;

        
        
        let averageResponseTime = 0;
        let responseTimeCount = 0;
        let totalResponseTime = 0;

        // Calculate time differences between Q&A pairs
        for (let i = 1; i < history.length; i++) {
          // Only calculate between question and answer pairs
          if (history[i].speaker !== history[i-1].speaker) {
            const prevTime = new Date(history[i-1].timestamp).getTime();
            const currTime = new Date(history[i].timestamp).getTime();
            totalResponseTime += (currTime - prevTime);
            responseTimeCount++;
          }
        }

        // Avoid division by zero
        averageResponseTime = responseTimeCount > 0 
          ? (totalResponseTime / responseTimeCount) / 1000  // Convert to seconds
          : 0;

        // Calculate total interview duration (in seconds)
        const duration = history.length > 0
          ? (new Date(history[history.length - 1].timestamp).getTime() - 
            new Date(history[0].timestamp).getTime()) / 1000  // Convert to seconds
          : 0;

          
          const map = new Map();
          for(let i=0;i<history.length;i++){
              const expression = history[i]?.expression || "";
              if(map.has(expression)){
                map.set(expression, map.get(expression) + 1);
              }else{
                map.set(expression, 1);
              }
          }

        let maxOccurrence = 0;
        let maxExpression = '';
        for (const [expression, count] of map) {
            if (count > maxOccurrence && expression !== '') {
                maxOccurrence = count;
                maxExpression = expression;
            }
        }
        let totalConfidence = 0;
        let confidenceOcc = 0;
        for (let i = 0; i < history.length; i++) {
          if (history[i].confidence && !isNaN(history[i].confidence)) {
            totalConfidence += parseFloat(history[i].confidence);
            confidenceOcc++;
          }
        }

        totalConfidence = totalConfidence/confidenceOcc;
        

        const interviewAnalysis = new InterviewReport({ user : user._id , questionsAsked:history.length , averageResponseTime : averageResponseTime , duration : duration , expression: maxExpression , confidence : totalConfidence});

        await interviewAnalysis.save();
        
        return res.status(200).json({report : interviewAnalysis});
    } catch (error) {
        console.error("Error generating report:", error);
        return res.status(500).json({
            success: false,
            message: "Error generating interview report"
        });
    }
});


function extractInterviewMetrics(reportText) {
    const metrics = {};
  
    // Match clarity score
    const clarityMatch = reportText.match(/Clarity.*?(\d+)\s*\/?\s*10?/i);
    if (clarityMatch) {
      metrics.clarity = parseInt(clarityMatch[1]);
    }
  
    // Match fluency score
    const fluencyMatch = reportText.match(/Fluency.*?(\d+)\s*\/?\s*10?/i);
    if (fluencyMatch) {
      metrics.fluency = parseInt(fluencyMatch[1]);
    }
  
    // Match tone analysis
    const toneMatch = reportText.match(/Tone analysis.*?:?\s*(\w+)/i);
    if (toneMatch) {
      metrics.toneAnalysis = toneMatch[1];
    }
    
  
    return metrics;
  }
  