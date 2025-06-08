import React, { useState, useEffect } from 'react';
import readingList from '../data/readingList.json';

const RatingsHistory = ({ ratings, setRatings }) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [backupRatings, setBackupRatings] = useState(null);
  const [undoVisible, setUndoVisible] = useState(false);

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

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all ratings?")) {
      setBackupRatings(ratings);
      localStorage.removeItem('ratings');
      setRatings({});
      setUndoVisible(true);

      setTimeout(() => {
        setUndoVisible(false);
        setBackupRatings(null);
      }, 15000);
    }
  };

  const handleUndo = () => {
    if (backupRatings) {
      localStorage.setItem('ratings', JSON.stringify(backupRatings));
      setRatings(backupRatings);
      setUndoVisible(false);
      setBackupRatings(null);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📜 Ratings History</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setShowFavoritesOnly(prev => !prev)}>
          {showFavoritesOnly ? "Show All Ratings" : "Show Only Favorites ⭐️"}
        </button>
        <button onClick={handleReset} style={{ backgroundColor: '#f87171' }}>
          Reset Ratings 🗑️
        </button>
        {undoVisible && (
          <button onClick={handleUndo} style={{ backgroundColor: '#34d399' }}>
            Undo Reset 🔄
          </button>
        )}
      </div>

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
