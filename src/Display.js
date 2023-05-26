import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Display = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    
    fetchImages();
  }, []);
  useEffect(() => {
    if (page > 1) {
      fetchImages();
    }
  }, [page]);
  //fetchImage function
  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=0ac22ec47d1b1f72adcf902a856de463&tags=nature&page=${page}&per_page=10&format=json&nojsoncallback=1`
      );

      const { photos } = response.data;

      const fetchedImages = photos.photo.map((photo) => ({
        id: photo.id,
        url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
      }));

      setImages((prev) => [...prev,...fetchedImages]);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  //scroll infinite Implementation
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight + 1 >= scrollHeight -10  && !loading  && images.length > 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, );
  //Preview feature
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className='image-container'>
      
      {images.map((image,index) => (
        
        <div  key={`${image.id}-${index}`}>
        <img key={`${image.id}-${index}`} src={image.url} alt={image.id} onClick={() => handleImageClick(image)}/>
        </div>
      ))}
      {selectedImage && (
        <Modal image={selectedImage} onClose={closeModal} />
      )}
    </div>
  );
};
//Modal
const Modal = ({ image, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <img src={image.url} alt={image.id} />
      </div>
    </div>
  );
};

export default Display;