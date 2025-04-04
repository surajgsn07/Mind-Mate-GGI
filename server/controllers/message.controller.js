import expressAsyncHandler from "express-async-handler";
import Community from "../models/community.js";
import Message from "../models/communityChatMessage.js";

export const sendMessage = expressAsyncHandler(async (req, res) => {
  const { communityId, content } = req.body;

  if (!communityId) {
    return res.status(400).json({ message: "Invalid Community ID" });
  }

  let media = null;

  const newMessage = {
    sender: req.user._id,
    content: content || "",
    chat: communityId,
    media: media ? media : undefined,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name email");
    message = await message.populate({
      path: "chat",
      model: "Community",
      populate: {
        path: "members",
        select: "_id name email",
      },
    });

 

    await Community.findByIdAndUpdate(communityId, {
      latestMessage: message,
    });

    res.status(200).json({ message });
  } catch (error) {
    console.log("Database error:", error);
    res.status(500).json({ message: "Internal error while sending message" });
  }
});

export const fetchMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.communityId }) 
      .populate("sender", "name email")
      .populate({
        path: "chat",
        model: "Community",  
      });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Internal Error while fetching messages" });
  }
});
