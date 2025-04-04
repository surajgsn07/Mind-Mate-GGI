import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  date: Date,
});

export const Event = mongoose.model("Event", eventSchema);
