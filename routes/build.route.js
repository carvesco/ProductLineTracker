import express from "express";
const router = express.Router();
import { getBuild } from "../controllers/build.controller.js";

router.get("/", getBuild);

export default router;
