// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css'

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('photos-website-react.vercel.app/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      alert('Logged in successfully');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input className={styles.input} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input  className={styles.input} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className={styles.login} type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
