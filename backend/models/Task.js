const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    id: Number,
    title: String,
    subject: String,
    duedate: String,
    checks: Boolean
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;