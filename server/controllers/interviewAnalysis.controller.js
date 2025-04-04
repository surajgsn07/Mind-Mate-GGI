import asynchandler from "express-async-handler";
import {InterviewReport} from "../models/interviewReport.js";

export const createInterviewAnalysis = asynchandler(async(req,res)=>{
    const {duration, questionsAsked, averageResponseTime, clarity, fluency, toneAnalysis, architectureUnderstanding} = req.body;

    const newInterviewAnalysis = new InterviewReport({
        duration,
        questionsAsked,
        averageResponseTime,
        clarity,
        fluency,
        toneAnalysis,
        architectureUnderstanding
    });

    const savedInterviewAnalysis = await newInterviewAnalysis.save();

    return res.status(201).json(savedInterviewAnalysis);
});

export const getInterviewAnalysis = asynchandler(async(req,res)=>{
    
    const userId = req.user._id;
    const interviewAnalysis = await InterviewReport.find({user : userId}).sort({createdAt : -1});

    return res.status(200).json(interviewAnalysis);
});

export const updateInterviewAnalysis = asynchandler(async(req,res)=>{
    const {id} = req.params;
    const {duration, questionsAsked, averageResponseTime, clarity, fluency, toneAnalysis, architectureUnderstanding} = req.body;

    const updatedInterviewAnalysis = await InterviewReport.findByIdAndUpdate(id, {
        duration,
        questionsAsked,
        averageResponseTime,
        clarity,
        fluency,
        toneAnalysis,
        architectureUnderstanding
    }, {new: true});

    return res.status(200).json(updatedInterviewAnalysis);
});

export const deleteInterviewAnalysis = asynchandler(async(req,res)=>{
    const {id} = req.params;

    await InterviewReport.findByIdAndDelete(id);

    return res.status(200).json({message: "Interview Analysis deleted successfully"});
});
