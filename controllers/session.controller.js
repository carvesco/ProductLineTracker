import Build from "../models/build.model.js";
import Session from "../models/session.model.js";
import { getBuild } from "./build.controller.js";
import { endSession } from "./user.controller.js";

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

export const updateSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    if (req.body.submission == true) {
      await endSession(req.body.loginId);
    }
    const session = await Session.findByIdAndUpdate(sessionId, req.body, {
      new: true,
    });
    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
