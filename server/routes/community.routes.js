import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.js";
import {
  createCommunity,
  deleteCommunity,
  getAllCommunities,
  getCommunityById,
  getUserCommunities,
  joinCommunity
} from "../controllers/community.controller.js";
import { fetchMessages, sendMessage } from "../controllers/message.controller.js";

const communityRouter = Router();

communityRouter.post("/new", verifyAuth, createCommunity);
communityRouter.post("/get/:communityId", verifyAuth, getCommunityById);
communityRouter.put("/join/:id", verifyAuth, joinCommunity);
communityRouter.get("/user", verifyAuth, getUserCommunities);
communityRouter.get("/", getAllCommunities);
communityRouter.get("/messages/:communityId",verifyAuth, fetchMessages);
communityRouter.post("/message",verifyAuth, sendMessage);
communityRouter.delete("/:id", verifyAuth, deleteCommunity);

export default communityRouter;
