import mongoose from "mongoose";


const ChatAnalysisSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  },
    totalMessages: { type: Number,  },
    userMessages: { type: Number,  },
    botMessages: { type: Number,  },
    dominantEmotions: [{ type: String, enum: ['happy', 'sad', 'angry', 'neutral', 'disgust', 'fear'],  }],
    conversationSummary: { type: String,  },
    recurringTopics: [{ type: String }],
    sentimentTrend: { type: String },
    engagementLevel: { type: String, enum: ['high', 'moderate', 'low'],  },
    emotionalShifts: [{  // Change this from String to an array of objects
        timestamp: Date,
        emotion: String
    }],  // Can be JSON for timeline-based shifts
    botResponseAnalysis: {
        effectiveness: { type: String }, // e.g., "empathetic", "neutral"
        missedOpportunities: { type: String }
    },
    userEngagementScore: { type: Number, min: 1, max: 10,  },
    keywordAnalysis: {
        mostFrequentWords: [{ type: String }],
        positiveWordsCount: { type: Number },
        negativeWordsCount: { type: Number }
    },
    solution:{type : String},
    createdAt: { type: Date, default: Date.now }
});

const ChatAnalysis = mongoose.model('ChatAnalysis', ChatAnalysisSchema);
export default ChatAnalysis;