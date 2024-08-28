import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ token, setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <nav className='navbar'>
      <h1 className='title'>PhotoGraphy</h1>
      <ul>
        <li style={{color:'green'}}><Link style={{color:'lightgreen'}} className='nav-items' to="/">Home</Link></li>
        {token ? (
          <>
            <li><Link className='nav-items' to="/upload">Upload Image</Link></li>
            <li><button className='logout' onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link className='nav-items' to="/login">Login</Link></li>
            <li><Link className='nav-items' to="/register">Register</Link></li> {/* Add Register link */}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
