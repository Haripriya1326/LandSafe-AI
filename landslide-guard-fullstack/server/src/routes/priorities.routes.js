import { Router } from "express";
import * as ctrl from "../controllers/priorities.controller.js";

const router = Router();

router.get("/", ctrl.listPriorities);

export default router;
