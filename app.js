const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Correct CORS setup
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://mern-auth-frontend-delta.vercel.app", // Deployed frontend on Vercel
];

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
