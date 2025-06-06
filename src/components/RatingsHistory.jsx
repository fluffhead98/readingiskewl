import React from 'react';
import readingList from '../data/readingList.json';

const RatingsHistory = ({ ratings }) => {
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

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📜 Ratings History</h2>
      {rows.length === 0 ? (
        <p>No ratings yet!</p>
      ) : (
        <ul>
          {rows.map((entry, i) => (
            <li key={i}>
              <strong>Day {entry.day} - {entry.type}:</strong> {entry.title} → {entry.rating}⭐
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RatingsHistory;
