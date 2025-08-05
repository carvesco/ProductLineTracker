import User from "../models/user.model.js";

const createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const validateLoginId = async (loginId) => {
  try {
    if (!loginId || typeof loginId !== "string" || !loginId.trim()) {
      throw new Error(`${loginId} is not a valid id`);
    }
    let user = await User.findOne({ loginId });
    if (!user) {
      await createUser({ loginId, active_session: true });
      return true;
    }
    if (user.active_session) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
};

export const endSession = async (loginId) => {
  console.log("Ending session for user:", loginId);
  try {
    const user = await User.findOneAndUpdate(
      { loginId },
      { active_session: false },
      { new: true }
    );
    return user;
  } catch (error) {
    throw new Error(`Error ending session: ${error.message}`);
  }
};
