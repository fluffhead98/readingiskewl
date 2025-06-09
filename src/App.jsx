import React, { useState, useEffect } from 'react';
import readingList from './data/readingList.json';
import StarRating from './components/StarRating';
import RatingsHistory from './components/RatingsHistory';

const App = () => {
  const [day, setDay] = useState(1);
  const [ratings, setRatings] = useState(() => JSON.parse(localStorage.getItem('ratings')) || {});
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleRate = (type, value) => {
    const key = `${type}-${day}`;
    setRatings(prev => ({ ...prev, [key]: value }));
  };

  const current = readingList.find(r => r.day === day);
  const completedCount = Object.keys(ratings).length;
  const totalReadings = readingList.length * 3;
  const percentComplete = Math.round((completedCount / totalReadings) * 100);

  const backgroundColor = darkMode ? '#111' : '#fff';
  const textColor = darkMode ? '#eee' : '#000';

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '1rem',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor,
      color: textColor,
      minHeight: '100vh'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem' }}>📚 Reading Is Kewl</h1>
        <button onClick={() => setDarkMode(prev => !prev)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.95rem' }}>
        Day {day} of {readingList.length}
      </p>

      <div style={{ marginTop: '1rem' }}>
        {['poem', 'story', 'essay'].map(type => (
          <div key={type} style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: 0 }}>
              <strong>{type.charAt(0).toUpperCase() + type.slice(1)}:</strong>{' '}
              <a
                href={
                  type === 'poem'
                    ? `https://www.poetryfoundation.org/search?query=${encodeURIComponent(current[type].title)}`
                    : current[type].url
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: darkMode ? '#93c5fd' : '#1d4ed8' }}
              >
                {current[type].title}
              </a>
            </p>
            <StarRating
              rating={ratings[`${type}-${day}`] || 0}
              onRate={value => handleRate(type, value)}
            />
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        marginTop: '1rem'
      }}>
        <button disabled={day === 1} onClick={() => setDay(day - 1)}>⬅️ Previous Day</button>
        <button disabled={day === readingList.length} onClick={() => setDay(day + 1)}>Next Day ➡️</button>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <p style={{ textAlign: 'center' }}>📈 {percentComplete}% complete</p>
        <div style={{
          background: darkMode ? '#333' : '#eee',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '12px',
          margin: '0 auto',
          maxWidth: '100%'
        }}>
          <div style={{
            height: '100%',
            width: `${percentComplete}%`,
            background: darkMode ? '#22c55e' : '#4ade80'
          }} />
        </div>
      </div>

      <RatingsHistory ratings={ratings} setRatings={setRatings} />

      {/* Docked Spotify Player */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <iframe
          style={{ width: '100%', maxWidth: '400px', height: '80px', borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/6dEdaN9tg6S5x4v698ARfb"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default App;
