// src/pages/LandingPage.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container" dir="rtl">
      <h1>ברוכים הבאים למעבדת ההליכה הניידת</h1>
      <div className="landing-actions">
        <button className="landing-button" onClick={() => navigate('/login')}>התחבר</button>
        <button className="landing-button" onClick={() => navigate('/register')}>הרשמה</button>
      </div>
      {/* וידאו הדרכה */}
      <section className="landing-hero">
        {/* שימי את קובץ הווידאו תחת public/videos/intro.mp4 */}
        <video
          className="landing-video"
          controls
          preload="metadata"
          poster="/images/landing_poster.jpg"  /* אופציונלי: תמונת פתיח תחת public/images */
          aria-label="סרטון הדרכה על האתר"
        >
          <source src="/videos/intro.mp4" type="video/mp4" />
          הדפדפן שלך אינו תומך בניגון וידאו. ניתן להוריד את הסרטון <a href="/videos/intro.mp4">מכאן</a>.
        </video>

        <div className="guide-link-wrap">
          {/* קישור ישיר לסעיף 15.3 בעמוד המדריך */}
           {/* <Link className="guide-link" to="/guide"> */}
          <Link to="/guide">
            {/* מדריך למשתמש מקיף לאתר */}
          </Link>
        </div>

        <button className="landing-button" onClick={() => navigate('/guide')}>מדריך למשתמש מקיף לאתר</button>
      </section>


    </div>
  );
}

export default LandingPage;
