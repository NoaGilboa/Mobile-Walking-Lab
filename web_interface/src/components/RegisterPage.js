// RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { registerTherapist } from '../api/therapistApi'; // Import therapist API

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    // Perform therapist registration
    registerTherapist(email, password,name)
      .then(() => {
        // After successful registration, navigate to the login page
        navigate('/login');
      })
      .catch((error) => {
        console.error('Registration failed', error);
      });
  };

  return (
    <div className="register-container">
      <h2>הרשמה</h2>
      <input type="name" placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="register-button" onClick={handleRegister}>הירשם</button>
    </div>
  );
}

export default RegisterPage;
