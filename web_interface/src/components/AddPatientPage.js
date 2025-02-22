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
        alert('✅ המטופל נוסף בהצלחה!');
        navigate('/patients');
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            alert('⚠️ שגיאה: הנתונים שסיפקת אינם תקינים. אנא בדוק ונסה שנית.');
          } else if (error.response.status === 409) {
            alert('⚠️ שגיאה: המטופל כבר קיים במערכת.');
          } else if (error.response.status === 500) {
            alert('❌ שגיאה בשרת. אנא נסה שוב מאוחר יותר.');
          } else {
            alert('❌ שגיאה לא ידועה. אנא נסה שוב.');
          }
        } else if (error.request) {
          alert('❌ אין חיבור לשרת. בדוק את חיבור האינטרנט שלך ונסה שוב.');
        } else {
          alert('❌ שגיאה בהוספת המטופל. אנא נסה שוב.');
        }
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
