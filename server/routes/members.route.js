import { Router } from "express";
import { addMembers, getMembers, removeMember, updateMember } from "../controllers/members.js";

const membersRouter = Router();

membersRouter.post("/add", addMembers);
membersRouter.delete("/remove", removeMember);
membersRouter.put("/update", updateMember);
membersRouter.get("/get", getMembers);

export default membersRouter;
