// src/components/UploadImage.js
import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css'

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
  
    const token = localStorage.getItem('token');
  
    try {
      await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          Authorization: token,
        },
      });
      alert('Image uploaded successfully!');
    } catch (err) {
      alert('Error uploading image');
    }
  };
  

  return (
    <div className='upload-container'>
      <h2 className='upload-title'>Upload Image</h2>
      <form onSubmit={handleSubmit} className='upload-form'>
        <input className='upload-input' type="text" placeholder="Image Name" onChange={(e) => setName(e.target.value)} />
        <input className='upload-file' type="file" onChange={handleImageUpload} /><br/>
        <button className='upload-btn' type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadImage;
