import React from 'react';

const StarRating = ({ rating, onRate }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'inline-block' }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => onRate(star)}
          style={{
            cursor: 'pointer',
            color: star <= rating ? '#facc15' : '#d1d5db',
            fontSize: '1.5rem',
            marginRight: '4px'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
