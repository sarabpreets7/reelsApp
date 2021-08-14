import React,{useState,useContext,useEffect} from 'react'
import firebase from "../firebase"
import { AuthContext } from "../../src/context/AuthProvider"

const auth = firebase.auth();
function Login(props){
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [error,setError] = useState(false);
    let [loginLoader,setLoader] = useState(false);
    
    let {genericLogin,currentUser} = useContext(AuthContext)
    const loginFunc = async() =>{
        try{
            setLoader(true);
            // let res = await auth.signInWithEmailAndPassword(email,password);
            // //console.log(res.user.uid);
            // setLoader(false);
            // setUserId(res.user.uid);
            // console.log(userid)

            await genericLogin(email,password);
            //setLoader(false);

        }
        catch(err){
            setLoader(false);
            setError(err.message);
            setTimeout(()=>{
                setError(false)
            },2000)
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
        loginLoader?<div style={{height:"100vh",width:"100%",background:"gray"}}>
        <img style={{height:"9rem",width:"9rem",color:"black",position:"fixed",top: "50%",
        left: "50%", transform: "translate(-50%, -50%)"}}src="instaLoad.png"/>
        </div>:currentUser?<h1>{currentUser.uid}
        <button
                        
                    >Logout</button></h1>:
        <div>
            <div> Email:
                <input type="email" placeholder="Enter Email" value={email} onChange={function(e){
                    setEmail(e.target.value)
                }}/>

            </div>

            <div> Password:
                <input type="password" placeholder="Enter Password" value={password} onChange={function(e){
                    setPassword(e.target.value)
                }}/>

            </div>

            <button onClick={loginFunc}>Login</button>
            {error?<h1>{error}</h1>:<></>}
        </div>
    )
}

export default Login;