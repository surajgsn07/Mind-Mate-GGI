import { Router } from "express";

import { getAllTherapists, getTherapist, userLogin, userSignup } from "../controllers/therapist.js";

const therapistRouter = Router();

therapistRouter.post("/register", userSignup);
therapistRouter.post("/login", userLogin);
therapistRouter.get("/all",getAllTherapists);
therapistRouter.get("/:id", getTherapist);



// router.post('/gsignin',GoogleSignIn);

export default therapistRouter;
