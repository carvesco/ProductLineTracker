import Build from "../models/build.model.js";
import mongoose from "mongoose";
import { validateLoginId } from "./user.controller.js";

export const getBuild = async (buildNumber) => {
  try {
    console.log("Fetching build for buildNumber:", buildNumber);
    const build = await Build.findOne({ buildNumber });
    if (!build) {
      return null;
    }
    return build;
  } catch (error) {
    throw new Error(`Error fetching build: ${error.message}`);
  }
};
