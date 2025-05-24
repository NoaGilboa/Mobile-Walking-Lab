// AddPatientPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPatient } from '../api/patientApi';
import '../index.css';

function AddPatientPage() {
  const [patientId, setPatientId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const navigate = useNavigate();

  const handleAddPatient = () => {

    if (!firstName.trim() || !patientId.trim()) {
      alert("⚠️ שם פרטי ותעודת זהות הם שדות חובה.");
      return;
    }
    const patientData = {
      patient_id: patientId,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      gender: gender,
      weight: parseFloat(weight) || 0,
      height: parseFloat(height) || 0,
      phone: phone,
      email: email,
      medical_condition: medicalCondition,
      mobility_status: ''
    };
    addPatient(patientData)
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
      <input type="text" required placeholder="תעודת זהות *" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
      <input type="text" required placeholder="שם פרטי *" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input type="text" placeholder="שם משפחה" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <div className="form-group">
        <label htmlFor="birthDate" style={{ display: 'block', marginBottom: '6px', textAlign: 'right' }}>תאריך לידה:</label>
        <input id="birthDate" type="date" max={new Date().toISOString().split("T")[0]} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={{ direction: 'rtl' }} />
      </div>
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="" disabled>בחר מין</option>
        <option value="זכר">זכר</option>
        <option value="נקבה">נקבה</option>
        <option value="אחר">אחר</option>
      </select>
      <input type="number" placeholder="משקל (ק״ג)" value={weight} onChange={(e) => setWeight(e.target.value)} />
      <input type="number" placeholder="גובה (ס״מ)" value={height} onChange={(e) => setHeight(e.target.value)} />
      <input type="tel" dir="rtl" placeholder="מספר טלפון (לדוג׳: 0501234567)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
       <input type="email" placeholder="אימייל (לדוג׳: example@domain.com)" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="מצב רפואי" value={medicalCondition} onChange={(e) => setMedicalCondition(e.target.value)} />

      <button className="add-patient-button" onClick={handleAddPatient}>הוסף מטופל</button>
      <button className="back-button" onClick={() => navigate('/patients')}>חזור לרשימת המטופלים</button>

    </div>
  );
}

export default AddPatientPage;
