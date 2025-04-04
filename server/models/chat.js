import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message:{
        type:String
    },
    response:{
        type:String
    },
    emotion:{
        type: String,
        enum: ['happy', 'sad', 'angry', 'neutral'] //TODO change it after watching on model
    }
}, {
    timestamps: true
});

export default  mongoose.model('Chat', chatSchema);
