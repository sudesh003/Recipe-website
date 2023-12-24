import React, { useState} from 'react';
import { FaHeart } from 'react-icons/fa';
import { Button, Card as BootstrapCard } from 'react-bootstrap';
import food from './foodimg.jpg';
import './cards_style.css';
import { Link } from 'react-router-dom';

function Card({ title, description, id,imageUrl }) {
  const [heartColor, setHeartColor] = useState('white');

  const toggleHeartColor = () => {
    setHeartColor(prevColor => (prevColor === 'white' ? 'red' : 'white'));
  };

  const truncatedDescription = description ? (description.length > 50 ? `${description.slice(0, 50)}...` : description) : 'fetching...';


  return (
    <BootstrapCard className="my-card">
      <BootstrapCard.Img className='imgofcard' variant="top" src={imageUrl || food}
      style={{ width: '100%', height: '35vh' }}
      />
      <BootstrapCard.Body className='my-card-body'>
        <BootstrapCard.Title>{title || 'Please wait...'}
        </BootstrapCard.Title>
        <BootstrapCard.Text className='my-card-desc'>{truncatedDescription}
        </BootstrapCard.Text>
        <div className='readmore-fav'>
          <Link 
          to={{ pathname: `/info/${title}`}}
          >
          <Button variant="primary" style={{backgroundColor:'rgb(126 34 206)', border:'none'}}>Read More</Button>
          </Link>
          <button className="fav-icon" onClick={toggleHeartColor}>
            <FaHeart style={{ color: heartColor }} />
          </button>
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}

export default Card;
