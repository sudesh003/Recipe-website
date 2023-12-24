import './favorite_style.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Favorite() {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const navigate = useNavigate();
    const handleButtonClick = (title) => {
        // Navigate to the info page with the corresponding title
        navigate(`/info/${title}`);
    };

    useEffect(() => {
        // Fetch favorite items from the database
        fetch('http://localhost:5000/api/favorite-items', {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setFavoriteItems(data.favoriteItems);
            })
            .catch(error => {
                console.error('Error fetching favorite items:', error);
            });
    }, []); // Empty dependency array ensures the effect runs once after the initial render

    return (
        <div className="fav-body">
            <div className='fav-container'>
                <div className='page-title-fav'>Your favorites</div>
                {/* Render buttons based on favorite items */}
                {favoriteItems.map(item => (
                    <div className='fav-title'>
                        <button className='fav-title-btn' key={item.id} onClick={() => handleButtonClick(item.title)}>
                            {item.title}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorite;
