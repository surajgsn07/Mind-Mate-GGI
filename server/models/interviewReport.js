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
  confidence :{
    type:Number
  },
  expression:{
    type:String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
    timestamps:true
});

export const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);
