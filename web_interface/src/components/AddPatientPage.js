// AddPatientPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPatient } from '../api/patientApi';
import '../index.css';

function AddPatientPage() {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');
  const navigate = useNavigate();

  const handleAddPatient = () => {
    addPatient(userId, name, age, condition)
      .then(() => {
        navigate('/patients');
      })
      .catch((error) => {
        console.error("Error adding patient", error);
      });
  };

  return (
    <div className="add-patient-container">
      <h2>הוסף מטופל חדש</h2>
      <input type="text" placeholder="תעודת זהות" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <input type="text" placeholder="שם" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="גיל" value={age} onChange={(e) => setAge(e.target.value)} />
      <input type="text" placeholder="מצב רפואי" value={condition} onChange={(e) => setCondition(e.target.value)} />
      <button className="add-patient-button" onClick={handleAddPatient}>הוסף מטופל</button>
      <button className="back-button" onClick={() => navigate('/patients')}>חזור לרשימת המטופלים</button>

    </div>
  );
}

export default AddPatientPage;
