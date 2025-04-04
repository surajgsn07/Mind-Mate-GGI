import { Router } from "express";
import multer from "multer";
import { chat, chatWithImg, chatWithVoice , chatAnalysis, getReports, getChats, chatSummarize, chatNotes} from "../controllers/chat.controller.js";
import { verifyAuth } from "../middlewares/auth.js";
const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/' , verifyAuth , chat);
router.post('/img' , verifyAuth, upload.single('file')  , chatWithImg);
router.post('/summarize' ,verifyAuth, chatSummarize);
router.post('/voice' ,verifyAuth, chatWithVoice);
router.get('/analyze' ,verifyAuth, chatAnalysis);
router.get('/reports' , verifyAuth,  getReports);
router.get('/chats' , verifyAuth,  getChats);
router.get("/notes", verifyAuth, chatNotes);


export default router;
