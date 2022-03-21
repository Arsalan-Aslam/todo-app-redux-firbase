import React, {useState, useEffect} from 'react';
import styles from './Todo.module.css';
import {db} from "../../config/firebase";
import { collection, addDoc, doc, updateDoc, query, where, onSnapshot, deleteDoc, getDocs } from "firebase/firestore"; 

const Todo = () => {


    // set up state for capturing Todo input value
    const [todoInput, setTodoInput] = useState("")
    // console.log(todoInput);

    // set up state for saving Todo task
    const [todoArray, setTodoArray] = useState([]);

    // set up state for capturing index value
    const [indexValue, setIndexValue] = useState("");

    // set up state for capturing edited todo
    const [editedTodo, setEditedTodo] = useState("");

    const [updatePrivate, setUpdatePrivate] = useState(null);

    const userID = localStorage.getItem("userID");

    const [refresh, setRefresh] = useState(true);

    const [isPrivate, setIsPrivate] = useState(false);

   
    
    const handleCheck = (e) => {
      console.log(e.checked);
      setIsPrivate(e.checked);
    }

    const updateCheck =(e) => {
      console.log(e.checked);
      setUpdatePrivate(e.checked);
    } 



    // set up function to add todo
    const addTodo = async (e) => {
        // prevent the form from loading the page on submit 
        e.preventDefault();
        // if a task is entered then push it to the Array otherwise show the alert
        if(todoInput){
          const docRef = collection(db, "todos")
          const addTodo = await addDoc(docRef, {
          userId: userID,
          todo: todoInput,
          private: isPrivate, 
        });
        console.log("Document written with ID: ", addTodo.id);
        setRefresh(!refresh);
        console.log(todoArray);
        } else {
          alert("Please enter a task to do...");
        }        
        // clear the todo input field
        setTodoInput('');
    }

    // set up function to edit a todo
    const editTodo = (value, index) => {
      value===userID? setIndexValue(index): alert("Only owner of the task can edit it");
    }

    // set up function to cancel edit todo
    const cancelEdit = () => {
      setIndexValue("");
    }

    // set up function to delete a todo
    const delTodo = async (value, key) => {
      if(value===userID){
        const dbRef = doc(db, "todos", key);
        await deleteDoc(dbRef);
      } else {alert("Only owner of the task can delete it")}
    }
    // set up function to update todo
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

    // set up function to delete all todos
  //   const delAll = async () => {
  //     await todoArray.forEach((todo)=>{
  //         deleteDoc(doc(db, "todos", todo.key));
  //     });
  // }
    
    useEffect(() => {
      const dbRef = collection(db, "todos");
      const q = query(dbRef, where("private", "==", false));
      const dataFeed = onSnapshot(q, (querySnapshot) => {
        const getTodo = [];
        querySnapshot.forEach((doc) => {
              getTodo.push({key:doc.id, todo:doc.data().todo, userId:doc.data().userId, private:doc.data().private});
            });
            console.table(getTodo)
            setTodoArray(getTodo);
      });
  }, []);
  
  // useEffect(async () => {
  //       const dbRef = collection(db, "todos");
  //       const q = query(dbRef, where("userId", "==", userID))
  //       const data = await getDocs(q);
  //       // console.log(data);
  //       let getTodo = [];
  //       data.forEach((doc) => {
  //           getTodo.push({
  //               key: doc.id, 
  //               todo: doc.data().todo,
  //               userId: doc.data().userId
  //           });
  //       });
  //       setTodoArray(getTodo);
  //   }, [refresh]);
    


  return (
    <>
    <div className={styles.container}>
      <form onSubmit={(e) => addTodo(e)}>
          <h1>What would you like to do?</h1>
          <input type="text" placeholder='Enter a task to do...' autoFocus onChange={(e) => setTodoInput(e.target.value)} value={todoInput}/>
          <label htmlFor="private">
          <input type="checkbox" name="Private" id="private" onChange={(e)=>handleCheck(e.target)}/>
            Private</label>
          <button>Add ↵</button>
      </form>
      
      <section>
        {todoArray.length > 0? (
        <div className={styles.listHeader}>
          <h3>Overall Tasks</h3>
          {/* <button className="del-btn" onClick={delAll}>Delete All</button> */}
        </div>) :  ""} 
          {todoArray.map((value, index) => {
              return indexValue === index? (  
                <div id={styles.items} key={index}>
                  <div id={styles.value}>
                    <input type="text" defaultValue={value.todo} autoFocus onChange={(e) => setEditedTodo(e.target.value)}/>
                    <label htmlFor="status">
                    <input type="checkbox" name="status" id="status" defaultChecked={value.private} onChange={(e) => updateCheck(e.target)}/>
                    Private</label>
                      
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
                      <input type="checkbox" name="status" id="status" checked={value.private} />
                        Private</label>

                    </div>
                      <div>
                        <button id={styles.editBtn} onClick={() => editTodo(value.userId, index)}>Edit</button>
                        <button className={styles.delBtn} onClick={() => delTodo(value.userId, value.key)}>Delete</button>
                        
                      </div>
                  </div>
                );
              })}
      </section>

    </div>
    </>
  )
}

export default Todo;
