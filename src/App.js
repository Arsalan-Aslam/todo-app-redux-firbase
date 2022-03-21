import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import Todo from "./components/Todo/Todo";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import Dashboard from "./components/Dashboard/Dashboard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userAuthLogin, userAuthLogout } from "./store/actions/userAuthAction";
import store from "./store/store";

function App() {
  // const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((store) => store.userAuthReducer);

  const authenticate = () => {
    dispatch(userAuthLogin());
    console.log("state", state.user);
  };

  const logout = () => {
    dispatch(userAuthLogout());
    localStorage.removeItem("userID");
  };

  useEffect(() => {
    !state.user ? navigate("/") : navigate("Dashboard");
  }, [state.user]);

  return (
    <div className='App'>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        {!state.user ? (
          <Route path='/' element={<Login authenticate={authenticate} />} />
        ) : (
          <>
            <Route path='/profile' element={<Profile logout={logout} />} />
            <Route path='/dashboard' element={<Dashboard logout={logout} />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
