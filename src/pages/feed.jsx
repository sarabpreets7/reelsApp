import React,{useContext,useEffect,useState} from 'react'
import {AuthContext} from '../context/AuthProvider'
import firebase, {database,storage} from "../firebase";
import uuid from 'react-uuid'
import instaLoad from "../../src/images/instaLoad.png"
import insta from "../../src/images/instaLogo.png"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import "./feed.css"
import {Link} from "react-router-dom"

import ReactDOM from 'react-dom';


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
            <UploadButtons user={user} uid={currentUser.uid} ></UploadButtons>
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
  
    const handleUpload =(e)=>{
        let file = e?.target?.files[0];
        if(file!=null){
            try{
                let ruid = uuid();
                console.log("ruid-",ruid);

                const uploadListener = storage.ref("/reels/"+ ruid).put(file);

                uploadListener.on("state_changed",onprogress,onerror,onsucess);
                function onprogress(snapshot){
                    let progress = (snapshot.bytesTransferred/ snapshot.totalBytes)*100;
                    console.log(progress);
                }
                function onerror(err){
                    console.log(err)
                }
                async function onsucess(){
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
    let user = props
    
    const handleMuted = async(e)=>{
        console.log("hhhhh"+e)
        e.target.muted = !e.target.muted;
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
    useEffect(async function fn(){
        let entries = await database.reels.orderBy("createdAt","desc").get();
        let arr=[];
        entries.forEach((entry) => {
            let newentry = entry.data();
            arr.push(newentry);
        })
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
                           marginLeft:"17rem"
                        }}>
                            <div className="header" style={{alignItems:"center",display:"flex",margin:"0.6rem",fontFamily:"cursive"}}>
                                <img style={{height:"30px",background:"transparent",objectFit:"contain",borderRadius:"50%",marginRight:"0.5rem"}} src={object.authorDPUrl} />
                                <div style={{width:"50%"}}>
                                    {object.authorName}
                                </div>
                                <div style={{display:"flex",width:"50%",flexDirection:"row-reverse"}}>
                                    {user.user.profileUrl?user.user.profileUrl!=object.authorDPUrl?
                                  <Button  variant="contained" color="primary" >follow</Button>:<></>:<></>}
                                  
                                </div>
                                
                            </div>

                            <div style={{height:"90%",display:"flex", justifyContent:"center",borderTop:"0.25px solid lightgray"}}>

                                <div className="video" style={{height:"90%"}}>
                                    <video style={{
                                    height:"90%",
                                    width:"100%",
                                    

                                    }} src={object.videoUrl}
                                    onEnded={handleAutoScroll}
                                    muted="muted"
                                    controls={true}
                                    onClick={handleMuted}
                                    ></video>
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