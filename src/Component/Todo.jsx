import React, { useEffect, useState } from 'react'
import './Todo.css';
import axios from 'axios';
const Todo = () => {
    const [newtask, setnewtask] = useState("")
    const [filter, setFilter] = useState("All")
    const [datas, setDatas] = useState([])
    const fetchTasks = async() => {
        const response = await axios.get("http://localhost:8080/api/task/gettasks")
        console.log(response.data);
        setDatas(response.data)
    }
    const add = async() => {
        try {
            if(newtask.length > 0){
                const response = await axios.post(`http://localhost:8080/api/task/addtask?taskname=${encodeURIComponent(newtask)}`)
                console.log(response.data);
                setDatas(prev => [...prev, newtask])
                setnewtask("")
                fetchTasks()
            }else{
                alert("Enter a valid task")
            }
        } catch (error) {
            console.log(error.response.data);
            
        }
    }

    const handleDelete = async(id) => {
        await axios.delete(`http://localhost:8080/api/task/deletetask/${id}`)
        fetchTasks(); 
    }

    const handleMark = async(id) => {
        const response = await axios.put(`http://localhost:8080/api/task/mark/${id}`)
        console.log(response.data);
        fetchTasks();
        
    }

    useEffect(()=>{
        fetchTasks();
    },[])



  return (
    <div className='todo'>
        <h1>Simple Todo</h1>
        <div className='todo_container'>
            <div className='todo_container-top'>
                <input className='todo_container-top-input' type="text" placeholder='Enter a task' value={newtask} onChange={(e)=>setnewtask(e.target.value)}/>
                <button className='todo_container-top-add' onClick={add}>Add</button>
            </div>
            <div class="todo_page-middle">
                <select className='select' onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
                {filter === "completed" ? (
                    datas.filter((item) => item?.completed).length > 0 ? (
                        datas.filter((item) => item?.completed)
                        .map((item, index) => (
                            <div className="todo_page-middle-tasks" key={index}>
                            <p className="task-content">{item?.taskName}</p>
                            <button className="task-delete" onClick={() => handleDelete(item?.id)}>Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>No completed tasks</p>
                    )
                    ) : filter === "pending" ? (
                    datas.filter((item) => !item?.completed).length > 0 ? (
                        datas.filter((item) => !item?.completed)
                        .map((item, index) => (
                            <div className="todo_page-middle-tasks" key={index}>
                            <p className="task-content">{item?.taskName}</p>
                            <button className="task-mark" onClick={() => handleMark(item?.id)}>Mark</button>
                            <button className="task-delete" onClick={() => handleDelete(item?.id)}>Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>No pending tasks</p>
                    )
                    ) : (
                    datas.length > 0 ? (
                        datas.map((item, index) => (
                        <div className="todo_page-middle-tasks" key={index}>
                            <p className="task-content">{item?.taskName}</p>
                            {
                                !item?.completed ? <button className="task-mark" onClick={() => handleMark(item?.id)}>Mark</button> : null
                            }
                            <button className="task-delete" onClick={() => handleDelete(item?.id)}>Delete</button>
                        </div>
                        ))
                    ) : (
                        <p>No tasks</p>
                    )
                    )}



            </div>
        </div>
    </div>
  )
}

export default Todo