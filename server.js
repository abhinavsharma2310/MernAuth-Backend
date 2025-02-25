const dotenv = require("dotenv").config();
const connectDB = require("./config/mongodb");
const app = require("./app");
const authRoutes = require("./routes/authroute"); // ✅ No `.js` needed, but fine if included
const userRouter = require("./routes/userroutes");

connectDB();


app.use("/api/auth", authRoutes); // ✅ Ensure `authRoutes` is a function, not an object
app.use("/api/user",userRouter)
app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
