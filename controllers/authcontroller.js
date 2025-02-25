const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
require("dotenv/config");
const userAuth = require("../middleware/userAuth");

//REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcome to Falcon",
      text: `welcome to falcon website .Your account has been created with the email id:${email} `,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Email and password required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password does not match" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// LOGOUT
const logout = async (req , res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already Verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    console.log(otp);
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification Otp",
      text: `welcome to falcon website .Your OTP IS :${otp}.
      Verify your account using this Otp.`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Account verified" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    res.json({ success: false, message: "missing details" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "invalid otp" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Otp Expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();
    return res.json({ success: true, message: "Email verified" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// isauthenticated function
const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "user is Authenticated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// password reset
const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      // Generate OTP and save in resetOtp
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      console.log(`Generated OTP for ${email}:`, otp);
  
      user.resetOtp = otp;  // ✅ Fix: Store OTP in resetOtp
      user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 min expiry
  
      await user.save();
      console.log("OTP saved successfully:", user);
  
      // Send OTP via email
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Password Reset OTP",
        text: `Welcome to Falcon website. Your OTP is: ${otp}.
        Verify your account using this OTP.`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ success: true, message: "Reset OTP sent" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.json({ success: false, message: error.message });
    }
  };
  
// Reset user password

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "Email, OTP, and New Password are required" });
    }
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      // Debugging logs
      console.log(`Stored OTP: ${user.resetOtp}, Received OTP: ${otp}`);
      console.log(`OTP Expiry Time: ${new Date(user.resetOtpExpireAt)}, Current Time: ${new Date()}`);
  
      // Check OTP validity
      if (!user.resetOtp || user.resetOtp !== String(otp)) {
        return res.json({ success: false, message: "Invalid OTP" });
      }
  
      // Check if OTP is expired
      if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
        return res.json({ success: false, message: "OTP Expired" });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetOtp = ""; // ✅ Fix: Clear resetOtp after use
      user.resetOtpExpireAt = 0;
  
      await user.save();
      console.log("Password updated successfully");
  
      res.json({ success: true, message: "Password has been updated" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.json({ success: false, message: error.message });
    }
  };
  
// Export the functions
module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  sendVerifyOtp,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
};
