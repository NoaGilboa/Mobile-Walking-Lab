// EditPatientPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, updatePatient } from '../api/patientApi';
import '../index.css';

function EditPatientPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    getPatientById(userId)
      .then((res) => setPatientData(res.data))
      .catch((err) => {
        console.error("Error fetching patient", err);
        alert("שגיאה בשליפת פרטי מטופל");
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    updatePatient(userId, patientData)
      .then(() => {
        alert("✅ פרטי המטופל עודכנו בהצלחה");
        navigate(`/patients/${userId}`);
      })
      .catch((err) => {
        console.error("Update error", err);
        alert("❌ שגיאה בעדכון המטופל");
      });
  };

  if (!patientData) return <div>טוען נתונים...</div>;

  return (
    <div className="edit-patient-container">
      <h2>עריכת פרטי מטופל</h2>
      <input type="text" name="first_name" value={patientData.first_name} onChange={handleChange} placeholder="שם פרטי" />
      <input type="text" name="last_name" value={patientData.last_name} onChange={handleChange} placeholder="שם משפחה" />
      <input type="date" name="birth_date" value={patientData.birth_date} onChange={handleChange} />
      <select name="gender" value={patientData.gender || ''} onChange={handleChange}>
        <option value="">בחר מין</option>
        <option value="זכר">זכר</option>
        <option value="נקבה">נקבה</option>
        <option value="אחר">אחר</option>
      </select>
      <input type="number" name="weight" value={patientData.weight} onChange={handleChange} placeholder="משקל בקילוגרמים" />
      <input type="number" name="height" value={patientData.height} onChange={handleChange} placeholder="גובה בסנימטרים" />
      <input type="tel" name="phone" value={patientData.phone} onChange={handleChange} placeholder="טלפון" />
      <input type="email" name="email" value={patientData.email} onChange={handleChange} placeholder="אימייל" />
      <input type="text" name="medical_condition" value={patientData.medical_condition} onChange={handleChange} placeholder="מצב רפואי" />
      <input type="text" name="mobility_status" value={patientData.mobility_status} onChange={handleChange} placeholder="מצב ניידות" />
      <button className="save-button" onClick={handleUpdate}>שמור שינויים</button>
      <button className="back-button" onClick={() => navigate(`/patients/${userId}`)}>ביטול</button>
    </div>
  );
}

export default EditPatientPage;
