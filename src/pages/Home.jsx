import React, { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getTasks } from "../api/tasks";
import { postTasks } from "../api/tasks";
import { deleteTasks } from "../api/tasks";
import { updateTasks } from "../api/tasks";
import { useNavigate } from "react-router-dom";

function Home() {
    const [calendars, setCalendars] = useState(new Date())
    const [inputs, setinputs] = useState("")
    const [input, setinput] = useState("")
    const [task, setTask] = useState([])
    const [filter, setFilter] = useState("all");
    const [editId, setEditId] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [error, setError] = useState("")
    const [taskError, setTaskError] = useState("")
    const [subjectError, setSubjectError] = useState("")
    const [searchText, setSearchText] = useState("");
    const [order, setOrder] = useState("")
    const [currentpage, setcurrentpage] = useState(1)
    const [showCalendar, setShowCalendar] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        fetchTasks();
    }, [])

    async function fetchTasks() {
        setError("");
        const token = localStorage.getItem("token")
        try {
            const data = await getTasks();
            setTask(data);
        } catch (error) {
            if(error.status === 401){
                localStorage.removeItem("token")
                navigate('/login')
            }else{
                console.error("Error fetching tasks:", error);
                setError("Failed to fetch tasks. Please try again later.");
            }
        }
        finally {
            setIsLoading(false);
        }
    }
    function isValidTitle(title) {
        if (title.trim().length >= 3 && title.trim().length <= 100) {
            return true;
        }
        else {
            return false
        }
    }

    function isValidSubject(sub) {
        if (sub.trim().length >= 2 && sub.trim().length <= 30) {
            return true;
        }
        else {
            return false
        }
    }
    async function addTask() {
        console.log("1. addTask started");
        setTaskError("");
        setSubjectError("");
        const isTitleValid = isValidTitle(inputs)
        const isSubjectValid = isValidSubject(input)
        if (inputs.trim() === "" || input.trim() === "" || !isTitleValid || !isSubjectValid) {
            if (inputs.length <= 0 || inputs.trim() === "") {
                setTaskError("Please fill fields")
            }
            else if (inputs.trim().length < 3) {
                setTaskError("Task must be atleast 3 character")
            }
            else if (inputs.trim().length > 100) {
                setTaskError("Task is too long")
            }

            if (input.length <= 0 || input.trim() === "") {
                setSubjectError("Please fill fields")
            } else if (input.trim().length < 2) {
                setSubjectError("Subject must be atleast 2 character")
            }
            else if (input.trim().length > 30) {
                setSubjectError("Subject is  too long")
            }
            return;
        }
        const newTask = {
            id: Date.now(),
            title: inputs,
            subject: input,
            duedate: calendars.toDateString(),
            checks: false,
        };
        console.log("2. newTask:", newTask);
        try {
            setIsAdding(true)
            console.log("3. calling postData");
            const result = await postData(newTask)
            console.log("4. postData result:", result);
            if (result) {
                setinputs("")
                setinput("")
            }
        } finally {
            setIsAdding(false)
        }
    };
    async function deletetsk(id) {
        try{
            setIsDeleting(true)
            const result = await deleteTasks(id)
            if (result) {
                setTask(previousTask => {
                    return (
                        previousTask.filter((item) => item.id !== id)
                    )
                });
            }
            else {
                setError("Failed to delete task. Please try again.")
            }
        } catch (error) {
            setError("Error deleting task: " + error.message);
        }
        finally {
            setIsDeleting(false) 
        }
    }
    async function updateTask() {
        setError("")
        const Taskvalue = task.find((item) => {
            return (
                item.id === editId
            )
        })
        const updatedData = {
            id: editId,
            subject: input,
            title: inputs,
            duedate: calendars.toDateString()
        }
        try {
            setIsUpdated(true)
            const result = await updateTasks(updatedData)
            if (result) {

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
        }  catch (error) {
           setError("Error updating task: " + error.message);
            } 
        finally {
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
    async function postData(newTask) {
        console.log("5. postData started");
        try {
            const datajson = await postTasks(newTask);
            console.log("Post task result:", datajson);
            setTask((previousTask) => [...previousTask, datajson]);
            return true;
        }
        catch (error) {
            console.log(error.message)
            return false
        }
    }
    async function handlecheck(id) {
        const taskToUpdate = task.find((item) => {
            return item.id === id;
        });
        if (taskToUpdate) {
            const newChecks = !taskToUpdate.checks;
            const updatedTask = {
                id: taskToUpdate.id,
                title: taskToUpdate.title,
                subject: taskToUpdate.subject,
                duedate: taskToUpdate.duedate,
                checks: newChecks
            };
            try{

                const result = await updateTasks(updatedTask);
                if (result) {
                    setTask((previousTask) =>
                        previousTask.map((item) =>
                            item.id === id ? { ...item, checks: newChecks } : item
                )
            );
        }
    } catch(error){
        setError("Failed to update task completion status.")
}}}

    function getTaskStatus(item) {
        if (!item || !item.duedate) {
            return "invalid date"
        }
        const duedate = new Date(item.duedate)
        if (isNaN(duedate.getTime())) {
            return "invalid date"
        }
        const today = new Date()
        const complete = Boolean(item.checks)
        today.setHours(0, 0, 0, 0)
        duedate.setHours(0, 0, 0, 0)
        const difference = (duedate - today) / 86400000
        if (complete) {
            return "completed"
        } else if (duedate < today && duedate > 0) {
            return "overdue"
        } else if (duedate.getTime() === today.getTime()) {
            return "today"
        }
        else if (difference <= 3) {
            return "due soon"
        }
        else {
            return "upcoming"
        }

    }

    const allTask = task.length
    const completedTask = task.filter((item) =>
        item.checks === true).length
    const pendingTask = task.filter((item) =>
        item.checks === false).length

    const overdueTask = task.filter((item) => {
        const status = getTaskStatus(item)
        if (status === "overdue") {
            return true
        }
        return false
    }).length

    const todayTask = task.filter((item) => {
        const status = getTaskStatus(item)
        if (status === "today") {
            return true
        }
        return false
    }).length

    const filteredTask =
        task.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase())
            let matchesFilter;
            if (filter === "all") {
                matchesFilter = true
            }
            else if (filter === "completed") {
                matchesFilter = item.checks === true
            }
            else if (filter === "pending") {
                matchesFilter = item.checks === false
            }
            return matchesFilter && matchesSearch;
        })
    const sortTaskAscending = [...filteredTask].sort((a, b) => {
        const dataA = new Date(a.duedate)
        const dataB = new Date(b.duedate)
        return dataA - dataB
    })

    const sortTaskDescending = [...filteredTask].sort((a, b) => {
        const dataA = new Date(a.duedate)
        const dataB = new Date(b.duedate)
        return dataB - dataA
    })
    let displayTasks;
    if (order === "ascending") {
        displayTasks = sortTaskAscending
    }
    else if (order === "descending") {
        displayTasks = sortTaskDescending
    }
    else {
        displayTasks = filteredTask
    }
    function handlesubmit(event) {
        event.preventDefault();
        addTask()
    }
    const tasksPerPage = 5;
    const startIndex = (currentpage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const totalPages = Math.ceil(filteredTask.length / tasksPerPage);
    const currentTasks = displayTasks.slice(startIndex, endIndex);
    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* Header */}
                <header className="flex flex-col gap-2 border-b border-slate-800 pb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        Your productivity space
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Study Task Manager
                    </h1>
                    <p className="text-slate-400">
                        Organize your tasks, track deadlines, and stay focused.
                    </p>
                </header>

                {/* Add Task Form */}
                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Add New Task</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Add a task and choose its due date.
                        </p>
                    </div>

                    <form onSubmit={(event) => handlesubmit(event)} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="ts" className="mb-2 block text-sm font-medium text-slate-300">
                                    Task name
                                </label>
                                <input
                                    id="ts"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                    type="text"
                                    placeholder="Write your task"
                                    value={inputs}
                                    onChange={(e) => {
                                        setinputs(e.target.value);
                                        if (taskError === "Please fill fields" || taskError === "Task must be atleast 3 characters" || taskError === "Task is too long") {
                                            setTaskError("");
                                        }
                                    }}
                                />
                                {taskError && (
                                    <p className="mt-2 text-sm text-red-400">{taskError}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="sb" className="mb-2 block text-sm font-medium text-slate-300">
                                    Subject
                                </label>
                                <input
                                    id="sb"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                    type="text"
                                    placeholder="Subject"
                                    value={input}
                                    onChange={(e) => {
                                        setinput(e.target.value);
                                        if (subjectError === "Please fill fields" || subjectError === "Subject must be atleast 2 characters" || subjectError === "Subject is too long") {
                                            setSubjectError("");
                                        }
                                    }}
                                />
                                {subjectError && (
                                    <p className="mt-2 text-sm text-red-400">{subjectError}</p>
                                )}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-medium">Due date</h3>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Select when this task should be completed.
                                    </p>
                                </div>
                                <button
                                    className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                                    type="button" onClick={() => setShowCalendar(prev => !prev)}
                                >
                                    {showCalendar ? "Hide Calendar" : "Choose Due Date"}
                                </button>
                            </div>

                            {showCalendar && (
                                <div className="mt-4 overflow-hidden rounded-xl bg-white p-2 text-slate-900">
                                    <Calendar value={calendars} onChange={setCalendars} />
                                </div>
                            )}
                        </div>

                        {/* Form Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isAdding}
                                type="submit"
                            >
                                {isAdding ? "Adding Task..." : "Add Task"}
                            </button>

                            <button
                                className={`rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50 ${editId ? "" : "hidden"}`}
                                disabled={isUpdated}
                                onClick={updateTask}
                            >
                                {isUpdated ? "Updating..." : "Update"}
                            </button>

                            <button
                                className={`rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 ${editId ? "" : "hidden"}`}
                                type="button" onClick={cancelTask}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
                </section>

                {/* Summary Cards */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" id="dashboard">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                        <p className="text-sm font-medium text-slate-400">All Tasks</p>
                        <h2 className="mt-3 text-4xl font-bold text-white">{allTask}</h2>
                        <p className="mt-2 text-sm text-slate-500">Tasks in your list</p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-5">
                        <p className="text-sm font-medium text-emerald-300">Completed</p>
                        <h2 className="mt-3 text-4xl font-bold text-emerald-400">{completedTask}</h2>
                        <p className="mt-2 text-sm text-slate-500">Tasks you've finished</p>
                    </div>

                    <div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-5">
                        <p className="text-sm font-medium text-amber-300">Pending</p>
                        <h2 className="mt-3 text-4xl font-bold text-amber-400">{pendingTask}</h2>
                        <p className="mt-2 text-sm text-slate-500">Tasks still in progress</p>
                    </div>
                </section>

                {/* Deadline Alerts */}
                <section className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                        <div>
                            <h2 className="font-semibold text-red-300">Overdue Tasks</h2>
                            {overdueTask > 0 && (
                                <p className="mt-1 text-sm text-slate-400">
                                    You have {overdueTask} overdue tasks.
                                </p>
                            )}
                        </div>
                        <span className="rounded-xl bg-red-500/15 px-4 py-2 text-xl font-bold text-red-300">
                            {overdueTask}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                        <div>
                            <h2 className="font-semibold text-amber-300">Due Today</h2>
                            {todayTask > 0 && (
                                <p className="mt-1 text-sm text-slate-400">
                                    You have {todayTask} tasks due today.
                                </p>
                            )}
                        </div>
                        <span className="rounded-xl bg-amber-500/15 px-4 py-2 text-xl font-bold text-amber-300">
                            {todayTask}
                        </span>
                    </div>
                </section>

                {/* Task Controls */}
                <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6" id="tasks" >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Your Tasks</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Search, filter, and organize your tasks.
                            </p>
                        </div>

                        <div className="w-full lg:max-w-xs">
                            <label htmlFor="sort" className="mb-2 block text-sm text-slate-400">
                                Sort by due date
                            </label>
                            <select
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                                value={order}
                                onChange={(event) => {
                                    setOrder(event.target.value);
                                    setcurrentpage(1);
                                }}
                                name="sortorder"
                                id="sort"
                            >
                                <option value="">Choose sort order</option>
                                <option value="ascending">Earliest due date first</option>
                                <option value="descending">Latest due date first</option>
                            </select>
                        </div>
                    </div>

                    <form>
                        <input
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                            placeholder="Search tasks..."
                            type="text"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setcurrentpage(1);
                            }}
                        />
                    </form>

                    <div className="flex flex-wrap gap-2">
                        <button
                            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                            onClick={() => {
                                setFilter("all");
                                setcurrentpage(1);
                            }}
                        >
                            All
                        </button>
                        <button
                            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                            onClick={() => {
                                setFilter("completed");
                                setcurrentpage(1);
                            }}
                        >
                            Complete
                        </button>
                        <button
                            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                            onClick={() => {
                                setFilter("pending");
                                setcurrentpage(1);
                            }}
                        >
                            Pending
                        </button>
                    </div>

                    {/* Task List */}
                    <div className="space-y-3">
                        {error ? (
                            <div className="rounded-xl border border-dashed border-red-500 px-4 py-12 text-center">
                                <p className="font-medium text-red-400">{error}</p>
                            </div>
                        ) : isLoading ? (
                            <div className="rounded-xl border border-dashed border-slate-700 px-4 py-12 text-center">
                                <p className="font-medium text-slate-300">Loading tasks...</p>
                            </div>
                        ) : currentTasks.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-700 px-4 py-12 text-center">
                                <p className="font-medium text-slate-300">No tasks found</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Try changing your search or filters.
                                </p>
                            </div>
                        ) : (
                            currentTasks.map((item) => {
                                const status = getTaskStatus(item);

                                return (
                                    <ul key={item.id}>
                                        <li className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <input
                                                    className="mt-1 h-4 w-4 cursor-pointer accent-cyan-500"
                                                    type="checkbox"
                                                    checked={item.checks}
                                                    onChange={() => handlecheck(item.id)}
                                                />

                                                <div className="min-w-0">
                                                    <p className={`break-words font-medium ${item.checks ? "text-slate-500 line-through" : "text-slate-100"}`}>
                                                        {item.title}
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                                                        <span>{item.subject}</span>
                                                        <span>{item.duedate}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                                <p className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "due soon" ? "bg-amber-400/10 text-amber-300" :
                                                    status === "invalid date" ? "bg-orange-400/10 text-orange-300" :
                                                        status === "completed" ? "bg-emerald-400/10 text-emerald-300" :
                                                            status === "overdue" ? "bg-red-400/10 text-red-300" :
                                                                status === "today" ? "bg-yellow-400/10 text-yellow-300" :
                                                                    "bg-cyan-400/10 text-cyan-300"
                                                    }`}>
                                                    {status}
                                                </p>

                                                <button
                                                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                                                    onClick={() => {
                                                        setEditId(item.id);
                                                        setinputs(item.title);
                                                        setinput(item.subject);
                                                        setCalendars(new Date(item.duedate));
                                                    }}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
                                                    onClick={() => deletetsk(item.id)} disabled={isDeleting}
                                                >
                                                    {isDeleting ? "Deleting..." : "Delete"} 
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
                        <p className="text-sm text-slate-400">
                            Page <span className="font-semibold text-white">{currentpage}</span>
                            {" "}of{" "}
                            <span className="font-semibold text-white">{totalPages}</span>
                        </p>

                        <div className="flex gap-2">
                            <button
                                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={() => setcurrentpage((prev) => prev - 1)}
                                disabled={currentpage === 1}
                            >
                                Previous
                            </button>

                            <button
                                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={() => setcurrentpage((prev) => prev + 1)}
                                disabled={currentpage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
export default Home;