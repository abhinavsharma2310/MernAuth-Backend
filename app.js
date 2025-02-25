const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const allowedOrigins = ["http://localhost:5173"]; // ✅ Removed trailing slash

const app = express();

// ✅ Correct CORS setup
app.use(
  cors({
    origin: allowedOrigins, 
    credentials: true, // ✅ Allow cookies/sessions
  })
);

// ✅ Middleware setup
app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running correctly!");
});

module.exports = app;
