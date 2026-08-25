import { Router } from "express";
import * as ctrl from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.post("/oauth/:provider", ctrl.loginWithProvider);
router.get("/me", requireAuth, ctrl.me);

export default router;
