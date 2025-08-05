import mongoose from "mongoose";

const BuildSchema = new mongoose.Schema({
  BuildNumber: Number,
  numberOfParts: Number,
  timePerPart: Number,
});

const Build = mongoose.model("Build", BuildSchema);

export default Build;
