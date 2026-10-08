const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);
};
module.exports = connectDB;