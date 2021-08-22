import React,{useState,useContext,useEffect} from 'react'
import firebase from "../firebase"
import { AuthContext } from "../../src/context/AuthProvider"
import instaLoad from "../images/instaLoad.png"
import instaLogo from "../images/instaLogo.png"
import CustomizedButtons2 from './buttons'

const auth = firebase.auth();
function Login(props){
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [error,setError] = useState(false);
    let [loginLoader,setLoader] = useState(false);
    
    let {genericLogin,currentUser} = useContext(AuthContext)
    const loginFunc = async() =>{
        console.log('ran')
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
        left: "50%", transform: "translate(-50%, -50%)"}}src={instaLoad}/>
        </div>:currentUser?<h1>{currentUser.uid}
        <button
                        
                    >Logout</button></h1>:
        <div style={{height:"100vh",backgroundColor:"#FAFAFA"}}>
            <div className="login-box" style={{height:"62vh",width:"22rem",backgroundColor:"white",display:"flex",flexDirection:"column",
                    alignItems:"center",border:"0.5px solid lightgray",position:"fixed",right:"20rem",top:"5rem",}}>
                <div style={{marginBottom:"1.7rem"}} >
                    <img src={instaLogo}/>
                </div>
                    <div> 
                        <input style={{height:"1.6rem",width:"14rem",backgroundColor:"#FAFAFA",border:"0.5px solid lightgray",marginBottom:"0.5rem"}} type="email" placeholder="Enter Email" value={email} onChange={function(e){
                            setEmail(e.target.value)
                        }}/>

                    </div>

                    <div>
                        <input style={{height:"1.6rem",marginBottom:"1em", width:"14rem",backgroundColor:"#FAFAFA",border:"0.5px solid lightgray"}}type="password" placeholder="Enter Password" value={password} onChange={function(e){
                            setPassword(e.target.value)
                        }}/>

                    </div>
                        <div onClick={loginFunc}> 
                            <CustomizedButtons2 text={"login"}></CustomizedButtons2>
                        </div>
                    <div style={{fontSize:"12px",marginTop:"2rem"}}>Forgot password?</div>

                    <div style={{marginTop:"2rem"}}>
                        Dont have an account? <span style={{color:"#0095F6",}}>Sign Up</span>
                    </div>
                    {error?<h1>{error}</h1>:<></>}
                </div>
        </div>
    )
}

export default Login;