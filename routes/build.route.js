import express from "express";
const router = express.Router();
import { getBuild } from "../controllers/build.controller.js";

/**
 * @swagger
 * /builds:
 *   get:
 *     summary: Get build information by build number
 *     tags: [Builds]
 *     parameters:
 *       - in: query
 *         name: buildNumber
 *         required: true
 *         schema:
 *           type: number
 *         description: The build number to retrieve
 *     responses:
 *       200:
 *         description: Build information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Build'
 *       404:
 *         description: Build not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getBuild);

export default router;
