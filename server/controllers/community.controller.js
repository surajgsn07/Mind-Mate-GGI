import asyncHandler from "express-async-handler";
import Community from "../models/community.js";

const createCommunity = asyncHandler(async (req, res) => {
  const { name, description, category, privacy, isGroupChat } = req.body;

  if (!name || !description || !category) {
    res.status(400);
    throw new Error("Please provide name, description, and category");
  }

  const community = await Community.create({
    name,
    description,
    category,
    privacy: privacy || "public",
    creator: req.user._id,
    members: [req.user._id],
    isGroupChat: isGroupChat || false,
  });

  res.status(201).json({
    success: true,
    data: community,
    message: "Community created successfully",
  });
});

export const joinCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
 
  if (!community) {
    res.status(404);
    throw new Error("Community not found");
  }

  if (community.members.includes(req.user._id)) {
    res.status(400);
    throw new Error("You are already a member of this community");
  }

  community.members.push(req.user._id);
  await community.save();

  res.status(200).json({
    success: true,
    data: community,
    message: "Joined community successfully",
  });
});

const deleteCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);

  if (!community) {
    res.status(404);
    throw new Error("Community not found");
  }

  if (community.creator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this community");
  }

  await community.deleteOne();

  res.status(200).json({
    success: true,
    data: null,
    message: "Community deleted successfully",
  });
});

const getAllCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find({})
    .populate("creator", "name email avatar")
    .populate("members", "name email avatar")
    .populate("latestMessage")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: communities.length,
    data: communities,
  });
});

const getCommunityById = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)
    .populate("creator", "name email avatar")
    .populate("members", "name email avatar")
    .populate("latestMessage");

  if (!community) {
    res.status(404);
    throw new Error("Community not found");
  }

  // Check if private community and user is not a member
  if (
    community.privacy === "private" &&
    !community.members.some(
      (member) => member._id.toString() === req.user?._id.toString()
    )
  ) {
    res.status(403);
    throw new Error("Not authorized to access this community");
  }

  res.status(200).json({
    success: true,
    data: community,
  });
});

// @desc    Get all communities for a specific user
// @route   GET /api/communities/user/:userId
// @access  Private
const getUserCommunities = asyncHandler(async (req, res) => {
  // Allow users to get their own communities or admins to view any user's communities
 const userId = req.user._id;
// console.log(userId)
  const communities = await Community.find({
    members: { $in: [userId] },
  })
    .populate("creator", "name email avatar")
    .populate("members", "name email avatar")
    .populate("latestMessage")
    .sort("-createdAt");

    console.log(communities)
  res.status(200).json({
    success: true,
    count: communities.length,
    data: communities,
  });
});


 


export {
  createCommunity,
  deleteCommunity,
  getAllCommunities,
  getCommunityById,
  getUserCommunities,
};
