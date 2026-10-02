const express = require("express");
const connectDB = require("./config/db");
const Task = require("./models/Task");
const cors = require("cors");

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/tasks", async (req, res) => {
    try {
    const tasks = await Task.find();
    res.json(tasks);
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Error fetching tasks"})
    }
});

app.post("/api/tasks", async (req, res) => {
    try{ 

    const taskTitle = req.body.title;
    const taskId = req.body.id;
    const taskSubject = req.body.subject;
    const taskDuedate = req.body.duedate;
    const taskchecks = req.body.checks;

    if (!req.body.title || typeof req.body.title !== "string" || req.body.title.trim() === "") {
        return res.status(400).json({ message: "please write title"})
    }
    if (!req.body.subject || typeof req.body.subject !== "string" || req.body.subject.trim() === "") {
        return res.status(400).json({ message: "please write subject"})
    }
    if (req.body.id === undefined) {
        return res.status(400).json({ message: "Task ID is required"})
    }
    if (typeof req.body.id !== "number") {
        return res.status(400).json({ message: "Task ID must be a number"})
    }
    if (req.body.id < 1) {
        return res.status(400).json({ message: "Task ID must be a positive number"})
    }

    const newTask = await Task.create({
        id: taskId,
        title: taskTitle,
        subject: taskSubject,
        checks: taskchecks,
        duedate: taskDuedate
    }); 
    res.status(201).json(newTask)
} catch(error){
    console.error(error);
    res.status(500).json({message: "Error creating task"})
}
});

app.get("/api/tasks/:id", async (req, res) => {
    try{ 
    const id = Number(req.params.id);
    const task = await Task.findOne({id});
    if (!task) {
        return res.status(404).json("Task not found")
    }
    res.json(task);
}
catch(error){
    console.error(error);
    res.status(500).json({message: "Error fetching task"})
}
});

app.put("/api/tasks/:id", async (req, res) => {
    try{ 
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
} catch(error){
    console.error(error);
    res.status(500).json({message: "Error updating task"})
}
})
app.delete("/api/tasks/:id" , async (req,res)=>{
    try{
    const id = Number(req.params.id)
    const task = await Task.findOneAndDelete({id})
    if(!task){
        return res.status(404).json("Task not found")
    }
    res.status(200).json({ message:"Delete Task successfully"})
} catch(error){
    console.error(error);
    res.status(500).json({message: "Error deleting task"})
}
})
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
