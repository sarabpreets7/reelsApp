import React,{useState,useContext,useEffect} from 'react'
import firebase from "../firebase"
import { AuthContext } from "../../src/context/AuthProvider"
import instaLoad from "../images/instaLoad.png"
import instaLogo from "../images/instaLogo.png"
import CustomizedButtons2 from './buttons'
import {Link} from "react-router-dom"
import "./login.css"
import Img1 from '../Assets/img1.jpg'
import Img2 from '../Assets/img2.jpg'
import Img3 from '../Assets/img3.jpg'
import Img4 from '../Assets/img4.jpg'
import Img5 from '../Assets/img5.jpg'
import Insta from '../Assets/insta.png'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InstaLogo from '../Assets/Instagram.JPG'
import { CarouselProvider, Slider, Slide, Image } from 'pure-react-carousel';

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
    //     <div className='login-container'>
    //                <div className='imgcar' style={{ backgroundImage: `url(` + Insta + `)`, backgroundSize: 'cover' }}>
    //     <div className='caro'>
    //       <CarouselProvider
    //         visibleSlides={1}
    //         totalSlides={5}
    //         step={3}
    //         naturalSlideWidth={238}
    //         naturalSlideHeight={423}
    //         hasMasterSpinner
    //         isPlaying={true}
    //         infinite={true}
    //         dragEnabled={false}
    //         touchEnabled={false}
    //       >
    //         <Slider>
    //           <Slide index={0}>
    //             <Image src={Img1} />
    //           </Slide>
    //           <Slide index={1}>
    //             <Image src={Img2} />
    //           </Slide>
    //           <Slide index={2}>
    //             <Image src={Img3} />
    //           </Slide>
    //           <Slide index={3}>
    //             <Image src={Img4} />
    //           </Slide>
    //           <Slide index={4}>
    //             <Image src={Img5} />
    //           </Slide>
    //         </Slider>

    //       </CarouselProvider>
    //     </div>
    //   </div>
    //     </div>
    
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
                        Dont have an account?<Link to="/signin" style={{textDecoration:"none"}}><span style={{color:"#0095F6",}}>Sign Up</span></Link> 
                    </div>
                    {error?<h1>{error}</h1>:<></>}
                </div>
        </div>
    )
}

export default Login;