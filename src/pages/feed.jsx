import React,{useContext,useEffect,useState} from 'react'
import {AuthContext} from '../context/AuthProvider'
import firebase, {database,storage} from "../firebase";
import uuid from 'react-uuid'
import instaLoad from "../../src/images/instaLoad.png"
import insta from "../../src/images/instaLogo.png"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import "./feed.css"
import {Link} from "react-router-dom"
import LinearWithValueLabel from './load';
import ReactDOM from 'react-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AddCommentIcon from '@material-ui/icons/AddComment';
import MediaCard from './modal';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Comments from './comments';

function Feed(){

    let {currentUser} = useContext(AuthContext);
    let [user,setUser] = useState(null);
    let [loader,setLoader] = useState(true);
    


    function callBack(entries){
        console.log(entries)
    }
    useEffect( async()=>{
        let user = await database.users.doc(currentUser.uid).get()
        console.log("in feed: ",user.data());
        setUser(user.data()) 


        
        setLoader(false);
    },[])

    return(
        loader?<img src={instaLoad}></img>:
        <div style={{overflow:"hidden",boxSizing:"border-box",margin:"0"}}>
            <Header user = {user}></Header>
            <div style={{display:"flex"}}>
                <UploadButtons user={user} uid={currentUser.uid} ></UploadButtons>
                
            </div>
            
            {/* <Upload user={user} uid={currentUser.uid}> </Upload> */}
            <Reels user={user}></Reels>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
  }));
  
function UploadButtons(props) {
    const classes = useStyles();
    let [loadbar,setBar] = useState(false)
    let [stats,setStats] =  useState(0)
    const handleUpload =(e)=>{
        let file = e?.target?.files[0];
        if(file!=null){
            try{
                let ruid = uuid();
                console.log("ruid-",ruid);

                const uploadListener = storage.ref("/reels/"+ ruid).put(file);

                uploadListener.on("state_changed",onprogress,onerror,onsucess);
                function onprogress(snapshot){
                    setBar(true)
                    let progress = (snapshot.bytesTransferred/ snapshot.totalBytes)*100;
                    setStats(progress)
                    console.log(stats)
                    console.log(progress);
                }
                function onerror(err){
                    setBar(false)
                    console.log(err)
                }
                async function onsucess(){
                    setBar(false)
                    let downloadUrl = await uploadListener.snapshot.ref.getDownloadURL();
                    console.log("video with url",downloadUrl);

                    let {user,uid} = props;

                    database.reels.doc(ruid).set({
                        videoUrl:downloadUrl,
                        authorName: user.fullName,
                        authorDPUrl: user.profileUrl,
                        likes:[],
                        comments:[],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    })

                    let updatedReels= [...user.reels,ruid]
                    database.users.doc(uid).update({
                        reels : updatedReels,
                    })


                }
                
            }
            catch (err){

            }
        }
    }
    return (
        loadbar?<LinearWithValueLabel value={stats}></LinearWithValueLabel>:
      <div className={classes.root}>
        <input
          accept="video/*"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
          onChange={handleUpload}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Upload
          </Button>
        </label>
        {/* <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={handleUpload} />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
        </label> */}
        
        
      </div>
    );
  }


// function Upload(props){
//     const handleUpload =(e)=>{
//         let file = e?.target?.files[0];
//         if(file!=null){
//             try{
//                 let ruid = uuid();
//                 console.log("ruid-",ruid);

//                 const uploadListener = storage.ref("/reels/"+ ruid).put(file);

//                 uploadListener.on("state_changed",onprogress,onerror,onsucess);
//                 function onprogress(snapshot){
//                     let progress = (snapshot.bytesTransferred/ snapshot.totalBytes)*100;
//                     console.log(progress);
//                 }
//                 function onerror(err){
//                     console.log(err)
//                 }
//                 async function onsucess(){
//                     let downloadUrl = await uploadListener.snapshot.ref.getDownloadURL();
//                     console.log("video with url",downloadUrl);

//                     let {user,uid} = props;

//                     database.reels.doc(ruid).set({
//                         videoUrl:downloadUrl,
//                         authorName: user.fullName,
//                         authorDPUrl: user.profileUrl,
//                         likes:[],
//                         comments:[],
//                         createdAt: firebase.firestore.FieldValue.serverTimestamp()
//                     })

//                     let updatedReels= [...user.reels,ruid]
//                     database.users.doc(uid).update({
//                         reels : updatedReels,
//                     })


//                 }
                
//             }
//             catch (err){

//             }
//         }
//     }

//     return(
//         <div>
//             <div>
//                 <input type="file" accept="video/*" onChange={handleUpload}/>
//             </div>
//         </div>
//     )
// }
function Reels(props){
    let [reels,setReels] = useState([]);
    let [liked,setLike] = useState(false)
    let [totalLikes,handleLikes] = useState(0)
    let {currentUser} = useContext(AuthContext);
    let [comment,updateComment] = useState("")
    const [openId, setOpenId] = useState(null);
    let uid = currentUser.uid;
    
    let user = props
    
    
    const handleMuted = async(e)=>{
        console.log("hhhhh"+e)
        e.target.muted = !e.target.muted;
    }
    const handleLike = async (tar)=>{
        let likel = document.getElementById(tar+"like")
        let no = parseInt(likel.innerText.split(" ")[0])
        console.log(no)
        
       
        let el = await document.getElementById(tar+"heart")
        console.log(el)
        let reel = await database.reels.doc(tar).get()
        let likes = reel.data().likes
        console.log(likes)
        if(likes.includes(uid) && likes.length!=0){
            let newlikes = likes.filter(function(data){
                return data!=uid
            })
            database.reels.doc(tar).update({
                "likes":[...newlikes]
            })
            
            el.style.color="lightgray"
            no--;

        }

        else{
            database.reels.doc(tar).update({
                "likes":[...likes,uid]
            })
            el.style.color="red"
            no++;
            
        }
        likel.innerText= no+" likes"
        

        
    }
    const handleAutoScroll= async(e)=>
 {
   console.log(e.target);
  //  console.log(ReactDOM.findDOMNode(e.target).parentNode.nextSibling)
   let next = ReactDOM.findDOMNode(e.target).parentNode.parentNode.parentNode.nextSibling;
   console.log(next)
   if(next)
   {
       console.log("next exist")
    //  window.scrollTop(next).offset().top();
    next.scrollIntoView({behavior:'smooth'});
    e.target.muted=true;
   }
 }
 const handleClickOpen = (id) => {
    setOpenId(id);
  }
  const handleClose = () => {
    setOpenId(null);
  };
 
 function callBack(entries){
     //console.log(entries)
     entries.forEach((entry)=>{
         
         let child = entry.target.children[0]
         child.play().then(function(){
             if(entry.isIntersecting==false){
                 child.pause()
             }
         })
     })
    //  let entry = entries[0].target;
    // entries[0].play()
    //  console.log(entry)
    // entry.play().then(function(){
    //     if(entries[0].isIntersecting==false){
    //         entry.pause()
    //     }
    // })
}
 const handleComment =(e)=>{
     
     
     updateComment(e.target.value)

 }
 const handlePost =async(e)=>{
     updateComment("")
     console.log(e.target)
    let id= await (e.target.parentNode.id)
    console.log(id)
    if(id){
        let reel = await database.reels.doc(id).get();
    let comments = reel.data().comments
    let profileurl = (user.user.profileUrl)
    let name = (user.user.fullName)
    let newcmmt = {"name": name,"comment":comment,"dpurl":profileurl}
    console.log(comments)
    database.reels.doc(id).update({
        
        "comments":[...comments,newcmmt]
    })
    }
    
    

    
 }
    useEffect(async function fn(){
        let entries = await database.reels.orderBy("createdAt","desc").get();
        let arr=[];
        entries.forEach((entry) => {
            console.log(entry.id)
            let newentry = entry.data();
           // console.log(newentry.likes.length)

           let obj={"id":entry.id,"object":newentry}
            arr.push(obj);
        })
        console.log(arr)
        setReels(arr);

        let conditionObject = {
            root:null,
            threshold:"0.9"
        }
        let observer = new IntersectionObserver(callBack,conditionObject);
        let elements = document.querySelectorAll(".video");
        console.log(elements)
        elements.forEach((el)=>{
            observer.observe(el)
        })
        
    },[])
    
     
    return(
        <div style={{backgroundColor:"#FAFAFA"}}>
            <div className="reels" style={{
                height:"90vh",
                boxShadow:"10px 5px 5px gray",
                overflow:"auto",
                
                
            }}>

                {reels.map(function(object){
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
                                <img style={{height:"30px",background:"transparent",objectFit:"contain",borderRadius:"50%",marginRight:"0.5rem"}} src={object.object.authorDPUrl} />
                                <div style={{width:"50%"}}>
                                    {object.object.authorName}
                                </div>
                                <div style={{display:"flex",width:"50%",flexDirection:"row-reverse"}}>
                                    {user.user.profileUrl?user.user.profileUrl!=object.object.authorDPUrl?
                                  <Button  variant="contained" color="primary" >follow</Button>:<></>:<></>}
                                  
                                </div>
                                
                            </div>

                            <div style={{height:"90%",display:"flex", justifyContent:"center",borderTop:"0.25px solid lightgray"}}>

                                <div className="video" style={{height:"80%"}}>
                                    <video style={{
                                    height:"90%",
                                    width:"100%",
                                    

                                    }} src={object.object.videoUrl}
                                    id = {object.id}
                                    onEnded={handleAutoScroll}
                                    muted="muted"
                                    
                                    onClick={handleMuted}
                                    ></video>
                                </div>
                                <div style={{position:"absolute",bottom:"4rem",left:"2%"}}>
                                    <div>
                                       
                                        <FavoriteIcon id={object.id+"heart"} className="heart" onClick={()=>{handleLike(object.id)}}  style={object.object.likes.includes(currentUser.uid)?{color:"red"}:{color:"lightgray"}} ></FavoriteIcon>
                                        <AddCommentIcon className="comment" color="primary" onClick={() => handleClickOpen(object.id)} style={{color:'lightgray',position:"absolute"}}></AddCommentIcon>
                                    <Dialog maxWidth="md" onClose={handleClose} aria-labelledby="customized-dialog-title" open={openId === object.id}>
                                                <MuiDialogContent>
                                                <div className="modal" style={{display:"flex",height:"80vh",width:"60vw"}}>
                                                    <div className="video-container" style={{width:"50%"}}>
                                                        <video controls={true} src={object.object.videoUrl} style={{width:"90%",height:"100%"}}></video>
                                                    </div>

                                                    <div style={{width:"50%"}} className="comment-section">
                                                        <div className="authordiv" style={{display:"flex",alignItems:"center",width:"100%",borderBottom:"1px solid lightgray"}}>
                                                             <img style={{height:"4rem",background:"transparent",objectFit:"contain",borderRadius:"50%",marginRight:"3.4rem",margin:"1.2rem"}} src={object.object.authorDPUrl} />
                                                            <div style={{width:"50%"}}>
                                                                {object.object.authorName}
                                                            </div>
                                                        </div>

                                                        <div className="commentss" style={{height:"65%",overflowY:"auto"}}>
                                                        {
                                                                object.object.comments.length==0?
                                                                <div>
                                                                    <h2>No comments yet...</h2>
                                                                </div>:
                                                                object.object.comments.map((comment)=>(
                                                                <div className='comment-div' style={{display:"flex",alignItems:"center"}}>
                                                                    {/* <Avatar src={comment.uUrl}  className={classes.da}/> */}
                                                                    <img style={{height:"2.3rem",background:"transparent",objectFit:"contain",borderRadius:"50%",marginRight:"3.4rem",margin:"1.2rem"}} src={comment.dpurl} /><p><span style={{fontWeight:'bold',display:'inline-block'}}>{comment.name}</span>&nbsp;&nbsp;{comment.comment}</p>
                                                                </div>
                                                                ))
                                                            
                                                                }
                                                           
                                                        </div>
                                                        <div className="comment-section" style={{width:"100%",display:"flex",alignItems:"center"}}>
                                                            <TextField  onChange={handleComment} value={comment} style={{width:"75%"}}label="Add a Comment"></TextField>
                                                            <Button id={object.id} onClick={handlePost} variant="contained">POST</Button>
                                                        </div>

                                                    </div>
                                                    

                                                </div>
                                                    
                                                
                                        </MuiDialogContent>
                                    </Dialog>
                                    </div>
                                    
                                    <span id={object.id+"like"} className="likess" style=
                                    {{marginRight:"1rem"}}>{object.object.likes.length} likes</span>
                                    <span>{object.object.comments.length} comments</span>
                                </div>
                               
                                
                            </div>
                            
                        </div>
                    )
                })}



            </div>
        </div>
    )
    
}
function Header(props){
    let {user} = props;

    const handleSignOut =(e)=>{
        firebase.auth().signOut();
    }

    let styled1 = {height:"7vh",
                  border:"1px solid lightgray",
                  boxShadow:"10px 5px 5px lightgray",
                  display:"flex",
                  flexDirection:"row",
                  alignItems:"center",
                  position:"relative",
                  fontFamily:"cursive"
                };

    

    return(
        <div style={styled1}>
            
            <Link to="/feed" style={{height:"100%",alignSelf:"flex-start",position:"absolute",left:"10rem",display:"flex",alignItems:'center',}}>
             <img style={{height:"100%",background:"transparent",objectFit:"contain"}} src={insta} />
            </Link>

            <div to="/profile" style={{display:"flex", textDecoration:"none",height:"100%",width:"22%",alignItems:"center", position:"absolute",right:"9rem"}}>
                <Link to="/profile" style={{display:"flex",alignItems:"center",textDecoration:"none",color:"black"}}>
                <div style={{marginRight:"10px"}}>{user?.fullName}</div>
                    <img style={{
                        height:"40px",
                        borderRadius:"55%",
                        marginRight:"15px",
                        
                    }} src= {user?.profileUrl}></img>
                    </Link>

                <div onClick={handleSignOut} className="logout">
                    Log out
                </div>
                
            </div>
            
                    
            
        </div>
    )
}
// export default Header

export default Feed