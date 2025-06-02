// PatientDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, getNotesByPatientId, addNoteToPatient, getTreatmentRecommendation, saveSpeedMeasurement, getSpeedHistory } from '../api/patientApi';
import { getTreatmentRecommendation } from '../api/patientApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


import '../index.css';

function PatientDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState('');
  const [noteHistory, setNoteHistory] = useState([]);
  const [treatmentRecommendation, setTreatmentRecommendation] = useState('');
  const [manualDistance, setManualDistance] = useState('');
  const [isTiming, setIsTiming] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [speedHistory, setSpeedHistory] = useState([]);
const [showManualSpeedSection, setShowManualSpeedSection] = useState(false);
const [lastSpeed, setLastSpeed] = useState(null);
const [elapsedTime, setElapsedTime] = useState(0);



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
      getSpeedHistory(userId)
      .then(res => setSpeedHistory(res.data))
      .catch(err => console.error("שגיאה בשליפת היסטוריית מהירויות", err));

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

  useEffect(() => {
  let timer;

  if (isTiming) {
    timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  } else {
    clearInterval(timer);
  }

  return () => clearInterval(timer);
}, [isTiming]);

  const handleStartStopTimer = () => {
  if (isTiming) {
    const endTime = new Date();
    const durationSeconds = (endTime - startTime) / 1000;
    const distance = parseFloat(manualDistance);

    if (!distance || durationSeconds === 0) {
      alert("יש להזין מרחק חוקי לפני חישוב.");
      return;
    }

    const speed = distance / durationSeconds;
    const speedKmH = speed * 3.6;
    const speedResult = parseFloat(speedKmH.toFixed(2));
    const newRecord = {
      speed: speedResult,
      time: new Date().toLocaleTimeString('he-IL'),
    };

    setSpeedHistory(prev => [...prev, newRecord]);
    setLastSpeed(speedResult);
    setIsTiming(false);
    setManualDistance('');
    setStartTime(null);
    setElapsedTime(0);
      
    saveSpeedMeasurement(userId, speedResult)
    .catch(error => console.error("שגיאה בשמירת מהירות", error));

  } else {
    setStartTime(new Date());
    setIsTiming(true);
    setLastSpeed(null);
    setElapsedTime(0);
  }
};

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
};

const speedChartData = {
  labels: speedHistory.map((_, idx) => `מדידה ${idx + 1}`),
  datasets: [
    {
      label: 'מהירות (קמ״ש)',
      data: speedHistory.map(item => item.speed),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};


  if (!patient) return <div>טוען נתונים...</div>;

  return (
    <div className="patient-details-container">
      <h2>פרטי מטופל</h2>
      <div className="patient-info">
      <p><strong>שם פרטי:</strong> {patient.first_name}</p>
      <p><strong>שם משפחה:</strong> {patient.last_name}</p>
      <p><strong>תעודת זהות:</strong> {patient.patient_id}</p>
      <p><strong>תאריך לידה:</strong> {new Date(patient.birth_date).toLocaleDateString('he-IL')}</p>
      <p><strong>מין:</strong> {patient.gender}</p>
      <p><strong>משקל:</strong> {patient.weight} ק״ג</p>
      <p><strong>גובה:</strong> {patient.height} ס״מ</p>
      <p><strong>טלפון:</strong> {patient.phone}</p>
      <p><strong>אימייל:</strong> {patient.email}</p>
      <p><strong>מצב רפואי:</strong> {patient.medical_condition}</p>
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
  </div>

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
      <button className="recommendation-button" onClick={() => setShowManualSpeedSection(prev => !prev)}>
  {showManualSpeedSection ? 'סגור מדידת מהירות ידנית' : 'מדידת מהירות ידנית'}
</button>
{showManualSpeedSection && (
  <div className="manual-speed-section">
    <h3>מדידת מהירות ידנית</h3>
    <input
      type="number"
      placeholder="מרחק במטרים"
      value={manualDistance}
      onChange={(e) => setManualDistance(e.target.value)}
    />
    <button className="timer-button" onClick={handleStartStopTimer}>
      {isTiming ? 'עצור שעון וחשב מהירות' : 'התחל מדידת זמן'}
    </button>
    {isTiming && (
  <p className="timer-display">
    🕒 זמן נמדד: <strong>{formatTime(elapsedTime)}</strong>
  </p>
)}


    {lastSpeed && (
      <p className="speed-result">
        ✅ מהירות מחושבת: <strong>{lastSpeed} קמ״ש</strong>
      </p>
    )}

    {speedHistory.length > 0 && (
      <>
        <h4>היסטוריית מהירויות</h4>
        <Bar data={speedChartData} />
      </>
    )}
  </div>
)}

    </div>
  );
}

export default PatientDetailsPage;
