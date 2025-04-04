import { Router } from "express";

import { getUser, google_login, userLogin, userSignup } from "../controllers/user.js";
import { verifyAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", userSignup);
router.post("/login", userLogin);
router.post("/google_login", google_login);
router.get("/",verifyAuth,getUser);
// router.post('/gsignin',GoogleSignIn);
router.get('/me' , verifyAuth , getUser)

export default router;
