// PatientDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, getNotesByPatientId, addNoteToPatient, getTreatmentRecommendation, saveSpeedMeasurement, getSpeedHistory } from '../api/patientApi';
import { startESP32Session, stopESP32Session } from '../api/espApi';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, } from 'chart.js';
ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

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
  const [chartType, setChartType] = useState('bar');



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
      .then(res => setSpeedHistory(res.data.reverse()))
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
        measured_at: new Date().toISOString(),
        source: 'manual',
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
    labels: speedHistory.map((item, idx) => {
      const date = new Date(item.measured_at);
      const timeStr = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString('he-IL');
      return `מדידה ${idx + 1}\n${dateStr}\n${timeStr}`;
    }),
    datasets: [
      {
        label: 'מהירות (קמ״ש)',
        data: speedHistory.map(item => item.speed_kmh || item.speed),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const item = speedHistory[context.dataIndex];
            const speed = item.speed_kmh || item.speed;
            const source = item.source || 'unknown';
            const footLifts = item.foot_lift_count != null ? item.foot_lift_count : 'N/A';
            return `מהירות: ${speed} קמ״ש\nמקור: ${source}\nצעדים: ${footLifts}`;
          }
        }
      }
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'מהירות בקמ״ש'
        }
      },
      x: {
        ticks: {
          callback: function (val, index) {
            const label = this.getLabelForValue(index);
            return label.split('\n');
          }
        }
      }
    }
  };

  const handleStartEspMeasurement = async () => {
    try {
      const response = await startESP32Session();
      alert("✅ מדידה התחילה: " + response.data);
      console.log(response.data);
    } catch (error) {
      console.error("❌ שגיאה בהתחלת מדידה בבקר", error);
      alert("❌ לא ניתן להתחיל מדידה כרגע. ודא שהבקר מחובר לרשת.");
    }
  };

  const handleStopEspMeasurement = async () => {
    try {
      const response = await stopESP32Session();
      alert("✅ מדידה הסתיימה ונשלחה לשרת");
      console.log(response.data);
    } catch (error) {
      console.error("❌ שגיאה בעצירת מדידה בבקר", error);
      alert("❌ לא ניתן לעצור מדידה כרגע. ודא שהבקר מחובר לרשת.");
    }
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
      <div className="esp-measurement-controls">
        <button className="recommendation-button" onClick={handleStartEspMeasurement}>
          ▶️ התחלת מדידה בבקר
        </button>
        <button className="recommendation-button" onClick={handleStopEspMeasurement}>
          ⏹️ סיום מדידה בבקר
        </button>
      </div>

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
              <button className="timer-button" onClick={() => setChartType(prev => prev === 'bar' ? 'line' : 'bar')}>
                שנה לגרף {chartType === 'bar' ? 'עקומה 📈' : 'עמודות 📊'}
              </button>

              {chartType === 'bar' ? (
                <Bar data={speedChartData} options={options} />
              ) : (
                <Line data={speedChartData} options={options} />
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}

export default PatientDetailsPage;
