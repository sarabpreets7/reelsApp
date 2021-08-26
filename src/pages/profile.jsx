import React,{useContext,useEffect,useState} from 'react'
import {AuthContext} from '../context/AuthProvider'
import firebase, {database,storage} from "../firebase";
import instaLoad from "../images/instaLoad.png"
import Header from './Header';
import MovieFilterOutlinedIcon from '@material-ui/icons/MovieFilterOutlined';
import Button from '@material-ui/core/Button';
import MediaCard from './video';
import CardMedia from '@material-ui/core/CardMedia';
import VideoPlayer from "react-video-js-player"
import { object } from 'prop-types';


function Profile(){
    let {currentUser} = useContext(AuthContext);
    let [user,setUser] = useState(null);
    let [loader,setLoader] = useState(true);
    let [reels,setReels] = useState([])
    let [profile,setProfile] = useState(null);
    let[followers,setFollowers] = useState(0);
    let[following,setFollowing] = useState(0);
    let [boolean,setBoolean] = useState(false)

    useEffect( async()=>{
        let user = await database.users.doc(currentUser.uid).get()
        console.log(currentUser.uid)
        //console.log("in feed: ",user.data());
        await setUser(user.data()) 
        setFollowers(user.data().followers)
        setFollowing(user.data().following)
        await setProfile(user.data().profileUrl);
        
        let reels = (user.data().reels);
        let arr = [];
        console.log(reels)
        for(let i=0;i<reels.length;i++){
            
            let reel = await database.reels.doc(reels[i]).get();
            arr.push(reel.data().videoUrl)
        }
        console.log(arr)
        setReels(arr)
        setLoader(false);
        
    },[])

    const handleClick =(e)=>{
        if(!boolean){
            let n = followers +1
            database.users.doc(currentUser.uid).update({
                followers:n
            })
            setBoolean(true);
        }
        else{
            let n = followers -1
            database.users.doc(currentUser.uid).update({
                followers:n
            })
            setBoolean(false)
        }
        
       
    }
    return(
        loader?<div style={{height:"100vh",width:"100%",background:"gray"}}>
        <img style={{height:"9rem",width:"9rem",color:"black",position:"fixed",top: "50%",
        left: "50%", transform: "translate(-50%, -50%)"}}src={instaLoad}/>
        </div>:
        <div >
            <Header user={user}/>
        <div style={{height:"100vh",backgroundColor:"#FAFAFA",display:"flex",flexDirection:"column",alignItems:"center"}}>
            
            <div className="header" style={{display:"flex",backgroundColor:"#FAFAFA",width:"55%",height:"14rem",alignItems:"stretch"}}>

                <div className="profile-pic">
                    <img style={{height:"70%",borderRadius:"50%",marginTop:"15%"}}src={profile}></img>
                </div>

                <div style={{height:"60%",width:"18rem",marginTop:"2rem",marginLeft:"19%",display:"flex",flexDirection:"column",justifyContent:"space-around"}}>
                    <div style={{display:"flex",justifyContent:"space-around"}}>
                            <div style={{fontSize:"24px",fontFamily:"Arial",fontWeight:"200"}}>
                                {user.fullName}
                            </div>
                            <div>
                            <Button size="small" variant="contained" color="primary" onClick={handleClick}>
                              {boolean?<span>unfollow</span>:<span>follow</span>}
                            </Button>
                            </div>
                    </div>

                    
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div>
                            <span style={{fontWeight:"600"}}>{reels.length}</span> posts
                        </div>

                        <div>
                            <span style={{fontWeight:"600"}}>{followers}</span> followers
                        </div>

                        <div>
                            <span style={{fontWeight:"600"}}>{following}</span> following
                        </div>
                        
                           

                    </div>

                    <div style={{fontWeight:"600",fontSize:"16px"}}>
                        {user.email}
                    </div>

                    </div>
                    
                </div>
                <hr style={{border:"0.3px solid lightgray",width:"72%"}}></hr>
            <div style={{width:"72%",dislpay:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",margin:"9px"}}>
                
                <div style={{display:"flex",width:"20%",justifyContent:"center",alignItems:"center"}}>
                    <MovieFilterOutlinedIcon/><span style={{marginLeft:"7px",fontSize:"12px",letterSpacing:"1px",fontWeight:"500"}}><u>REELS</u></span>
                </div>
                
            </div>
            <div style={{backgroundColor:"#FAFAFA",width:"72%",display:"flex",flexWrap:"wrap"}}>
               {reels.map(function(obj){
                   return(
                       
                       <div style={{height:"16rem",width:"30%",margin:"10px"}}className="reel-container">
                           <video style={{height:"100%",width:"100%"}} src={obj}/>
                           {/* <MediaCard component="video" style={{height:"100%",width:"100%"}} src={obj} autoPlay></MediaCard> */}
                           {/* <VideoPlayer type= 'video/mp4' src={obj} poster={instaLoad}></VideoPlayer> */}
                       </div>
                   )
               })}

            </div>
            </div>

           
        </div>

        
    )
}

function DisplayReels(props){

    let reels = props;

    return(
        <div style={{backgroundColor:"red",width:"75%"}}>

        </div>
    )
}

export default Profile