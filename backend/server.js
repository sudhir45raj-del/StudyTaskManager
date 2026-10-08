const express = require("express");
const connectDB = require("./config/db");
const Task = require("./models/Task");
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/tasks", authMiddleware, async (req, res) => {
    try {
    console.log(req.user);
    const tasks = await Task.find({user: req.user.id});
    res.json(tasks);
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Error fetching tasks"})
    }
});

app.post("/api/tasks", authMiddleware, async (req, res) => {
    try{ 
    const taskTitle = req.body.title;
    const taskId = req.body.id;
    const taskSubject = req.body.subject;
    const taskDuedate = req.body.duedate;
    const taskchecks = req.body.checks;
    const userId = req.user.id;

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
    if(!req.body.duedate || typeof req.body.duedate !== "string" || req.body.duedate.trim() === "") {
        return res.status(400).json({ message: "please write duedate"})
    }
    const newTask = await Task.create({
        id: taskId,
        title: taskTitle,
        subject: taskSubject,
        checks: taskchecks,
        duedate: taskDuedate,
        user: userId
    }); 
    res.status(201).json(newTask)
} catch(error){
    console.error(error);
    res.status(500).json({message: "Error creating task"})
}
});

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email and password" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }
        if(!/^[a-zA-Z]+$/.test(name)) {
            return res.status(400).json({ message: "Name can only contain letters and numbers" });
        }
        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const responseUser = {
            name: user.name,
            email: user.email,
        };
        res.status(201).json(responseUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
});

app.post("/api/auth/login", async (req, res) => {
    
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email});
        if(!user){
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({ message: "Invalid email or password"});
        }
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: "1h"});
        const responseUser = {
            name: user.name,
            email: user.email,
            token: token
        };
        res.status(200).json(responseUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in user" });
    }
});

app.get("/api/tasks/:id", authMiddleware, async (req, res) => {
    try{ 
    const id = Number(req.params.id);
    const task = await Task.findOne({user: req.user.id, id: id});
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

app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
    try{ 
    const id = Number(req.params.id)
    const task = await Task.findOne({user: req.user.id, id: id});
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
app.delete("/api/tasks/:id" , authMiddleware, async (req,res)=>{
    try{
    const id = Number(req.params.id)
    const task = await Task.findOneAndDelete({user: req.user.id, id: id});
    if(!task){
        return res.status(404).json("Task not found")
    }
    res.status(200).json({ message:"Delete Task successfully"})
} catch(error){
    console.error(error);
    res.status(500).json({message: "Error deleting task"})
}
})
app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
});
