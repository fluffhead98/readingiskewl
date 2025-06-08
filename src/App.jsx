import React, { useState, useEffect, useRef } from 'react';
import readingList from './data/readingList.json';
import StarRating from './components/StarRating';
import RatingsHistory from './components/RatingsHistory';

function App() {
  const [dayIndex, setDayIndex] = useState(0);
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('ratings');
    return saved ? JSON.parse(saved) : {};
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? parseInt(saved) : 0;
  });

  const currentDay = readingList[dayIndex];

  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('streak', streak);
  }, [streak]);

  const handleRate = (type, value) => {
    const key = `${type}-${currentDay.day}`;
    setRatings(prev => ({ ...prev, [key]: value }));
  };

  const nextDay = () => {
    if (dayIndex + 1 < readingList.length) {
      setDayIndex(dayIndex + 1);
      setStreak(prev => prev + 1);
    }
  };

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>📚 readingiskewl</h1>
        <h2>Day {currentDay.day}</h2>

        <p>
          <strong>Poem:</strong> <a href={currentDay.poem.url} target="_blank" rel="noopener noreferrer">{currentDay.poem.title}</a>
          <br />
          <StarRating rating={ratings[`poem-${currentDay.day}`] || 0} onRate={(value) => handleRate('poem', value)} />
        </p>

        <p>
          <strong>Story:</strong> <a href={currentDay.story.url} target="_blank" rel="noopener noreferrer">{currentDay.story.title}</a>
          <br />
          <StarRating rating={ratings[`story-${currentDay.day}`] || 0} onRate={(value) => handleRate('story', value)} />
        </p>

        <p>
          <strong>Essay:</strong> <a href={currentDay.essay.url} target="_blank" rel="noopener noreferrer">{currentDay.essay.title}</a>
          <br />
          <StarRating rating={ratings[`essay-${currentDay.day}`] || 0} onRate={(value) => handleRate('essay', value)} />
        </p>

        <button onClick={nextDay}>Next Day ➡️</button>

        <p style={{ marginTop: '1rem' }}>🔥 Daily Streak: {streak} days</p>

        <RatingsHistory ratings={ratings} setRatings={setRatings} />
      </div>

      {/* Spotify Embed - Bottom Left */}
      <div style={{ position: 'fixed', bottom: '1rem', left: '1rem', zIndex: 1000 }}>
        <iframe
          title="Classical Essentials"
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWEJlAGA9gs0?utm_source=generator"
          width="280"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
}

export default App;
