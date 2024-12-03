// PatientDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { getPatientById, getNotesByPatientId, addNoteToPatient } from '../api/patientApi';
import '../index.css';

function PatientDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState('');
  const [noteHistory, setNoteHistory] = useState([]);

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
    // שמירת הערות עבור המטופל
    addNoteToPatient(userId, notes)
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

  if (!patient) return <div>טוען נתונים...</div>;

  return (
    <div className="patient-details-container">
      <h2>פרטי מטופל: {patient.name}</h2>
      <p>תעודת זהות: {patient.userId}</p>
      <p>גיל: {patient.age}</p>
      <p>מצב: {patient.condition}</p>
      <h3>הערות קודמות</h3>
      <ul className="note-history">
        {noteHistory.map((note, index) => (
          <li key={index} className="note-item">{note}</li>
        ))}
      </ul>
      <textarea placeholder="רשום הערות" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button className="save-notes-button" onClick={handleSaveNotes}>שמור הערות</button>
      <button className="back-button" onClick={() => navigate('/patients')}>חזור לרשימת המטופלים</button>

    </div>
  );
}

export default PatientDetailsPage;
