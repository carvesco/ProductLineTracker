import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  loginId: String,
  buildNumber: { type: Number, ref: "Build" },
  processingTime: { type: Number, default: 0 }, // in milliseconds
  isPaused: { type: Boolean, default: false },
  lastStartTime: Date,
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  defects: { type: Number, default: 0 },
  totalParts: { type: Number, default: 0 },
  submission: String,
  totalActiveTime: { type: Number, default: 0 }, // in milliseconds
  totalInactiveTime: { type: Number, default: 0 }, // in milliseconds
  isActive: { type: Boolean, default: false },
  pauseStartTime: Date, // Track when pause started
});

// Method to start a pause
SessionSchema.methods.startPause = function () {
  this.pauseStartTime = new Date();
  this.totalActiveTime += new Date() - this.lastStartTime; // Calculate active time before pausing
  this.lastStartTime = null; // Reset last start time
  this.isPaused = true;
};

// Method to end a pause
SessionSchema.methods.endPause = function () {
  if (this.pauseStartTime) {
    const pauseDuration = new Date() - this.pauseStartTime;
    this.totalInactiveTime += pauseDuration; // Add pause duration to total inactive time
    this.pauseStartTime = null;
    this.lastStartTime = new Date(); // Reset last start time to current time
    this.isPaused = false;
  }
};

SessionSchema.methods.getTimeLeft = function () {
  console.log("Calculating time left for session");
  if (this.totalActiveTime === 0) {
    return this.processingTime - (new Date() - this.startTime);
  }
  if (!this.isPaused) {
    return (
      this.processingTime -
      this.totalActiveTime -
      (new Date() - this.lastStartTime)
    ); // Adjust for active time since last start
  }
  let timeLeft = this.processingTime - this.totalActiveTime;
  return timeLeft;
};

// Method to end session
SessionSchema.methods.endSession = function () {
  this.isActive = false;
  // calculate total active time
  //calculate total inactive time
};

const Session = mongoose.model("Session", SessionSchema);

export default Session;
