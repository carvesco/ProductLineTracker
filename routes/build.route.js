import express from "express";
import mongoose from "mongoose";
import Build from "../models/build.model.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Build route is working!");
});

router.post("/", async (req, res) => {
  try {
    const build = await Build.create(req.body);
    console.log("Build created:", build);
    res.send("Build data received!");
  } catch (error) {
    console.error("Error processing build data:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
