// PatientDetailsPage.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, getNotesByPatientId, addNoteToPatient, getTreatmentRecommendation, saveSpeedMeasurement, getSpeedHistory } from '../api/patientApi';
import { setESP32Command, getDeviceMeasurements, saveDeviceMeasurements } from '../api/deviceApi';
import { Chart as ChartJS, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SpeedChart from '../components/charts/SpeedChart';
import PressureChart from '../components/charts/PressureChart';
import FootLiftChart from '../components/charts/FootLiftChart';
import { calculateAge, formatTime, reverseText} from '../utils/formatUtils.js';
import '.././fonts/Alef-Regular-normal.js';
import '../index.css';
ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);


function PatientDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState('');
  const [noteHistory, setNoteHistory] = useState([]);
  const [treatmentRecommendation, setTreatmentRecommendation] = useState('');
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [manualDistance, setManualDistance] = useState('');
  const [isTiming, setIsTiming] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [showManualSpeedSection, setShowManualSpeedSection] = useState(false);
  const [lastSpeed, setLastSpeed] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [espMeasurementRunning, setEspMeasurementRunning] = useState(false);
  const manualChartRef = useRef(null);
  const espChartRef = useRef(null);
  const footLiftChartRef = useRef(null);
  const handPressureChartRef = useRef(null);
  const [speedData, setSpeedData] = useState([]);
  const [distanceData, setDistanceData] = useState([]);
  const [pressureRight, setPressureRight] = useState([]);
  const [pressureLeft, setPressureLeft] = useState([]);
  const [footLiftR, setFootLiftR] = useState([]);
  const [footLiftL, setFootLiftL] = useState([]);
  const [chartTypes, setChartTypes] = useState({
    manual: 'bar',
    esp: 'bar',
    pressure: 'bar',
    footLift: 'bar',
  });
  const handleToggleChartType = (key) => {
    setChartTypes(prev => ({
      ...prev,
      [key]: prev[key] === 'bar' ? 'line' : 'bar'
    }));
  };



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

  const handleGetRecommendation = () => {
    setLoadingRecommendation(true);
    getTreatmentRecommendation(userId)
      .then(response => {
        setTreatmentRecommendation(response.data.recommendation);
      })
      .catch(error => {
        console.error("Error fetching treatment recommendation", error);
        alert("❌ לא ניתן לקבל המלצה לטיפול כעת. אנא נסה שוב מאוחר יותר.");
      })
      .finally(() => setLoadingRecommendation(false));
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

  const handleStartEspMeasurement = async () => {
    try {
      await handleStopEspMeasurement(true);
      const response = await setESP32Command('start', patient.id);
      setEspMeasurementRunning(true);
      setElapsedTime(0);
      setIsTiming(true);
      setStartTime(new Date());
      console.log(response.data);
      alert("✅ מדידה התחילה: " + response.data);
    } catch (error) {
      console.error("❌ שגיאה בהתחלת מדידה בבקר", error);
      alert("❌ לא ניתן להתחיל מדידה כרגע. ודא שהבקר מחובר לרשת.");
    }
  };

  const handleStopEspMeasurement = async (silent = false) => {
    try {
      const response = await setESP32Command('stop', patient.id);
      setEspMeasurementRunning(false);
      setIsTiming(false);
      setStartTime(null);

      if (!silent) {
        setTimeout(() => {
          getDeviceMeasurements(userId)
            .then(res => {
              setSpeedData(res.data.speed);
              setDistanceData(res.data.distance);
              setPressureRight(res.data.handPressureR);
              setPressureLeft(res.data.handPressureL);
              setFootLiftR(res.data.footLiftR);
              setFootLiftL(res.data.footLiftL);
            })
            .catch(err => {
              console.error("❌ שגיאה בשליפת מדידות לאחר סיום", err);
            });
        }, 3000);
        alert("✅ מדידה הסתיימה ונשלחה לשרת");
      }
      console.log(response.data);
    } catch (error) {
      console.error("❌ שגיאה בעצירת מדידה בבקר", error);
      if (!silent) alert("❌ לא ניתן לעצור מדידה כרגע. ודא שהבקר מחובר לרשת.");
    }
  };

  const handleExportPdf = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFont('Alef-Regular');
    const width = pdf.internal.pageSize.getWidth();
    const chartWidth = width - 20;
    const chartHeight = chartWidth * 0.6;

    const element = document.querySelector('.patient-details-container');
    const canvas = await html2canvas(element, {
      ignoreElements: (el) => el.tagName === 'CANVAS',
    });
    const imgData = canvas.toDataURL('image/png');
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);

    const addChart = (ref, title) => {
      if (ref?.current) {
        const img = ref.current.toBase64Image();
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setFont('Alef-Regular');
        pdf.text(reverseText(title), pdf.internal.pageSize.getWidth() - 10, 20, { align: 'right' });
        pdf.addImage(img, 'PNG', 10, 30, chartWidth, chartHeight);
      }
    };

    addChart(manualChartRef, 'גרף מהירויות ידניות');
    addChart(espChartRef, 'גרף מהירויות מהבקר');
    addChart(handPressureChartRef, 'גרף לחץ ידיים מהבקר');
    addChart(footLiftChartRef, 'גרף מספר ניתוקים של הרגליים מהרצפה');

    pdf.save(`patient_${patient?.patient_id}_details.pdf`);
  };

  useEffect(() => {
    getDeviceMeasurements(userId)
      .then(res => {
        setSpeedData(res.data.speed);
        setDistanceData(res.data.distance);
        setPressureRight(res.data.handPressureR);
        setPressureLeft(res.data.handPressureL);
        setFootLiftR(res.data.footLiftR);
        setFootLiftL(res.data.footLiftL);
      })
      .catch(err => {
        console.error("❌ שגיאה בשליפת מדידות מהבקר", err);
      });
  }, [userId]);

  if (!patient) return <div>טוען נתונים...</div>;

  return (
    <div className="patient-details-container">
      <button className="close-button" onClick={() => navigate('/patients')} title="חזור לרשימה">
        <img src="/images/arrow_back.svg" alt="חזור" className="back-icon" />
      </button>
      <h2 className="page-title">פרטי מטופל</h2>
      <div className="patient-info">
        <p><strong>שם פרטי:</strong> {patient.first_name}</p>
        <p><strong>שם משפחה:</strong> {patient.last_name}</p>
        <p><strong>תעודת זהות:</strong> {patient.patient_id}</p>
        <p><strong>תאריך לידה:</strong> {new Date(patient.birth_date).toLocaleDateString('he-IL')}</p>
        <p><strong>גיל:</strong> {calculateAge(patient.birth_date)}</p>
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
      <div />
      <button className="recommendation-button" onClick={handleSaveNotes}>שמור הערות</button>
      <button className="recommendation-button" onClick={handleGetRecommendation}>קבל המלצת טיפול</button>
      {loadingRecommendation && <p>⏳ ממתין לתשובת GPT...</p>}
      {treatmentRecommendation? (
        <div className="recommendation-box">
          <h3>המלצת טיפול:</h3>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              whiteSpace: 'pre-line',
              direction: 'rtl',
              padding: '10px',
              backgroundColor: '#f3f3f3',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          >
            {treatmentRecommendation}
          </div>
        </div>
      ) : (
        <p>אין עדיין המלצת טיפול.</p>
      )}

      <button className="recommendation-button" onClick={handleExportPdf}>📄 ייצא ל-PDF</button>

      <div className="esp-measurement-controls">
        <button className="recommendation-button" onClick={handleStartEspMeasurement} disabled={espMeasurementRunning}>
          ▶️ התחלת מדידה בבקר
        </button>
        <button className="recommendation-button" onClick={() => handleStopEspMeasurement(false)} disabled={!espMeasurementRunning}>
          ⏹️ סיום מדידה בבקר
        </button>
        {((isTiming || elapsedTime > 0) && espMeasurementRunning) && (
          <p className="timer-display">
            🕒 זמן מדידה: <strong>{formatTime(elapsedTime)}</strong>
          </p>
        )}
      </div>

      <button className="recommendation-button" onClick={() => setShowManualSpeedSection(prev => !prev)} disabled={espMeasurementRunning}>
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
        </div>

      )}
      {lastSpeed && (
        <p className="speed-result">
          ✅ מהירות מחושבת: <strong>{lastSpeed} קמ״ש</strong>
        </p>
      )}
      <SpeedChart
        chartType={chartTypes.manual}
        onToggle={() => handleToggleChartType('manual')}
        chartRef={manualChartRef}
        data={speedHistory}
        title={"ידניות"}
        type={'manual'}
      />

      <SpeedChart
        chartType={chartTypes.esp}
        onToggle={() => handleToggleChartType('esp')}
        chartRef={espChartRef}
        data={speedData}
        title={"מהבקר"}
        type={'esp'}
      />

      <PressureChart
        chartType={chartTypes.pressure}
        onToggle={() => handleToggleChartType('pressure')}
        chartRef={handPressureChartRef}
        leftData={pressureLeft}
        rightData={pressureRight}
      />

      <FootLiftChart
        chartType={chartTypes.footLift}
        onToggle={() => handleToggleChartType('footLift')}
        chartRef={footLiftChartRef}
        leftData={footLiftL}
        rightData={footLiftR}
      />
    </div >
  );
}

export default PatientDetailsPage;