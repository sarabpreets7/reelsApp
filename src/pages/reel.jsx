import React,{useContext,useEffect,useState} from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Button from '@material-ui/core/Button';

import firebase, {database,storage} from "../firebase";
import {AuthContext} from '../context/AuthProvider'

async function SingleReel(props){
    let [liked,setLike] = useState(false)
    let[likes,setLikes] = useState(0)
    let [reel,setReel] = useState({})
    let [uid,setuid] = useState(null)
    let [User,setUser] = useState(null)


    useEffect(function(){
        let user=props.user
        setUser(user)
    //console.log(props)
    let object = props.object
    setReel(object)
    console.log(reel)
    let currentUser = props.currentUser;
    let uid = currentUser.uid;
    setuid(uid)
    setLikes(object.object.likes.length)


    },[])
    
    const handleMuted = async(e)=>{
        console.log("hhhhh"+e)
        e.target.muted = !e.target.muted;
    }
    const handleLike = async (e,tar)=>{
        console.log(e)
        let reel = await database.reels.doc(e).get()
        let likes = reel.data().likes
        console.log(likes)
        if(likes.includes(uid) && likes.length!=0){
            let newlikes = likes.filter(function(data){
                return data!=uid
            })
            database.reels.doc(e).update({
                "likes":[...newlikes]
            })
            setLike(!liked)

        }

        else{
            database.reels.doc(e).update({
                "likes":[...likes,uid]
            })
            setLike(!liked)
        }
        

        
    }

    console.log(props)
    return(
        <div className="video-container" style={{
            display:"flex",
           justifyContent:"center",
           height:"80vh",
           width:"30rem",
           backgroundColor:"white",
           border:"0.5px solid lightgray",
           marginBottom:"3rem",
           flexDirection:"column",
           marginLeft:"17rem",
           position:"relative"
            }}>
            <div className="header" style={{alignItems:"center",display:"flex",margin:"0.6rem",fontFamily:"cursive"}}>
                <img style={{height:"30px",background:"transparent",objectFit:"contain",borderRadius:"50%",marginRight:"0.5rem"}} src={reel.object.authorDPUrl} />
                <div style={{width:"50%"}}>
                    {reel.object.authorName}
                </div>
                <div style={{display:"flex",width:"50%",flexDirection:"row-reverse"}}>
                    {User.profileUrl?User.profileUrl!=reel.object.authorDPUrl?
                  <Button  variant="contained" color="primary" >follow</Button>:<></>:<></>}
                  
                </div>
                
            </div>

            <div style={{height:"90%",display:"flex", justifyContent:"center",borderTop:"0.25px solid lightgray"}}>

                <div className="video" style={{height:"80%"}}>
                    <video style={{
                    height:"90%",
                    width:"100%",
                    

                    }} src={reel.object.videoUrl}
                    id = {reel.id}
                    // onEnded={handleAutoScroll}
                    muted="muted"
                    controls={true}
                    onClick={handleMuted}
                    ></video>
                </div>
                <div style={{position:"absolute",bottom:"16%",left:"2%"}}>
                    <FavoriteIcon className="heart" onClick={()=>{handleLike(reel.id,this)}} style={{color:'lightgray'}}></FavoriteIcon>
                    <AddCommentIcon className="comment" color="primary" style={{color:'lightgray',position:"absolute"}}></AddCommentIcon>
                    <span>{likes}</span>
                </div>
               
                
            </div>
            
        </div>

    )
}


export default SingleReel;