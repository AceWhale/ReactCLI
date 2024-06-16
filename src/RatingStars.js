import React from 'react';

const RatingStars = ({ rating, room }) => {
  const yellowStars = Math.floor(rating);
  const greyStars = 5 - yellowStars;
  
  const createStars = (count, color) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(<span key={i} style={{ color: color }}>★</span>);
    }
    return stars;
  };

  return (
    <div>
      {createStars(yellowStars, 'yellow')}
      {createStars(greyStars, 'grey')}
    </div>
  );
};

const RoomComponent = ({ room }) => {
  return (
    <div>
      <RatingStars rating={room.stars} />
    </div>
  );
};

export default RoomComponent;