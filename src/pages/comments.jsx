import { useState } from "react";


function Comments(props){

    let[commentz,setcmnt] = useState([])
    let comments = props.comments;
    console.log(comments)
    let list=[]
    for(let i=0;i<comments.length;i++){
       let Comment= (<div>
            <span>comments[i].name</span>
            <span>comments[i].comment</span>
        </div>)
        list.push(Comment)

    }
    setcmnt(list)
    console.log(commentz)
    return(
        <div>
            
        </div>
    )
}

export default Comments