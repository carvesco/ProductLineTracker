import express from "express";
import mongoose from "mongoose";
import Build from "../models/build.model.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Build route is working!");
});

export default router;
