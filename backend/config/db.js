const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sudhir45raj_db_user:3qdiT27AxoO1LjkD@cluster0.qppdc9s.mongodb.net/?appName=Cluster0");
    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);
};
module.exports = connectDB;