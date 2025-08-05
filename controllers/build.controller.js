import Build from "../models/build.model.js";
import mongoose from "mongoose";
import { validateLoginId } from "./user.controller.js";

export const getBuild = async (req, res) => {
  try {
    let id = req.query.id;
    let loginId = req.query.loginId;
    let activeSession = await validateLoginId(loginId);
    if (!activeSession) {
      return res.status(403).json({ msg: "User is in an active session" });
    }
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(422).json({ msg: `${id} is not a valid id` });
    }
    const build = await Build.findOne({ BuildNumber: id });
    if (!build) {
      return res.status(404).json({ msg: `No build with number :${id}` });
    }

    res.status(200).json(build);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
