import {API_URL} from "./config";

export async function getTasks() {
    try{
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/tasks`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if(!response.ok){
        throw new Error("Failed to fetch tasks")
    }
    const data = await response.json();
    console.log(data);
    return data;
    } catch(error){
        throw new Error("Error fetching tasks: " + error.message);
    }
}
export async function postTasks(taskData) {
    try{ 
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    });
    if(!response.ok){
        throw new Error("Failed to post task")
    }
    const data = await response.json();
    console.log(data);
    return data;
    } catch(error){
        throw new Error("Error posting task: " + error.message);
    }
} 
export async function deleteTasks(id) {
    try{
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE"
        });
        if(!response.ok){
            throw new Error("Failed to delete task")
        }
        return true;
    }catch(error){
        throw new Error("Error deleting task: " + error.message);
    }
}
export async function updateTasks(updatedData) {
    try{
        const response = await fetch(`${API_URL}/tasks/${updatedData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });
        if(!response.ok){
            throw new Error("Failed to update task")
        }
        const data = await response.json();
        console.log(data);
        return data;
    }catch(error){
        throw new Error("Error updating task: " + error.message);
    }
}