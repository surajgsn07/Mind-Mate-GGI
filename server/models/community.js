import { mongoose, model } from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Community name is required"],
      trim: true,
      maxlength: [100, "Community name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["academic", "professional", "technology", "language", "other"],
        message: "Please select a valid category",
      },
    },
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
 
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId, //to display at front
      ref: "Message",
    },
    
    imageUrl: {
      type: String,
      default: "https://cdn-icons-png.freepik.com/512/1057/1057089.png",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

communitySchema.index({ name: "text", description: "text" });
communitySchema.index({ category: 1 });
communitySchema.index({ privacy: 1 });

communitySchema.virtual("memberCount").get(function () {
  return this.members?.length || 0;
});

communitySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Community = model("Community", communitySchema);

export default Community;
