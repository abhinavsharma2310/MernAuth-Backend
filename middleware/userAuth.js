const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // Extract token from cookies or headers
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Token not found" });
    }

    // Verify the token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode.id) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    // Attach userId to request
    req.body.userId = tokenDecode.id;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Unauthorized: " + error.message });
  }
};

module.exports = userAuth;
