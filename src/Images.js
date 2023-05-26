import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Display from './Display';

const Images = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    
  
    useEffect(() => {
      if (searchTerm.trim() !== '') {
        setPage(1);
        setImages([]);
        fetchImages();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);
    useEffect(() => {
        if (page > 1) {
          fetchImages();
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [page]);
      //Fetching Image
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=635a87eb5d88b1a9527218827eb39d01&tags=${searchTerm}&page=1&per_page=10&format=json&nojsoncallback=1`
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
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };

      //Infinite Scroll Feature
      const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollTop + clientHeight + 1 >= scrollHeight - 10 && !loading  && images.length > 0) {
          setPage((prevPage) => prevPage + 1);
        }
      };
    
      useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, );

      //Preview Feature
      const handleImageClick = (image) => {
        setSelectedImage(image);
      };
      const closeModal = () => {
        setSelectedImage(null);
      };
      
    
      
      
     
    
     
    return (
      <div>
        
        <div className='searchbar'>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search images"
          className='inputbar'
          
        />
        
        </div>
        

        <div className='image-container'>
        {images.map((image,index) => (
          <div className='conta'>
          <img key={`${image.id}-${index}`} src={image.url} alt={image.id} className='image-list-items'  onClick={() => handleImageClick(image)}/>
          </div>

        ))}
        {selectedImage && (
        <Modal image={selectedImage} onClose={closeModal} />
      )}
        {loading && setLoading(<p>Loading more images...</p>)}
        {images.length === 0 && !loading && <Display/> }
        
      </div>
      
      </div>
    );
  };
  //modal
  const Modal = ({ image, onClose }) => {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content">
          <img src={image.url} alt={image.id} id='zoom' />
        </div>
      </div>
    );
  };

export default Images;