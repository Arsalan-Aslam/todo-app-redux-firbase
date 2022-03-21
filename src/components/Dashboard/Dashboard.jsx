import React, {useState, useEffect} from 'react';
import styles from './Dashboard.module.css'
import { NavLink } from 'react-router-dom';
import Todo from '../Todo/Todo';
import {db} from "../../config/firebase";
import { collection, doc, query, where, onSnapshot, getDocs } from "firebase/firestore"; 
import Nav from '../Nav/Nav';


const Dashboard = ({logout}) => {
  const userID = localStorage.getItem("userID");
  const [userData, setUserData] = useState([])

  useEffect(async () => {
          const dbRef = collection(db, "users");
          const q = query(dbRef, where("userId", "==", userID));
          const data = await onSnapshot(q, (querySnapshot) => {
          // console.log(data);
          let getUser = [];
          querySnapshot.forEach((doc) => {
              getUser.push({
                  key: doc.id, 
                  email: doc.data().email,
                  name: doc.data().name,
                  phone: doc.data().phone,
                  userId: doc.data().userId
              });
          });
          console.table(getUser)
          setUserData(getUser);
          console.log(userData[0].name)
      })},[]);


  
  return (
    <>
    <Nav logout={logout}/>
    <h1 style={{marginTop:"10px"}}>Hello {userData[0]?.name}</h1>
    {/* <h1 style={{marginTop:"10px"}}>Dashboard</h1> */}
    <Todo />
    </>
  )
}

export default Dashboard;