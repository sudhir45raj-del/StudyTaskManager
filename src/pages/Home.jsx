import React, { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
function Home(){
    const [calendars,setCalendars] = useState(new Date())
    const [inputs, setinputs] = useState("")
    const [input, setinput] = useState("")
    const [task, setTask] = useState([])
    function addTask(){
        if(inputs.trim() === "" || input.trim() === "") return;
        const newTask = {
            id:Date.now(),
            title:inputs,
            subject:input,
            duedate:calendars.toDateString(),
            checks: false
        };
        setTask([...task,newTask])
    };
    function deletetsk(id){
        setTask(task.filter((item)=> item.id !== id));
        console.log("working")
    }
    function handlecheck(id){
            setTask(task.map((item)=>{ 
                    if(item.id === id){
                        return {...item, checks: !item.checks}
                    }
                    return item
            }))
    }
    return(
        <div className="mt-12 mb-5">
        <h1>Study Task Manager</h1>
            <h2 className="font-bold" >Add New Task</h2>
        <div> 
            <input id="ts" className="border-2 pr-10" type="text"placeholder="Write Your Task" onChange={(e)=>setinputs(e.target.value)} ></input>
            <input id="sb" className=" ml-2" type="text" placeholder="Subject" onChange={(e)=>setinput(e.target.value)} ></input>
            <span>
                <h3>Due Date</h3>
                <Calendar value={calendars} onChange={setCalendars}/>
                </span>
            <button className="bg-blue-800 text-white text-sm px-6 " onClick={addTask}>Add Task</button>
            <div>
                {task.map((item)=>{
                    return(
                        <ul key={item.id}>
                        <li  className="bg-amber-300">
                            <input type="checkbox" checked={item.checks} onChange={()=>handlecheck(item.id)}></input>
                                <span className={`bg-green-200 ${item.checks ?  "line-through text-gray-500": ""}`}>
                                    {item.title} 
                                    </span>
                                    <span className={`bg-green-200 ml-5 ${item.checks ? "line-through text-gray-500": ""}`}>
                                    {item.subject}
                                    </span>
                                    <span className= {`bg-green-200 ml-5 ${item.checks ? "line-through text-gray-500": ""}`}>
                                    {item.duedate}
                                    </span>
                                    <button  className="bg-blue-800 ml-5 mb-2 text-white font-bold" onClick={() =>deletetsk(item.id)}>delete</button>
                        </li>
                    </ul>
                    )
                })}
            </div>
             </div>
    </div>
    )
}
export default Home;