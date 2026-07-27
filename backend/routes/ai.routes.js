import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { enhanceResumeText } from "../controllers/ai.controller.js";

const router = Router();

// Secure the route with JWT verification
router.use(verifyJWT);

router.post("/enhance", enhanceResumeText);

export default router;
