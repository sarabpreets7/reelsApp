import React from 'react'
import {useState,useContext,useEffect} from 'react'
import {AuthContext} from "../context/AuthProvider"
import {storage,database} from "../../src/firebase"
function SignIn(props){
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [error,setError] = useState(false);
    let [loginLoader,setLoader] = useState(false);
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
    
    return(
        <div>
            <div>
                <input type="email"  value={email} placeholder="Enter Email" onChange={handleMail}></input>
            </div>

            <div>
                <input type="password" value={password} placeholder="Enter Password" onChange={handlePassword}></input>
            </div>

            <div>
                <input type="text"  value={fullName} placeholder="Enter Full Name" onChange={handleName}></input>
            </div> 

            <div>
                <input type="file" accept="image/*" onChange={handleUpload}></input>
            </div>
            
            <div>
                <input type="button" onClick={handleSignUp} value="Sign Up"></input>
            </div>
        </div>
    )
}

export default SignIn