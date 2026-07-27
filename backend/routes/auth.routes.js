import { Router } from "express";
import { registerUser, loginUser, loginAdmin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/login-admin", loginAdmin);

export default router;
