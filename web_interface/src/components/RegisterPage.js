// RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { registerTherapist } from '../api/therapistApi'; // Import therapist API

function RegisterPage() {
  const [therapist_id, setTherapistId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    // Perform therapist registration
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!therapist_id.trim() || !name.trim() || !email.trim() || !password.trim()) {
      alert("⚠️ יש למלא את כל השדות.");
      return;
    }
  
    if (!emailRegex.test(email)) {
      alert("⚠️ כתובת האימייל אינה תקינה.");
      return;
    }

    registerTherapist(therapist_id, email, password, name)
      .then(() => {
        alert('✅ רישום בוצע בהצלחה! כעת ניתן להתחבר.');
        navigate('/login'); // After successful registration, navigate to the login page
      })
      .catch((error) => {
        if (error.response) {
          // שרת הגיב עם סטטוס שגיאה (לדוגמה: 400, 409 וכו')
          switch (error.response.status) {
            case 400:
              alert('⚠️ שגיאה: מידע חסר או לא תקין.');
              break;
            case 409:
              alert('⚠️ האימייל כבר רשום במערכת, נסה להתחבר.');
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
        console.error('Registration failed', error);
      });
  };

  return (
    <div className="register-container">
      <h2>הרשמה</h2>
      <input type="text" placeholder="תעודת זהות" value={therapist_id} onChange={(e) => setTherapistId(e.target.value)} />
      <input type="name" placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="register-button" onClick={handleRegister}>הירשם</button>
    </div>
  );
}

export default RegisterPage;
