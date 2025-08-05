import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  loginId: { type: String, ref: "User" },
  buildNumber: { type: Number, ref: "Build" },
  start_time: Date,
  end_time: Date,
  defects: Number,
  totalParts: Number,
  submission: String,
  totalActiveTime: Number,
  totalInactiveTime: Number,
});
const Session = mongoose.model("Session", SessionSchema);

export default Session;
