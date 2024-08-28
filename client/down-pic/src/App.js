import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import UploadImage from './components/UploadImage';
import Login from './components/Login';
import Register from './components/Register'; // Import the Register component

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={token ? <UploadImage /> : <Login setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} /> {/* Add Register route */}
      </Routes>
    </Router>
  );
};

export default App;
