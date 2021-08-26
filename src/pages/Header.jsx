import insta from "../../src/images/instaLogo.png"
import {Link} from "react-router-dom"
import firebase, {database,storage} from "../firebase";

function Header(props){
    let {user} = props;
    const handleSignOut =(e)=>{
        firebase.auth().signOut();
    }

    let styled1 = {height:"7vh",
                  border:"1px solid lightgray",
                  
                  display:"flex",
                  flexDirection:"row",
                  alignItems:"center",
                  position:"relative",
                  fontFamily:"cursive",
                  zIndex:12,
                  backgroundColor:"white"
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
 export default Header