import { Router } from "express";
import {
  createSession,
  startSession,
  pauseSession,
  resumeSession,
  finishSession,
  getSessionTimeLeft,
  exceededTimeSession,
  getActiveSession,
} from "../controllers/session.controller.js";

const router = Router();

router.get("/active", getActiveSession); // Search  active session
router.get("/time-left", getSessionTimeLeft); // Get time left in a session

router.post("/", createSession); // Create a new session
router.post("/start", startSession); // Start timing a session
router.post("/pause", pauseSession); // Pause a session
router.post("/resume", resumeSession); // Resume a session
router.post("/exceeded", exceededTimeSession); // Exceeded time session
router.post("/finish", finishSession); // Finish a session

export default router;
