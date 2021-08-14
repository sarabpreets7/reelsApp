import React,{useContext,useEffect,useState} from 'react'
import {AuthContext} from '../context/AuthProvider'
import firebase, {database,storage} from "../firebase";
import uuid from 'react-uuid'
import instaLoad from "../../src/images/instaLoad.png"
import insta from "../../src/images/instaLogo.png"
function Feed(){

    let {currentUser} = useContext(AuthContext);
    let [user,setUser] = useState(null);
    let [loader,setLoader] = useState(true);

    useEffect( async()=>{
        let user = await database.users.doc(currentUser.uid).get()
        console.log("in feed: ",user.data());
        setUser(user.data()) 
        setLoader(false);
    },[])

    return(
        loader?<img src={instaLoad}></img>:
        <div>
            <Header user = {user}></Header>
            <Upload user={user} uid={currentUser.uid}> </Upload>
            <Reels></Reels>
        </div>
    )
}
function Upload(props){
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

    return(
        <div>
            <div>
                <input type="file" accept="video/*" onChange={handleUpload}/>
            </div>
        </div>
    )
}
function Reels(){
    let [reels,setReels] = useState([]);

    const handleMuted = function(e){
        e.target.muted = !e.target.muted;
    }
    useEffect(async ()=>{
        let entries = await database.reels.orderBy("createdAt","desc").get();
        let arr=[];
        entries.forEach((entry) => {
            let newentry = entry.data();
            arr.push(newentry);
        })
        setReels(arr);
        
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
                                <div>
                                    {object.authorName}
                                </div>
                                
                            </div>

                            <div style={{height:"90%",display:"flex", justifyContent:"center",borderTop:"0.25px solid lightgray"}}>

                            <div className="video" style={{height:"90%"}}>
                                <video style={{
                                height:"90%",
                                width:"100%",
                                

                                }} src={object.videoUrl} autoPlay={true}
                                muted={true}
                                controls={true}
                                onClick={handleMuted}
                                autoPlay={true}></video>
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
            
            <span style={{height:"100%",alignSelf:"flex-start",position:"absolute",left:"10rem",display:"flex",alignItems:'center',}}>
             <img style={{height:"100%",background:"transparent",objectFit:"contain"}} src={insta} />
            </span>

            <div style={{display:"flex", height:"100%",width:"22%",alignItems:"center", position:"absolute",right:"9rem"}}>
                <div style={{marginRight:"10px"}}>{user?.fullName}</div>
                    <img style={{
                        height:"40px",
                        borderRadius:"55%",
                        marginRight:"15px",
                        
                    }} src= {user?.profileUrl}></img>
            </div>
                    
            
        </div>
    )
}

export default Feed