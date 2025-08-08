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
  pauses: [{ pause: String }], // Array to hold pause details
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
    this.pauses.push({
      pause: "Pauses at " + this.pauseStartTime + ", resumes at " + new Date(),
    }); // Store pause time
    this.pauseStartTime = null;
    this.lastStartTime = new Date(); // Reset last start time to current time
    this.isPaused = false;
  }
};

SessionSchema.methods.exceededTime = function () {
  this.pauses.push({
    pause: "Exceeded time popup appeared at:" + new Date(),
  });
};

// Method to get time left in the session
SessionSchema.methods.getTimeLeft = function () {
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
  if (timeLeft < 0) {
    return this.totalActiveTime + new Date() - this.lastStartTime;
  }
  return timeLeft;
};

// Method to finish the session, calculate the total time active
SessionSchema.methods.finishSession = function () {
  this.endTime = new Date();
  this.totalActiveTime += new Date() - this.lastStartTime;
  this.isActive = false;
  this.isPaused = false;
  this.lastStartTime = null; // Reset last start time
};

const Session = mongoose.model("Session", SessionSchema);

export default Session;
