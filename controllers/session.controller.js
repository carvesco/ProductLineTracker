import Session from "../models/session.model.js";
import { endSession } from "./user.controller.js";

export const createSession = async (req, res) => {
  try {
    await Session.create(req.body);
    res.status(201).json({ msg: "Session created successfully" });
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
