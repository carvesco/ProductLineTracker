import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  loginId: String,
  buildNumber: { type: Number, ref: "Build" },
  isPaussed: { type: Boolean, default: false },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  totalPausedTime: { type: Number, default: 0 }, // in milliseconds
  defects: { type: Number, default: 0 },
  totalParts: { type: Number, default: 0 },
  submission: String,
  totalActiveTime: { type: Number, default: 0 }, // in milliseconds
  totalInactiveTime: { type: Number, default: 0 }, // in milliseconds
  isActive: { type: Boolean, default: true },
  pauseStartTime: Date, // Track when pause started
});

// Method to start a pause
SessionSchema.methods.startPause = function () {
  this.pauseStartTime = new Date();
  this.isPaussed = true;
};

// Method to end a pause
SessionSchema.methods.endPause = function () {
  if (this.pauseStartTime) {
    const pauseDuration = new Date() - this.pauseStartTime;
    this.totalPausedTime += pauseDuration;
    this.pauseStartTime = null;
    this.isPaussed = false;
  }
};

// Method to end session
SessionSchema.methods.endSession = function () {
  this.isActive = false;
  // calculate total active time
  //calculate total inactive time
};

const Session = mongoose.model("Session", SessionSchema);

export default Session;
