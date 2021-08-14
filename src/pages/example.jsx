import React ,{useEffect, useState} from 'react';

function ToDo(){
    let [value,setValue] = useState("");
    let [taskList,setTask] = useState([]);
    
    function cleanup(){
        console.log("main cleanup")
    }
    const addTask = () =>{
        let newTaskList = [...taskList];
        newTaskList.push({
            id:Date.now(),
            task: value
        })
        setTask(newTaskList);
        setValue("");

    }
    const removeTask = (id) =>{
        console.log(id)
        let list = taskList.filter((object)=>{
            return object.id!=id
        })
        setTask(list);
    }
    //----------componentdidmount
    // useEffect(()=>{
    //     console.log("component did mount")
    //   return cleanup ----will run when component will unmount
    // },[])

    // -------------useEffect with dependency
    // useEffect(()=>{
    //     console.log("componentdidupdate");
    //     return cleanup;
    // },[taskList])


    //------------------whenever state changes
     useEffect(()=>{
            console.log("didupdate");
            return cleanup;
        })

    return(
        <>
        <div>
            <input placeholder="Enter Task" value={value} onChange={(e)=>{
                setValue(e.target.value);
            }}>
            </input>
            
            <button onClick={addTask}>ADD TASK</button>
        </div>

        <div>
            {taskList.map((obj)=>{
                return(
                    
                    <li key = {obj.id} onClick={()=>{
                        removeTask(obj.id)
                    }}>{obj.task}</li>
                )
            })
        }
        </div>
        </>
    )
}

export default ToDo