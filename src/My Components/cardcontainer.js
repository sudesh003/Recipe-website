import React, { useState, useEffect } from 'react';
import Card from './cards'; // Import your updated Card component
import './cardcontainer_style.css';

function CardContainer() {
  const [cards, setCards] = useState([]);
  const [lastLoadedId, setLastLoadedId] = useState(-1);

  const loadMoreCards = () => {
    // Calculate the next ID to start loading from (assuming you load 12 cards at a time)
    const nextId = lastLoadedId + 1;
    const startIdx = nextId;
    const endIdx = nextId + 11; // Load exactly 12 cards

    fetch(`http://localhost:5000/api/getinfo?startIdx=${startIdx}&endIdx=${endIdx}`)
      .then(response => response.json())
      .then(data => {
        // Assuming the API response contains an array of objects with id, title, and description properties
        setCards(prevCards => [...prevCards, ...data.results]); // Append new cards to the existing ones
        setLastLoadedId(endIdx); // Update last loaded ID
      })
      .catch(error => console.error(error));
  };

  // Load 12 cards on component mount
  useEffect(() => {
    loadMoreCards();
  }, []); // Empty dependency array ensures useEffect runs once on mount

  return (
    <div className="container">
      <div className="row">
        {cards.map(card => (
          <div className="col-md-3 mb-4" key={card.id}>
            <Card title={card.title} description={card.description} id={card.id} imageUrl={card.imageUrl} />      
                
          </div>
        ))}
      </div>
      {/* Load More button */}
      <div className='load-more'>
        <button className='load-more-btn' onClick={loadMoreCards}>Load More</button>
      </div>
    </div>
  );
}

export default CardContainer;
