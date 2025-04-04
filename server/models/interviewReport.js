import mongoose from "mongoose";

const interviewReportSchema = new mongoose.Schema({
  duration: {
    type: Number
  },
  questionsAsked: {
    type: Number
  },
  averageResponseTime: {
    type: Number
  },
  clarity: {
    type: Number
  },
  fluency: {
    type: Number
  },
  toneAnalysis: {
    type: String,
  },
  architectureUnderstanding: {
    type: Number}
,  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
    timestamps:true
});

export const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);
