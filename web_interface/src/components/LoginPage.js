// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginTherapist } from '../api/therapistApi';

import '../index.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    loginTherapist(email, password)
      .then((response) => {
        if (response.status === 200) {
          // Save therapist data to local storage
          const therapistData = response.data.therapist;
          localStorage.setItem('therapist', JSON.stringify(therapistData));
          alert('✅ התחברת בהצלחה!');
          navigate('/patients');        
        }
      })
      .catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              alert('⚠️ שגיאה: מידע חסר או לא תקין.');
              break;
            case 401:
              alert('⚠️ אימייל או סיסמה שגויים, נסה שוב.');
              break;
            case 403:
              alert('⚠️ אין לך הרשאה להתחבר.');
              break;
            case 500:
              alert('❌ שגיאת שרת! נסה שוב מאוחר יותר.');
              break;
            default:
              alert('❌ שגיאה לא ידועה, אנא נסה שוב.');
          }
        } else if (error.request) {
          // הבעיה היא בחיבור לשרת (הבקשה לא נשלחה)
          alert('❌ שגיאת חיבור! בדוק את החיבור לאינטרנט ונסה שוב.');
        } else {
          // שגיאה כללית שלא קשורה לבקשה
          alert(`❌ שגיאה: ${error.message}`);
        }
        console.error('Login failed', error);
      });
  };

  return (
    <div className="login-container">
      <h2>התחברות</h2>
      <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="login-button" onClick={handleLogin}>התחבר</button>
    </div>
  );
}

export default LoginPage;
