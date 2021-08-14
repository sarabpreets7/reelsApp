import logo from './logo.svg';
import './App.css';
import Login from './pages/login';
import ToDo from './pages/example';
import Profile from './pages/profile';
import SignIn from './pages/signin';
import Feed from './pages/feed';
import AuthProvider from "../src/context/AuthProvider";
import { Switch, Route, Redirect } from "react-router-dom";
import { AuthContext } from "../src/context/AuthProvider";
import { useContext } from "react";

function App() {
  return (
   <>
   <AuthProvider>
     <Switch>
       <Route path="/login" component={Login}/>
       <Route path="/signin" component={SignIn}/>
       <ProtectedRoute path="/feed" abc={Feed} />
       <ProtectedRoute path="/profile" abc={Profile} />
       <Redirect path="/" to="/feed"></Redirect>

     </Switch>
   </AuthProvider>
   </>
  );
}
function ProtectedRoute(props) {
  // use 
  let { currentUser } = useContext(AuthContext);
  let Component = props.abc;
  return (<Route {...props} render={(props) => {
    // console.log(isAuthenticated);
    return (currentUser?
    <Component {...props} ></Component> : 
    <Redirect to="/login"></Redirect>
    )
  }}></Route>
  )
}

export default App;
