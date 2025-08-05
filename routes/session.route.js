import { Router } from "express";
import {
  createSession,
  updateSession,
} from "../controllers/session.controller.js";

const router = Router();

router.post("/", createSession);
router.put("/:id", updateSession);

export default router;
