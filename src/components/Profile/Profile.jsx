import React,{useState, useEffect} from 'react';
import { NavLink } from "react-router-dom";
import {db} from '../../config/firebase';
import { collection, deleteDoc, getDocs, doc, query, where, onSnapshot, updateDoc } from "firebase/firestore";
import Nav from '../Nav/Nav';
import styles from './Profile.module.css';

const Profile = ({logout}) => {
  const userID = localStorage.getItem("userID");
  const [todoArray, setTodoArray] = useState([]);
  const [indexValue, setIndexValue] = useState("");
  const [editedTodo, setEditedTodo] = useState("");
  const [updatePrivate, setUpdatePrivate] = useState(null);

  useEffect(() => {
    const dbRef = collection(db, "todos");
    const q = query(dbRef, where("userId", "==", userID));
    const dataFeed = onSnapshot(q, (querySnapshot) => {
      const getTodo = [];
      querySnapshot.forEach((doc) => {
            getTodo.push({key:doc.id, todo:doc.data().todo, userId:doc.data().userId, private:doc.data().private});
          });
          console.table(getTodo)
          setTodoArray(getTodo);
    });
}, []);

  const editTodo = (index) => {
    setIndexValue(index);
  }

  const cancelEdit = () => {
    setIndexValue("");
  }
  

  const updateCheck =(e) => {
    console.log(e.checked);
    setUpdatePrivate(e.checked);
  }

  const delTodo = async (key) => {
      const dbRef = doc(db, "todos", key);
      await deleteDoc(dbRef);
  }

  const updateTodo = async (key) => {
    if (editedTodo && updateCheck) {
    const dbRef = doc(db, "todos", key);
    const obj = {todo: editedTodo.trim(), private: updatePrivate,};
    try{
        const updateTodo = await updateDoc(dbRef, obj);
        // console.log(updateTodo);
        // setRefresh(!refresh);
        setEditedTodo("");
        setIndexValue("");
    } catch (error) {
        console.log(error);
    }
    setIndexValue("");
  } else{alert("Please update the task")}
}

    const delAll = async () => {
      todoArray.forEach((todo)=>{
        deleteDoc(doc(db, "todos", todo.key));
      });
  }

  return (
    <>
    <Nav logout={logout}/>
    <h1 style={{marginTop:"10px"}}>Profile</h1>
    
    <div className={styles.container}>
    <section>
        {todoArray.length > 0? (
        <div className={styles.listHeader}>
          <h3>Tasks</h3>
          <button className={styles.delBtn} onClick={delAll}>Delete All</button>
        </div>) :  ""} 
          {todoArray.map((value, index) => {
              return indexValue === index? (  
                <div id={styles.items} key={index}>
                  <div id={styles.value}>
                  <input type="text" defaultValue={value.todo} autoFocus onChange={(e) => setEditedTodo(e.target.value)}/>
                  <label htmlFor="status">
                    <input type="checkbox" name="status" id="status" defaultChecked={value.private} onChange={(e) => updateCheck(e.target)}/> Private</label>
                  </div>
                    <div>
                        <button id={styles.updateBtn} onClick={()=> updateTodo(value.key)}>Update</button>
                        <button id={styles.cancelBtn} onClick={cancelEdit}>Cancel</button>
                    </div>
                </div> 
              ) : (
                  <div id={styles.items} key={index}>
                    <div id={styles.value}>
                      <p>{value.todo}</p>
                    <label htmlFor="status">
                      <input type="checkbox" name="status" id="status" checked={value.private} /> Private</label>
                    </div>
                      <div>
                        <button id={styles.editBtn} onClick={() => editTodo(index)}>Edit</button>
                        <button className={styles.delBtn} onClick={()=>delTodo(value.key)}>Delete</button>
                      </div>
                  </div>
                );
              })}
      </section>
      </div>
    </>
  )
}

export default Profile;