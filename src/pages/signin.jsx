import React from 'react'
import {useState,useContext,useEffect} from 'react'
import {AuthContext} from "../context/AuthProvider"
import {storage,database} from "../../src/firebase"
import instaLogo from "../images/instaLogo.png"
import instaLoad from "../images/instaLoad.png"
import CustomizedButtons2 from './buttons'
import {Link} from "react-router-dom"

function SignIn(props){
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [error,setError] = useState(false);
    let [loader,setLoader] = useState(true);
    let [fullName,setName] = useState("");
    const[file,setFile] = useState(null);
    let {genericSignUp,currentUser} = useContext(AuthContext);

    const handleMail =(e)=>{
        
        setEmail(e.target.value)
    }
    const handlePassword =(e)=>{
        
        setPassword(e.target.value)
    }
    const handleName =(e)=>{
        
        setName(e.target.value)
    }
    const handleUpload=(e)=>{
        let file = e?.target?.files[0];
        if(file!=null){
            setFile(file)
        }
    }
    const handleSignUp = async(e)=>{
        try{
            setError("");
            setLoader(true)

            let userCredential = await genericSignUp(email,password)
            let uid = userCredential.user.uid;

            console.log("--------",uid);

            const uploadListener = storage.ref("/users/"+uid).put(file);
            uploadListener.on("state_changed",onprogress,onerror,onsucess);
            function onprogress(snapshot){
                let progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                console.log(progress);
            }

            function onerror(err){
                console.log(err)
            }
            async function onsucess(){
                let downloadUrl = await uploadListener.snapshot.ref.getDownloadURL()

                database.users.doc(uid).set({
                    email: email,
                    fullName: fullName,
                    profileUrl: downloadUrl,
                    followers:[],
                    following:[],
                    reels: [],
                    likes: [],
                    comments: []
                })

            }
        }
        catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        if (currentUser) {
            // send to feed page
            // loggedIN 
            props.history.push('/feed');
        }
    },)
    useEffect(()=>{
        setLoader(false);
    },[])
    
    return(
        loader?<div style={{height:"100vh",width:"100%",background:"gray"}}>
        <img style={{height:"9rem",width:"9rem",color:"black",position:"fixed",top: "50%",
        left: "50%", transform: "translate(-50%, -50%)"}}src={instaLoad}/>
        </div>:
        <div style={{height:"100vh",backgroundColor:"#FAFAFA"}}>
            <div className="signUp-box" style={{height:"68vh",width:"22rem",backgroundColor:"white",display:"flex",flexDirection:"column",
                    alignItems:"center",border:"0.5px solid lightgray",position:"fixed",top: "50%",
                    left: "50%", transform: "translate(-50%, -50%)"}}>
                        <div style={{marginBottom:"1.7rem"}} >
                            <img src={instaLogo}/>
                        </div>
                    <div>
                        <input type="email" style={{borderRadius:"3px" ,fontSize:"12px", height:"1.8rem",width:"14rem",backgroundColor:"#FAFAFA",border:"0.5px solid lightgray",marginBottom:"0.5rem"}} value={email} placeholder="Email" onChange={handleMail}></input>
                    </div>

                    <div>
                        <input style={{borderRadius:"3px" ,fontSize:"12px",height:"1.8rem",width:"14rem",backgroundColor:"#FAFAFA",border:"0.5px solid lightgray",marginBottom:"0.5rem"}} type="password" value={password} placeholder="Password" onChange={handlePassword}></input>
                    </div>

                    <div>
                        <input style={{borderRadius:"3px" ,fontSize:"12px",height:"1.8rem",width:"14rem",backgroundColor:"#FAFAFA",border:"0.5px solid lightgray",marginBottom:"0.8rem"}} type="text"  value={fullName} placeholder="Full Name" onChange={handleName}></input>
                    </div> 

                    <div>
                        <input style={{marginBottom:"0.9rem"}} type="file" accept="image/*" onChange={handleUpload}></input>
                    </div>
                    
                    <div onClick={handleSignUp}>
                        <CustomizedButtons2 text={"Sign up"}></CustomizedButtons2>
                        
                    </div>

                    <div style={{marginTop:"2rem"}}>
                        Have an account?<Link to="/login" style={{textDecoration:"none"}}><span style={{color:"#0095F6",}}>Log in</span></Link> 
                    </div>
            </div>
        </div>
    )
}

export default SignIn