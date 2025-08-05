import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  loginId: String,
  active_session: Boolean,
});

const User = mongoose.model("User", UserSchema);

export default User;
