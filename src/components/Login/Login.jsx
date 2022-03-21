import React, { useState, useEffect } from 'react';
import {auth, db} from "../../config/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login = ({authenticate}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const [user, setUser] = useState(null);
    const notifyLogin = () => toast("Logged in successfully!");
    const navigate = useNavigate();
    
    
    const loginHandler = (e) => {
        e.preventDefault()
        console.log(email, password);
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user.uid);
            localStorage.setItem("userID", user.uid)
            authenticate();
            // ...
          })
          .catch((error) => {
            console.log(error);
          });
          setEmail("");
          setPassword("");
          notifyLogin();
          navigate("/Dashboard");
    }


    

  return (
    <>
    <div className={styles.container}>
      <form onSubmit={loginHandler}>
          <h1>Login</h1>
          <input type="email" id="email" value={email} placeholder='Email Address' required onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" id="password" value={password} placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} />
          <button>Login</button>
      </form>
      <p><Link to="/signup">Sign up instead</Link></p>
      <ToastContainer />
      

    </div>
    </>
  )
}

export default Login;
