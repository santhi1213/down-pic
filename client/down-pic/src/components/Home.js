// src/components/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = ({ image }) => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      const result = await axios.get('photos-website-react.vercel.app/images');
      setImages(result.data);
    };
    fetchImages();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const result = await axios.get(`photos-website-react.vercel.app/search?query=${query}`);
    setImages(result.data);
  };



  const downloadImage = (imageId, imageName) => {
    const link = document.createElement('a');
    link.href = `photos-website-react.vercel.app/image/${imageId}`;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{backgroundColor:'rgba(0,0,0,0.1)',padding:'4%'}}>
      <h2 className='home-title'>Image Gallery</h2>
      <form onSubmit={handleSearch}>
        <input className='search-bar'
          type="text"
          placeholder="Search images..."
          onChange={(e) => setQuery(e.target.value)} required
        />
        <button className='search-btn' type="submit">Search</button>
      </form>
      <div className="gallery">
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', padding:'3%', textAlign:'center'}}>
            {images.map(image => (
            <div key={image._id} style={{padding:'2%'}}>
                <img src={`photos-website-react.vercel.app/image/${image._id}`} alt={image.name} style={{width:'250px',height:'250px', borderRadius:'20px', cursor:'pointer'}} onClick={()=> downloadImage(image._id,image.name)} />
                <h3>{image.name}</h3>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
