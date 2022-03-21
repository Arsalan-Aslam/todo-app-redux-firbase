import React, { useState } from 'react';
import {Link} from "react-router-dom";
import {auth, db} from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [password, setPassword] = useState("");
    let userObj = {}
    const notifySignup = () => toast("Signed up successfully!");
    const navigate = useNavigate();

    // Sign up handler function
    const signupHandler = async(e) => {
        e.preventDefault();
        // console.log(name, email, phoneNum, password);
        // Create user using Firebase Auth
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // console.log(user);
                userObj = {name:name, email: email, phone: phoneNum, userId: user.uid};
                console.log(userObj)
                // Add the user to the Firestore DB
                addUser();
                notifySignup();
                setTimeout(()=>navigate("/"), 5000);
            })
            .catch((error) => {
                console.log(error);
            });
        setName("");
        setEmail(""); 
        setPhoneNum(""); 
        setPassword("");
    }

    // Function for adding User to Firestore DB

    const addUser = async () => {
        const docRef = collection(db, "users");
        const addUser = await addDoc(docRef, userObj);
        console.log("Document written with ID: ", addUser.id);
    }


  return (
    <>
    <div className={styles.container}>
      <form onSubmit={signupHandler}>
          <h1>Sign Up</h1>
          <input type="text" id="name" value={name} placeholder='Name' required onChange={(e)=>setName(e.target.value)} />
          <input type="email" id="email" value={email} placeholder='Email Address' required onChange={(e)=>setEmail(e.target.value)} />
          <input type="number" id="phone" value={phoneNum} placeholder='Phone Number' required onChange={(e)=>setPhoneNum(e.target.value)} />
          <input type="password" id="password" value={password} placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} />
          <button>Sign Up</button>
      </form>
      <p><Link to="/">Login instead</Link></p>
      <ToastContainer />
    </div>
    </>
  )
}

export default Signup;