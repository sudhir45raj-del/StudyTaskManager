const express = require("express");
const connectDB = require("./config/db");
const Task = require("./models/Task");
const cors = require("cors");

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {

    const taskTitle = req.body.title;
    const taskId = req.body.id;
    const taskSubject = req.body.subject;
    const taskDuedate = req.body.duedate;
    const taskchecks = req.body.checks;

    if (!req.body.title || typeof req.body.title !== "string" || req.body.title.trim() === "") {
        return res.status(400).json("please write title")
    }
    if (!req.body.subject || typeof req.body.subject !== "string" || req.body.subject.trim() === "") {
        return res.status(400).json("please write title")
    }
    if (req.body.id === undefined) {
        return res.status(400).json("Task ID is required")
    }
    if (typeof req.body.id !== "number") {
        return res.status(400).json("Task ID must be a number")
    }
    if (req.body.id < 1) {
        return res.status(400).json("Task ID must be a positive number")
    }
    if (req.body.completed === undefined) {
        return res.status(400).json("Task status is required")
    }
    if (req.body.completed !== "completed" && req.body.completed !== "pending") {
        return res.status(400).json("Invalid Status")
    }

    const newTask = await Task.create({
        id: taskId,
        title: taskTitle,
        subject: taskSubject,
        checks: taskchecks,
        duedate: taskDuedate
    }); 
    res.status(201).json(newTask)
});

app.get("/api/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    const task = await Task.findOne({id});
    if (!task) {
        return res.status(404).json("Task not found")
    }
    res.json(task);
});

app.put("/api/tasks/:id", async (req, res) => {
    const id = Number(req.params.id)
    const task = await Task.findOne({id});
    if (!task) {
        return res.status(404).json("Task not found")
    }
    task.title = req.body.title;
    task.subject = req.body.subject;
    task.duedate = req.body.duedate;
    task.checks = req.body.checks;
    await task.save();
    res.json(task);
})
app.delete("/api/tasks/:id" , async (req,res)=>{
    const id = Number(req.params.id)
    const task = await Task.findOneAndDelete({id})
    if(!task){
        return res.status(404).json("Task not found")
    }
    res.status(204).json("Delete Task successfully")
    
})
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
