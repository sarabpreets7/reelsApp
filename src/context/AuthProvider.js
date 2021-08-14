import React,{useState,useEffect} from "react";
import firebase from "firebase";

export const AuthContext = React.createContext();
const auth = firebase.auth();

export default function AuthProvider({children}){

    const [currentUser,setCurrentUser]= useState(null);
    const [loading,setLoading] = useState(true);
    
    async function genericLogin(email,password){
        return  auth.signInWithEmailAndPassword(email,password)
    }
    async function genericSignUp(email,password){
        return auth.createUserWithEmailAndPassword(email,password)
    }

    useEffect(()=>{
        console.log("useeffect ran");
        function action(user){
            console.log("line 18",user);
            setCurrentUser(user)
            setLoading(false)
        }
        auth.onAuthStateChanged(action)
    },[])

    const value = {
        genericLogin,
        genericSignUp,
        currentUser
    }
    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}