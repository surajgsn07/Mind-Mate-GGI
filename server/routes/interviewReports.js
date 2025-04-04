import { Router } from "express";
import { createInterviewAnalysis, getInterviewAnalysis, updateInterviewAnalysis, deleteInterviewAnalysis } from "../controllers/interviewAnalysis.controller.js";
import { verifyAuth } from "../middlewares/auth.js";
const router = Router();


router.post('/create', verifyAuth , createInterviewAnalysis);
router.get('/get',verifyAuth ,  getInterviewAnalysis);
router.put('/update/:id',verifyAuth,  updateInterviewAnalysis);
router.delete('/delete/:id', verifyAuth,deleteInterviewAnalysis);

export default router;
