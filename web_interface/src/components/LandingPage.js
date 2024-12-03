// LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>ברוכים הבאים למעבדת ההליכה הניידת</h1>
      <button className="landing-button" onClick={() => navigate('/login')}>התחבר</button>
      <button className="landing-button" onClick={() => navigate('/register')}>הרשמה</button>
    </div>
  );
}

export default LandingPage;
