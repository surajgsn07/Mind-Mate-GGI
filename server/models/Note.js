import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
