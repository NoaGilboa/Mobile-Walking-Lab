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
          navigate('/patients');        
        }
      })
      .catch((error) => {
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
