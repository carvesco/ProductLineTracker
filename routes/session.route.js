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

/**
 * @swagger
 * /session/active:
 *   get:
 *     summary: Get the currently active session
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Active session retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 session:
 *                   $ref: '#/components/schemas/Session'
 *                 buildData:
 *                   $ref: '#/components/schemas/Build'
 *       404:
 *         description: No active session found
 *       500:
 *         description: Internal server error
 */
router.get("/active", getActiveSession); // Search  active session

/**
 * @swagger
 * /session/time-left:
 *   get:
 *     summary: Get time left in a session
 *     tags: [Sessions]
 *     parameters:
 *       - in: query
 *         name: loginId
 *         required: true
 *         schema:
 *           type: string
 *         description: User login ID
 *       - in: query
 *         name: buildNumber
 *         required: true
 *         schema:
 *           type: number
 *         description: Build number
 *     responses:
 *       200:
 *         description: Time left information retrieved successfully
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
router.get("/time-left", getSessionTimeLeft); // Get time left in a session

/**
 * @swagger
 * /session:
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - buildNumber
 *             properties:
 *               loginId:
 *                 type: string
 *                 description: User login identifier
 *               buildNumber:
 *                 type: number
 *                 description: Build number to associate with session
 *     responses:
 *       200:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 buildData:
 *                   $ref: '#/components/schemas/Build'
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: Build not found
 *       500:
 *         description: Internal server error
 */
router.post("/", createSession); // Create a new session

/**
 * @swagger
 * /session/start:
 *   post:
 *     summary: Start timing a session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - buildNumber
 *             properties:
 *               loginId:
 *                 type: string
 *               buildNumber:
 *                 type: number
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Optional start time (defaults to current time)
 *     responses:
 *       200:
 *         description: Session started successfully
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
router.post("/start", startSession); // Start timing a session

/**
 * @swagger
 * /session/pause:
 *   post:
 *     summary: Pause a session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - buildNumber
 *             properties:
 *               loginId:
 *                 type: string
 *               buildNumber:
 *                 type: number
 *     responses:
 *       200:
 *         description: Session paused successfully
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
router.post("/pause", pauseSession); // Pause a session

/**
 * @swagger
 * /session/resume:
 *   post:
 *     summary: Resume a paused session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - buildNumber
 *             properties:
 *               loginId:
 *                 type: string
 *               buildNumber:
 *                 type: number
 *     responses:
 *       200:
 *         description: Session resumed successfully
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
router.post("/resume", resumeSession); // Resume a session

/**
 * @swagger
 * /session/exceeded:
 *   post:
 *     summary: Mark session as exceeded time limit
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - buildNumber
 *             properties:
 *               loginId:
 *                 type: string
 *               buildNumber:
 *                 type: number
 *     responses:
 *       200:
 *         description: Exceeded time recorded successfully
 *       500:
 *         description: Internal server error
 */
router.post("/exceeded", exceededTimeSession); // Exceeded time session

/**
 * @swagger
 * /session/finish:
 *   post:
 *     summary: Finish a session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - buildNumber
 *             properties:
 *               loginId:
 *                 type: string
 *               buildNumber:
 *                 type: number
 *     responses:
 *       200:
 *         description: Session finished successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 totalActiveTime:
 *                   type: number
 *                 totalActiveTimeInMinutes:
 *                   type: number
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
router.post("/finish", finishSession); // Finish a session

export default router;
