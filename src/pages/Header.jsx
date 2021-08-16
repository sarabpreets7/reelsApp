import insta from "../../src/images/instaLogo.png"
function Header(props){
    let {user} = props;

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
 export default Header