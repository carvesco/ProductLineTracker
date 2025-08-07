import Session from "../models/session.model.js";
import { getBuild } from "./build.controller.js";

export const createSession = async (req, res) => {
  try {
    const { loginId, buildNumber } = req.body;
    if (!loginId || !buildNumber) {
      return res
        .status(400)
        .json({ msg: "loginId and buildNumber are required" });
    }
    let buildData = await getBuild(buildNumber);
    console.log("Build Data:", buildData);
    if (!buildData) {
      return res.status(404).json({ msg: "Build not found" });
    }
    const sessionExists = await Session.findOne({ loginId, buildNumber });
    if (sessionExists) {
      return res.status(200).json({
        msg: "Session already exists for this user and build",
        buildData,
      });
    }
    await Session.create(req.body);
    return res.status(200).json({
      msg: "Session created successfully",
      buildData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const startSession = async (req, res) => {
  try {
    const { loginId, buildNumber, startTime } = req.body;
    if (!loginId || !buildNumber) {
      return res
        .status(400)
        .json({ msg: "loginId and buildNumber are required" });
    }
    const session = await Session.findOne({ loginId, buildNumber });
    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }

    // Update the start time from the request
    session.startTime = startTime ? new Date(startTime) : new Date();
    session.isActive = true;
    session.totalPausedTime = 0; // Reset paused time
    session.totalActiveTime = 0; // Reset active time

    await session.save();

    res.status(200).json({
      msg: "Session started successfully",
      session,
      startTime: session.startTime,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const pauseSession = async (req, res) => {
  try {
    const { loginId, buildNumber } = req.body;
    if (!loginId || !buildNumber) {
      return res
        .status(400)
        .json({ msg: "loginId and buildNumber are required" });
    }
    const session = await Session.findOne({ loginId, buildNumber });
    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }
    if (!session.isActive) {
      return res.status(400).json({ msg: "Session is not active" });
    }
    if (session.isPaussed) {
      return res.status(400).json({ msg: "Session is already paused" });
    }

    session.startPause();
    await session.save();

    res.status(200).json({
      msg: "Session paused successfully",
      session,
      pauseStartTime: session.pauseStartTime,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resumeSession = async (req, res) => {
  try {
    const { loginId, buildNumber } = req.body;
    if (!loginId || !buildNumber) {
      return res
        .status(400)
        .json({ msg: "loginId and buildNumber are required" });
    }
    const session = await Session.findOne({ loginId, buildNumber });
    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }
    if (!session.isActive) {
      return res.status(400).json({ msg: "Session is not active" });
    }
    if (session.isPaussed === false) {
      return res.status(400).json({ msg: "Session is not paused" });
    }

    session.endPause();
    await session.save();

    res.status(200).json({
      msg: "Session resumed successfully",
      session,
      pauseEndTime: session.pauseStartTime,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const finishSession = async (req, res) => {
  try {
    const { loginId, buildNumber, submission, totalParts, defects } = req.body;
    if (!loginId || !buildNumber) {
      return res
        .status(400)
        .json({ msg: "loginId and buildNumber are required" });
    }
    const session = await Session.findOne({ loginId, buildNumber });
    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }
    if (!session.isActive) {
      return res.status(400).json({ msg: "Session is not active" });
    }
    if (submission) {
      if (!totalParts || totalParts < 0) {
        return res
          .status(400)
          .json({ msg: "totalParts must be a non-negative number" });
      }
      session.totalParts = totalParts || 0;
      session.submission = submission;
      session.defects = defects || 0;
      session.endSession();
      await session.save();
    }

    /* session.endSession(); */
    await session.save();

    res.status(200).json({
      msg: "Session ended successfully",
      session,
      endTime: session.endTime,
      totalActiveTime: session.totalActiveTime,
      totalPausedTime: session.totalPausedTime,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
