const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  mongoose.connection.once("connected", () => {
    console.log("Database connected");
  });

  await mongoose.connect(process.env.MONGO_DB_URI);
};

module.exports = connectDB;
