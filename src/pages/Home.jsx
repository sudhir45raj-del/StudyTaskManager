import React, { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
function Home() {
    const [calendars, setCalendars] = useState(new Date())
    const [inputs, setinputs] = useState("")
    const [input, setinput] = useState("")
    const [task, setTask] = useState([])
    const [filter, setFilter] = useState("all");
    const [editId, setEditId] = useState(null);
    const [isUpdated, setIsUpdated]= useState(false)
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(task))
    }, [task])
    const taskStore = localStorage.getItem("tasks")
    // useEffect(() => {
    //     if (taskStore) {
    //         setTask(JSON.parse(taskStore))
    //     }
    // }, [])
    useEffect(()=>{
        loadTask()
    },[])
    function addTask() {
        if (inputs.trim() === "" || input.trim() === "" || input.length < 2 || inputs.length < 3 || input.length > 30 || inputs.length > 100) {
            if (input.length <= 0 || inputs.length <= 0) {
                alert("Please fill all fields")
            }
            else if (inputs.length < 3) {
                alert("Task must be atleast 3 characters")
            }
            else if (input.length < 2) {
                alert("Subject must be atleast 2 characters")
            }
            else if (inputs.length > 100) {
                alert("Task is too long")
            }
            else if (input.length > 30) {
                alert("Subject is too long")
            }
            return;
        }
        const newTask = {
            id: Date.now(),
            title: inputs,
            subject: input,
            duedate: calendars.toDateString(),
            checks: false
        };
        postData(newTask)
        setinputs("")
        setinput("")
    };
    async function apiDelete(id){
        try{

            const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`,{
                method: "DELETE",
            })
            if(!data.ok){
                throw new Error("something went wrong")
            }
            return true;
        } catch(error){
            console.log(error)
            return false
        }
    }
    async function deletetsk(id) {
        const result = await apiDelete(id)
        if( result){
            setTask(previousTask =>{
                return(
                    previousTask.filter((item) => item.id !== id)
                )
            });
        }
        else{
            alert("Failed to delete task. Please try again.")
        }
    }

    async function apiUpdate(updatedData) {
        try{
            const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${updatedData.id}`,{
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            })
            if(!data.ok){
                throw new Error("something went wrong")
            }
            return true
        } catch(error){
            console.log(error)
            return false
        }
    }
    async function updateTask() {
        const Taskvalue = task.find((item)=>{
            return(
                item.id === editId
            )
        })
        const updatedData = {
        id: editId,
        subject: input,
        title: inputs,
        duedate: calendars.toDateString(),
        checks: Taskvalue.checks
        }
        try {

            setIsUpdated(true)
            const result = await apiUpdate(updatedData)
            if(result){
                
                setTask(previousTask => previousTask.map((item) => {
                    if (item.id === editId) {
                        return { ...item, subject: (input), title: (inputs), duedate: (calendars.toDateString()) }
                    }
                    return item
                }))
                setEditId(null)
                setinput("")
                setinputs("")
                console.log(input)
            }
            else{
                alert("something went wrong")
            }
        } finally{
            setIsUpdated(false)
        }
        }
    function cancelTask() {
        if (editId !== null) {
            setEditId(null)
            setinput("")
            setinputs("")
            setCalendars(Date.now)
        }
    }
    async function loadTask() {
        console.log("this is working")
        const fetchts = await fetch("https://jsonplaceholder.typicode.com/todos")
        const datats = await fetchts.json()
        const convertedTask = datats.map((item) => {
            return {
                id: item.id,
                title: item.title,
                subject: "sample",
                duedate: new Date().toDateString(),
                checks: item.completed
            }
        })
        setTask(convertedTask)
    }
    async function postData(newTask) {
        try {
            const apidata = await fetch("https://jsonplaceholder.typicode.com/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTask)
            }
            )
            if (!apidata.ok) {
                throw new Error("somethingis wrong")
            }
            const datajson = await apidata.json()
            console.log(datajson)
            const convetedData = {
                id: datajson.id,
                title: datajson.title,
                checks: datajson.completed,
                subject: newTask.subject,
                duedate: newTask.duedate
            }
            setTask((previousTask)=> [...previousTask,convetedData])
        }
        catch (error) {
            console.log(error)
        }
    }
    function handlecheck(id) {
        setTask(task.map((item) => {
            if (item.id === id) {
                return { ...item, checks: !item.checks }
            }
            return item
        }))
    }
    const filteredTask =
        task.filter((item) => {
            if (filter === "all") {
                return (
                    item)
            }
            if (filter === "completed") {
                return (
                    item.checks === true)
            }
            if (filter === "pending") {
                return (
                    item.checks === false)
            }
        })
    return (
        <div className="mt-12 mb-5">
            <h1>Study Task Manager</h1>
            <h2 className="font-bold" >Add New Task</h2>
            <div>
                <input id="ts" className="border-2 pr-10" type="text" placeholder="Write Your Task" value={inputs} onChange={(e) => setinputs(e.target.value)} ></input>
                <input id="sb" className=" ml-2" type="text" placeholder="Subject" value={input} onChange={(e) => setinput(e.target.value)} ></input>
                <span>
                    <h3>Due Date</h3>
                    <Calendar value={calendars} onChange={setCalendars} />
                </span>
                <button className="bg-blue-800 text-white text-sm px-6 " onClick={addTask}>Add Task</button>
                <button className={`bg-blue-800 text-white text-sm px-6 ml-4 ${editId ? "" : "hidden"} `} disabled = {isUpdated} onClick={updateTask}>{isUpdated ? "Updating...": "Update" }</button>
                <button className={`bg-blue-800 text-white text-sm px-6 ml-4 ${editId ? "" : "hidden"}`} onClick={cancelTask}>Cancle</button>
                <div>
                    <div className="flex justify-between mt-2 mb-2">
                        <button className="bg-blue-300 cursor-pointer px-4 rounded-sm" onClick={() => setFilter("all")}>All</button>
                        <button className="bg-blue-300 cursor-pointer px-4 rounded-sm" onClick={() => setFilter("completed")}>Complete</button>
                        <button className="bg-blue-300 cursor-pointer px-4 rounded-sm" onClick={() => setFilter("pending")}>Pending</button>
                    </div>
                    <div>
                        {filteredTask.map((item) => {
                            return (
                                <ul key={item.id}>
                                    <li className="bg-red-500">
                                        <input className="cursor-pointer" type="checkbox" checked={item.checks} onChange={() => handlecheck(item.id)}></input>
                                        <span className={`bg-green-200 ${item.checks ? "line-through text-gray-500" : ""}`}>
                                            {item.title}
                                        </span>
                                        <span className={`bg-green-200 ml-5 ${item.checks ? "line-through text-gray-500" : ""}`}>
                                            {item.subject}
                                        </span>
                                        <span className={`bg-green-200 ml-5 ${item.checks ? "line-through text-gray-500" : ""}`}>
                                            {item.duedate}
                                        </span>
                                        <button className=" bg-blue-800 cursor-pointer ml-5 px-4 mb-2 text-white font-bold" onClick={() => { setEditId(item.id); setinputs(item.title); setinput(item.subject); setCalendars(new Date(item.duedate)) }}>Edit</button>
                                        <button className="bg-blue-800 cursor-pointer ml-5 px-4 mb-2 text-white font-bold" onClick={() => deletetsk(item.id)}>Delete</button>
                                    </li>
                                </ul>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home;