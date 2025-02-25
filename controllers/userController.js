const userModel = require("../models/userModel");

const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const userData = {
      name: user.name,
      isAccountVerified: user.isAccountVerified,
    };

    console.log("Fetched User Data:", userData); // ✅ Fix: Properly log data
    return res.json({ success: true, userData }); // ✅ Fix: Ensuring one response
  } catch (error) {
    console.error("Error in getUserData:", error); // ✅ Debugging logs
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = getUserData;
