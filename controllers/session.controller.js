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
    console.log("Build Data:", buildData.numberOfParts);

    let sessionData = {
      loginId,
      buildNumber,
      isActive: false,
      processingTime: buildData.numberOfParts * buildData.timePerPart * 1000, // Assuming processingTime is total time for all parts
    };
    await Session.create(sessionData);
    return res.status(200).json({
      msg: "Session created successfully",
      buildData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessionTimeLeft = async (req, res) => {
  try {
    const { loginId, buildNumber } = req.query;
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
    const timeLeft = session.getTimeLeft();

    res.status(200).json({
      msg: "Time left for the session",
      timeLeft,
      session,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const startSession = async (req, res) => {
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

    // Update the start time from the request
    session.startTime = new Date();
    session.lastStartTime = new Date(); // Set last start time to current time
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
    if (session.isPaused) {
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
    if (session.isPaused === false) {
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
    session.totalParts = totalParts || 0;
    session.submission = submission || false;
    session.defects = defects || 0;
    session.isActive = false;
    session.finishSession();
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
