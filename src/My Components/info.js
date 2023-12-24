import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import food from './foodimg.jpg';
import './info_style.css';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Info() {
  const navigate = useNavigate();

  const { title } = useParams();
  const [infoData, setInfoData] = useState({ description: '', imageUrl: '' });
  const [heartColor, setHeartColor] = useState('white');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleHeartColor = () => {
    if (!isAuthenticated) {
      navigate('/signup');
    } else {
      if (heartColor === 'red') {
        // Remove the title from the database and set heart color to white
        fetch(`http://localhost:5000/api/remove-favorite?title=${title}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        .then(response => {
          if (response.ok) {
            // Title removed successfully, update UI state
            setHeartColor('white');
          } else {
            // Handle error, e.g., show an error message to the user
          }
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle network error, e.g., show an error message to the user
        });
      } else if (heartColor === 'white') {
        // Verify if it's a valid title from the cache file in the backend
        fetch(`http://localhost:5000/api/verify-title?title=${title}`, {
          credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
          if (data.isValid) {
            // Add the title to the database and set heart color to red
            fetch(`http://localhost:5000/api/add-favorite?title=${title}`, {
              method: 'POST',
              credentials: 'include'
            })
            .then(response => {
              if (response.ok) {
                // Title added successfully, update UI state
                setHeartColor('red');
              } else {
                // Handle error, e.g., show an error message to the user
              }
            })
            .catch(error => {
              console.error('Error:', error);
              // Handle network error, e.g., show an error message to the user
            });
          } else {
            // Title is not valid, don't do anything or show a message to the user
          }
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle network error, e.g., show an error message to the user
        });
      }
    }
  };
  

  useEffect(() => {
    // Fetch user session status
    fetch('http://localhost:5000/api/check-session', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        setIsAuthenticated(data.isAuthenticated);
  
        // If user is authenticated, check if the title is in favorites
        if (data.isAuthenticated) {
          fetch(`http://localhost:5000/api/check-favorite?title=${title}`, {
            credentials: 'include'
          })
            .then(response => response.json())
            .then(favoriteData => {
              // Set heart color based on whether the title is a favorite or not
              // console.log(favoriteData);
              setHeartColor(favoriteData.isFavorite ? 'red' : 'white');
            })
            .catch(error => {
              console.error('Error checking favorite status:', error);
            });
        } else {
          // If user is not authenticated, set heart color to white
          setHeartColor('white');
        }
      })
      .catch(error => {
        console.error('Error checking session:', error);
      });
  }, [title]); // Re-run the effect whenever the 'title' prop changes
  

useEffect(() => {
    // Make a backend API call to fetch data based on the 'title' parameter
    fetch(`http://localhost:5000/api/get-description-imageUrl?title=${title}`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the API response has 'description' and 'imageUrl' properties
        setInfoData({
          description: data.description || 'Description not available',
          imageUrl: data.imageUrl,
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [title]); // Re-fetch data whenever the 'title' parameter changes

  return (
    <div className="info">
      <div className='info-container'>
        <div className='titleAndFav' >
          <div className='titleofpage'>
            {title}
          </div>
          <button className="fav-icon2" onClick={toggleHeartColor}>
            <FaHeart style={{ color: heartColor }} />
          </button>
        </div>
        <div className='imagediv'>
          <img src={infoData.imageUrl || food} alt={food} />
        </div>
        <div className='descriptiondiv'>
          {infoData.description}
        </div>
      </div>
    </div>
  );
}

export default Info;
