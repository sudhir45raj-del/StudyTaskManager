import React, { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
function Home() {
    const [calendars, setCalendars] = useState(new Date())
    const [inputs, setinputs] = useState("")
    const [input, setinput] = useState("")
    const [task, setTask] = useState([])
    const [filter, setFilter] = useState("all");
    const[editId , setEditId] = useState(null);
    useEffect(()=>{
       localStorage.setItem("tasks",JSON.stringify(task))
    },[task])
    const taskStore = localStorage.getItem("tasks")
    useEffect(()=>{
        if(taskStore){
            setTask(JSON.parse(taskStore))
        }
    },[])
    // localStorage.removeItem("tasks")
    function addTask() {
        if (inputs.trim() === "" || input.trim() === "" || input.length < 2 || inputs.length < 3 || input.length > 30 || inputs.length > 100){
            if(input.length <= 0 || inputs.length <= 0){
                alert("Please fill all fields")
            }
            else if(inputs.length < 3 ){
               alert("Task must be atleast 3 characters")
           }
            else if(input.length < 2 ){
                alert("Subject must be atleast 2 characters")
            }
            else if(inputs.length > 100 ){
               alert("Task is too long")
           }
            else if(input.length > 30 ){
                alert("Subject is too long")
            }
            return;}
            console.log(inputs.length)
        const newTask = {
            id: Date.now(),
            title: inputs,
            subject: input,
            duedate: calendars.toDateString(),
            checks: false
        };
        setTask([...task, newTask])
        setinputs("")
        setinput("")
    };
    function deletetsk(id) {
        setTask(task.filter((item) => item.id !== id));
    }
    function updateTask(){
        setTask(task.map((item)=> {
            if(item.id === editId){
                return{...item, subject:(input), title:(inputs),duedate:(calendars.toDateString())}
            }
            return item
        }))
            setEditId(null)
            setinput("")
            setinputs("")
            console.log(input)
        }
        function cancelTask(){
            if(editId !== null){
                setEditId(null)
                setinput("")
                setinputs("")
                setCalendars(Date.now)
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
                <button className={`bg-blue-800 text-white text-sm px-6 ml-4 ${editId? "":"hidden"}`}onClick={updateTask}>Update</button>
                <button className={`bg-blue-800 text-white text-sm px-6 ml-4 ${editId? "":"hidden"}`}onClick={cancelTask}>Cancle</button>
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
                                        <button className=" bg-blue-800 cursor-pointer ml-5 px-4 mb-2 text-white font-bold" onClick={()=> {setEditId(item.id); setinputs(item.title); setinput(item.subject); setCalendars(new Date(item.duedate))}}>Edit</button>
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