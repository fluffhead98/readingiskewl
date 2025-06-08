import React, { useState } from 'react';
import readingList from '../data/readingList.json';

const RatingsHistory = ({ ratings }) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const rows = [];

  for (const [key, value] of Object.entries(ratings)) {
    const [type, dayStr] = key.split("-");
    const day = parseInt(dayStr);
    const dayData = readingList.find(r => r.day === day);
    if (!dayData) continue;

    const item = dayData[type];
    const displayType = type.charAt(0).toUpperCase() + type.slice(1);
    rows.push({ day, type: displayType, title: item.title, rating: value });
  }

  rows.sort((a, b) => a.day - b.day);

  const filteredRows = showFavoritesOnly
    ? rows.filter(entry => entry.rating === 5)
    : rows;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📜 Ratings History</h2>
      <button onClick={() => setShowFavoritesOnly(prev => !prev)}>
        {showFavoritesOnly ? "Show All Ratings" : "Show Only Favorites ⭐️"}
      </button>

      {filteredRows.length === 0 ? (
        <p>{showFavoritesOnly ? "No 5-star favorites yet!" : "No ratings yet!"}</p>
      ) : (
        <ul>
          {filteredRows.map((entry, i) => (
            <li key={i} style={entry.rating === 5 ? { fontWeight: 'bold', color: '#f59e0b' } : {}}>
              <strong>Day {entry.day} - {entry.type}:</strong> {entry.title} → {entry.rating}⭐
              {entry.rating === 5 && ' 🌟'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RatingsHistory;
