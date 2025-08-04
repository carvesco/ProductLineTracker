import mongoose from "mongoose";

const PauseSchema = new mongoose.Schema({
  session_id: { type: mongoose.Types.ObjectId, ref: "Session" },
  pause_time: Date,
  resume_time: Date,
});
const Pause = mongoose.model("Pause", PauseSchema);

export default Pause;
