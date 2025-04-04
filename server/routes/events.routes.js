import { Router } from "express";
import { createEvent  , getEventById , getEvents  , updateEvent , deleteEvent} from "../controllers/event.controller.js";
import { verifyAuth } from "../middlewares/auth.js";
const router = Router();

router.post('/' , verifyAuth , createEvent);
router.get('/' , verifyAuth , getEvents);
router.get('/:id' , verifyAuth , getEventById);
router.patch('/:id' , verifyAuth , updateEvent);
router.delete('/:id' , deleteEvent);

export default router;

