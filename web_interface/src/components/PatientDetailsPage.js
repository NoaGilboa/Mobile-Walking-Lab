// PatientDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, getNotesByPatientId, addNoteToPatient } from '../api/patientApi';
import { getTreatmentRecommendation } from '../api/patientApi';

import '../index.css';

function PatientDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState('');
  const [noteHistory, setNoteHistory] = useState([]);
  const [treatmentRecommendation, setTreatmentRecommendation] = useState('');


  useEffect(() => {
    // בקשה לנתונים של המטופל לפי ה-ID
    getPatientById(userId)
      .then(response => {
        setPatient(response.data);
      })
      .catch(error => {
        console.error("Error fetching patient details", error);
      });

    // בקשה להיסטורית הערות
    getNotesByPatientId(userId)
      .then(response => {
        setNoteHistory(response.data);
      })
      .catch(error => {
        console.error("Error fetching notes history", error);
      });
  }, [userId]);

  const handleSaveNotes = () => {
    const therapist = JSON.parse(localStorage.getItem('therapist'));
    const therapistId = therapist?.id;

    if (!therapistId) {
      alert('❌ לא נמצאה כניסה למטפל המחובר. נסה להתחבר מחדש.');
      return;
    }
    // שמירת הערות עבור המטופל
    addNoteToPatient(userId, therapistId, notes)
      .then(() => {
        setNotes('');
        // רענון היסטורית הערות
        return getNotesByPatientId(userId);
      })
      .then(response => {
        setNoteHistory(response.data);
      })
      .catch(error => {
        console.error("Error saving note", error);
      });
  };

  const handleDeletePatient = () => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק את המטופל?");
    if (!confirmed) return;

    fetch(`${BASE_URL}/patients/${userId}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          alert("🗑️ המטופל נמחק");
          navigate('/patients');
        } else {
          alert("❌ שגיאה במחיקה");
        }
      })
      .catch((err) => {
        console.error("Error deleting patient", err);
        alert("❌ שגיאה בשרת");
      });
  };


  const handleGetRecommendation = () => {
    getTreatmentRecommendation(userId)
      .then(response => {
        setTreatmentRecommendation(response.data.recommendation);
      })
      .catch(error => {
        console.error("Error fetching treatment recommendation", error);
        alert("❌ לא ניתן לקבל המלצה לטיפול כעת. אנא נסה שוב מאוחר יותר.");
      });
  };

  if (!patient) return <div>טוען נתונים...</div>;

  return (
    <div className="patient-details-container">
      <h2>פרטי מטופל</h2>
      <p><strong>שם פרטי:</strong> {patient.first_name}</p>
      <p><strong>שם משפחה:</strong> {patient.last_name}</p>
      <p><strong>תעודת זהות:</strong> {patient.patient_id}</p>
      <p><strong>תאריך לידה:</strong> {patient.birth_date}</p>
      <p><strong>מין:</strong> {patient.gender}</p>
      <p><strong>משקל:</strong> {patient.weight} ק״ג</p>
      <p><strong>גובה:</strong> {patient.height} ס״מ</p>
      <p><strong>טלפון:</strong> {patient.phone}</p>
      <p><strong>אימייל:</strong> {patient.email}</p>
      <p><strong>מצב רפואי:</strong> {patient.medical_condition}</p>
      <p><strong>מצב ניידות:</strong> {patient.mobility_status}</p>
      <h3>הערות קודמות</h3>
      <h3>הערות קודמות</h3>
      <ul className="note-history">
        {noteHistory.map((item, index) => (
          <li key={index} className="note-item">
            <p>{item.note}</p>
            <p className="note-meta">
             נכתב על ידי <strong>{item.created_by_name}</strong> בתאריך {new Date(item.created_at).toLocaleString('he-IL')}
            </p>
          </li>
        ))}
      </ul>

      <textarea placeholder="רשום הערות" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button className="save-notes-button" onClick={handleSaveNotes}>שמור הערות</button>
      <button className="edit-button" onClick={() => navigate(`/patients/${userId}/edit`)}>✏️ ערוך</button>
      <button className="delete-button" onClick={handleDeletePatient}>🗑️ מחק</button>

      <button className="back-button" onClick={() => navigate('/patients')}>חזור לרשימת המטופלים</button>
      <button className="recommendation-button" onClick={handleGetRecommendation}>קבל המלצת טיפול</button>
      {treatmentRecommendation ? (
        <div className="recommendation-box">
          <h3>המלצת טיפול:</h3>
          <p>{treatmentRecommendation}</p>
        </div>
      ) : (
        <p>אין עדיין המלצת טיפול.</p>
      )}
    </div>
  );
}

export default PatientDetailsPage;
