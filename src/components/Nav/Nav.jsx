import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

const Nav = ({logout}) => {
  return (
    <nav>
        <ul>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li> 
            <li><NavLink to="/profile">Profile</NavLink></li>
            <li onClick={logout}>Logout</li>
        </ul>
    </nav>
  )
}

export default Nav;