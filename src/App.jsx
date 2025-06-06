import { useState, useEffect } from 'react';
import readingList from './data/readingList.json';
import StarRating from './components/StarRating';
import RatingsHistory from './components/RatingsHistory';

function App() {
  const [day, setDay] = useState(() => {
    const savedDay = localStorage.getItem('currentDay');
    return savedDay ? parseInt(savedDay) : 1;
  });

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('streak') || '0');
  });

  const [lastReadDate, setLastReadDate] = useState(() => {
    return localStorage.getItem('lastReadDate') || null;
  });

  const [ratings, setRatings] = useState(() => {
    const stored = localStorage.getItem('ratings');
    return stored ? JSON.parse(stored) : {};
  });

  const today = readingList.find(item => item.day === day);

  useEffect(() => {
    localStorage.setItem('currentDay', day);
    localStorage.setItem('streak', streak);
    localStorage.setItem('ratings', JSON.stringify(ratings));
    if (lastReadDate) localStorage.setItem('lastReadDate', lastReadDate);
  }, [day, streak, ratings, lastReadDate]);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const handleNextDay = () => {
    const todayDate = getTodayDate();
    if (day < readingList.length) setDay(day + 1);

    if (!lastReadDate) {
      setStreak(1);
    } else if (lastReadDate !== todayDate) {
      const last = new Date(lastReadDate);
      const now = new Date(todayDate);
      const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
      setStreak(diff === 1 ? streak + 1 : 1);
    }

    setLastReadDate(todayDate);
  };

  const handlePreviousDay = () => {
    if (day > 1) setDay(day - 1);
  };

  const handleRatingChange = (type, value) => {
    setRatings(prev => ({
      ...prev,
      [`${type}-${day}`]: value
    }));
  };

  const renderStarRating = (type) => (
    <StarRating
      rating={ratings[`${type}-${day}`] || 0}
      onRate={(value) => handleRatingChange(type, value)}
    />
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>readingiskewl 📚😎</h1>
      <p>🔥 Streak: {streak} day{streak === 1 ? '' : 's'}</p>

      {today ? (
        <>
          <h2>Day {today.day}</h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <strong>Poem:</strong>{' '}
            <a href={today.poem.url} target="_blank" rel="noreferrer">{today.poem.title}</a>
            <div>{renderStarRating("poem")}</div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <strong>Story:</strong>{' '}
            <a href={today.story.url} target="_blank" rel="noreferrer">{today.story.title}</a>
            <div>{renderStarRating("story")}</div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <strong>Essay:</strong>{' '}
            <a href={today.essay.url} target="_blank" rel="noreferrer">{today.essay.title}</a>
            <div>{renderStarRating("essay")}</div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button onClick={handlePreviousDay} disabled={day === 1}>← Previous</button>
            <button onClick={handleNextDay} disabled={day === readingList.length}>Next →</button>
          </div>

          <RatingsHistory ratings={ratings} />
        </>
      ) : (
        <p>No reading available for Day {day}.</p>
      )}
    </div>
  );
}

export default App;
