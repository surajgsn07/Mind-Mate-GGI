import { Router } from "express";
import { getInterviewQuestion  , generateInterviewReport} from "../controllers/interview.js";
import { verifyAuth } from "../middlewares/auth.js";
const router = Router();

router.post('/' , verifyAuth, getInterviewQuestion);
router.post('/report' , verifyAuth,  generateInterviewReport)

export default router;