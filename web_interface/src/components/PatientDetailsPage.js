// src/components/PatientDetailsPage.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPatientById,
  getNotesByPatientId,
  getNotesByPatientIdPaged,
  addNoteToPatient,
  getTreatmentRecommendation,
  saveSpeedMeasurement,
  getSpeedHistory,
} from '../api/patientApi';
import {
  setESP32Command,
  getDeviceMeasurements,
  getVideoStreamByMeasurementUrl,
  getVideoStreamByTimeUrl,
} from '../api/deviceApi';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

import SpeedChart from '../components/charts/SpeedChart';
import PressureChart from '../components/charts/PressureChart';
import FootLiftChart from '../components/charts/FootLiftChart';
import { calculateAge, formatTime } from '../utils/formatUtils';
import PatientDetailsPDFExport from '../components/PatientDetailsPDFExport';
import VideoPopup from '../components/VideoPopup';
import '../index.css';

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// -------------------------------------------------------------
// Component
// -------------------------------------------------------------
function PatientDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // ---------- Patient ----------
  const [patient, setPatient] = useState(null);

  // ---------- Notes (paged + for PDF) ----------
  const NOTES_PAGE_SIZE = 3;
  const [notesInput, setNotesInput] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notesPage, setNotesPage] = useState(0); // zero-based
  const [notesPaged, setNotesPaged] = useState({
    data: [],
    page: 0,
    pageSize: NOTES_PAGE_SIZE,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [allNotesForPdf, setAllNotesForPdf] = useState([]);

  // ---------- GPT ----------
  const [treatmentRecommendation, setTreatmentRecommendation] = useState('');
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  // ---------- Manual measurement ----------
  const [showManualSpeedSection, setShowManualSpeedSection] = useState(false);
  const [manualDistance, setManualDistance] = useState('');
  const [manualIsTiming, setManualIsTiming] = useState(false);
  const [manualStartTime, setManualStartTime] = useState(null);
  const [manualElapsedTime, setManualElapsedTime] = useState(0);
  const [lastSpeed, setLastSpeed] = useState(null); // km/h

  // ---------- ESP measurement ----------
  const [espMeasurementRunning, setEspMeasurementRunning] = useState(false);
  const [espIsTiming, setEspIsTiming] = useState(false);
  const [espElapsedTime, setEspElapsedTime] = useState(0);

  // ---------- Charts data ----------
  const [speedHistory, setSpeedHistory] = useState([]); // manual history
  const [speedData, setSpeedData] = useState([]); // esp speeds
  const [pressureRight, setPressureRight] = useState([]);
  const [pressureLeft, setPressureLeft] = useState([]);
  const [footLiftR, setFootLiftR] = useState([]);
  const [footLiftL, setFootLiftL] = useState([]);

  // ---------- Charts refs ----------
  const manualChartRef = useRef(null);
  const espChartRef = useRef(null);
  const footLiftChartRef = useRef(null);
  const handPressureChartRef = useRef(null);

  // ---------- Chart types (bar/line) ----------
  const [chartTypes, setChartTypes] = useState({
    manual: 'bar',
    esp: 'bar',
    pressure: 'bar',
    footLift: 'bar',
  });

  const handleToggleChartType = useCallback((key) => {
    setChartTypes((prev) => ({
      ...prev,
      [key]: prev[key] === 'bar' ? 'line' : 'bar',
    }));
  }, []);

  // ---------- Video popup ----------
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoPlaceholder, setVideoPlaceholder] = useState(null);

  // -------------------------------------------------------------
  // Data Loaders
  // -------------------------------------------------------------
  const loadPatient = useCallback(async () => {
    try {
      const res = await getPatientById(userId);
      setPatient(res?.data ?? null);
    } catch (err) {
      console.error('Error fetching patient details', err);
    }
  }, [userId]);

  const loadAllNotesForPdf = useCallback(async () => {
    try {
      const res = await getNotesByPatientId(userId); // returns array
      setAllNotesForPdf(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error('Error fetching all notes for PDF', e);
      setAllNotesForPdf([]);
    }
  }, [userId]);

  const loadNotesPage = useCallback(
    async (page = 0) => {
      setLoadingNotes(true);
      try {
        // expected response shape: { data, page, pageSize, total, totalPages, hasNext, hasPrev }
        const res = await getNotesByPatientIdPaged(userId, {
          page,
          pageSize: NOTES_PAGE_SIZE,
          sortBy: 'created_at',
          sortDir: 'DESC',
        });
        setNotesPaged(res);
        setNotesPage(page);
      } catch (e) {
        console.error('Error fetching paged notes', e);
      } finally {
        setLoadingNotes(false);
      }
    },
    [userId]
  );

  const loadManualHistory = useCallback(async () => {
    try {
      const res = await getSpeedHistory(userId);
      // reverse for ascending time
      setSpeedHistory((res?.data ?? []).slice().reverse());
    } catch (err) {
      console.error('שגיאה בשליפת היסטוריית מהירויות', err);
    }
  }, [userId]);

  const loadDeviceMeasurements = useCallback(async () => {
    try {
      const res = await getDeviceMeasurements(userId);
      const d = res?.data ?? {};
      setSpeedData(d.speed ?? []);
      setPressureRight(d.handPressureR ?? []);
      setPressureLeft(d.handPressureL ?? []);
      setFootLiftR(d.footLiftR ?? []);
      setFootLiftL(d.footLiftL ?? []);
    } catch (err) {
      console.error('❌ שגיאה בשליפת מדידות מהבקר', err);
    }
  }, [userId]);

  // -------------------------------------------------------------
  // Initial load
  // -------------------------------------------------------------
  useEffect(() => {
    loadPatient();
    loadNotesPage(0);
    loadAllNotesForPdf();
    loadManualHistory();
    loadDeviceMeasurements();
  }, [
    loadPatient,
    loadNotesPage,
    loadAllNotesForPdf,
    loadManualHistory,
    loadDeviceMeasurements,
  ]);

  // -------------------------------------------------------------
  // Timers
  // -------------------------------------------------------------
  useEffect(() => {
    if (!manualIsTiming) return;
    const t = setInterval(() => setManualElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(t);
  }, [manualIsTiming]);

  useEffect(() => {
    if (!espIsTiming) return;
    const t = setInterval(() => setEspElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(t);
  }, [espIsTiming]);

  // -------------------------------------------------------------
  // Handlers - Notes & GPT
  // -------------------------------------------------------------
  const handleSaveNotes = useCallback(async () => {
    const therapist = JSON.parse(localStorage.getItem('therapist'));
    const therapistId = therapist?.id;

    if (!therapistId) {
      alert('❌ לא נמצאה כניסה למטפל המחובר. נסה להתחבר מחדש.');
      return;
    }
    try {
      await addNoteToPatient(userId, therapistId, notesInput);
      setNotesInput('');
      await loadNotesPage(0);
      await loadAllNotesForPdf();
    } catch (error) {
      console.error('Error saving note', error);
    }
  }, [userId, notesInput, loadNotesPage, loadAllNotesForPdf]);

  const handleGetRecommendation = useCallback(async () => {
    setLoadingRecommendation(true);
    try {
      const response = await getTreatmentRecommendation(userId);
      setTreatmentRecommendation(response?.data?.recommendation ?? '');
    } catch (error) {
      console.error('Error fetching treatment recommendation', error);
      alert('❌ לא ניתן לקבל המלצה לטיפול כעת. אנא נסה שוב מאוחר יותר.');
    } finally {
      setLoadingRecommendation(false);
    }
  }, [userId]);

  // -------------------------------------------------------------
  // Handlers - Manual measurement
  // -------------------------------------------------------------
  const handleStartStopTimer = useCallback(async () => {
    if (manualIsTiming) {
      // stop & compute
      const endTime = new Date();
      const durationSeconds = (endTime - manualStartTime) / 1000;
      const distance = parseFloat(manualDistance);

      if (!distance || !isFinite(distance) || durationSeconds <= 0) {
        alert('יש להזין מרחק חוקי לפני חישוב.');
        return;
      }

      const mps = distance / durationSeconds; // m/s
      const kmh = +(mps * 3.6).toFixed(2);

      const newRecord = {
        speed: kmh,
        measured_at: new Date().toISOString(),
        source: 'manual',
        time: new Date().toLocaleTimeString('he-IL'),
      };

      setSpeedHistory((prev) => [...prev, newRecord]);
      setLastSpeed(kmh);
      setManualIsTiming(false);
      setManualStartTime(null);
      setManualElapsedTime(0);
      setManualDistance('');

      try {
        await saveSpeedMeasurement(userId, kmh);
      } catch (error) {
        console.error('שגיאה בשמירת מהירות', error);
      }
    } else {
      // start
      setManualStartTime(new Date());
      setManualIsTiming(true);
      setLastSpeed(null);
      setManualElapsedTime(0);
    }
  }, [manualIsTiming, manualStartTime, manualDistance, userId]);

  // -------------------------------------------------------------
  // Handlers - ESP measurement
  // -------------------------------------------------------------
  const handleStopEspMeasurement = useCallback(
    async (silent = false) => {
      try {
        if (!patient?.id) throw new Error('patient id missing');

        const response = await setESP32Command('stop', patient.id);
        setEspMeasurementRunning(false);
        setEspIsTiming(false);

        if (!silent) {
          // תן לבקר זמן לסגור קבצים/לשלוח
          setTimeout(async () => {
            await loadDeviceMeasurements();
          }, 3000);
          alert('✅ מדידה הסתיימה ונשלחה לשרת');
        }
        console.log(response.data);
      } catch (error) {
        console.error('❌ שגיאה בעצירת מדידה בבקר', error);
        if (!silent) alert('❌ לא ניתן לעצור מדידה כרגע. ודא שהבקר מחובר לרשת.');
      }
    },
    [patient, loadDeviceMeasurements]
  );

  const handleStartEspMeasurement = useCallback(async () => {
    try {
      // ensure any existing measurement is stopped quietly first
      await handleStopEspMeasurement(true);
      if (!patient?.id) throw new Error('patient id missing');

      const response = await setESP32Command('start', patient.id);
      setEspMeasurementRunning(true);
      setEspIsTiming(true);
      setEspElapsedTime(0);

      console.log(response.data);
      alert('✅ מדידה התחילה: ' + response.data);
    } catch (error) {
      console.error('❌ שגיאה בהתחלת מדידה בבקר', error);
      alert('❌ לא ניתן להתחיל מדידה כרגע. ודא שהבקר מחובר לרשת.');
    }
  }, [patient, handleStopEspMeasurement]);

  // -------------------------------------------------------------
  // Handlers - Video
  // -------------------------------------------------------------
  const handleVideoOpen = useCallback(
    async (measurementId, measuredAt) => {
      const pid = patient?.id ?? Number(userId);
      console.log('open video params', { measurementId, measuredAt, pid, userId });

      try {
        setVideoUrl(null);
        setVideoPlaceholder('טוען סרטון...');

        if (measurementId) {
          const streamUrl = getVideoStreamByMeasurementUrl(measurementId);
          console.log('Using measurement stream URL:', streamUrl);
          setVideoUrl(streamUrl);
          return;
        }

        if (pid && measuredAt) {
          const iso = new Date(measuredAt).toISOString();
          const streamUrl = getVideoStreamByTimeUrl(pid, iso, 900);
          console.log('Using time-based stream URL:', streamUrl);
          try {
            const head = await fetch(streamUrl, { method: 'HEAD' });
            if (head.ok) {
              setVideoUrl(streamUrl);
              setVideoPlaceholder(null);
            } else {
              setVideoUrl(null);
              setVideoPlaceholder('לא נמצא סרטון תואם למדידה');
            }
          } catch {
            setVideoUrl(null);
            setVideoPlaceholder('לא נמצא סרטון תואם למדידה');
          }
          return;
        }
        setVideoUrl(null);
        setVideoPlaceholder('לא נמצא סרטון תואם למדידה');
      } catch (err) {
        console.error('Error setting up video stream:', err);
        setVideoUrl(null);
        setVideoPlaceholder('שגיאה בטעינת הסרטון');
      }
    },
    [patient, userId]
  );

  // -------------------------------------------------------------
  // Render
  // -------------------------------------------------------------
  if (!patient) return <div>טוען נתונים...</div>;

  return (
    <div className="patient-details-container">
      {/* Header */}
      <button className="close-button" onClick={() => navigate('/patients')} title="חזור לרשימה">
        <img src="/images/arrow_back.svg" alt="חזור" className="back-icon" />
      </button>
      <h2 className="page-title">פרטי מטופל</h2>

      {/* Patient info */}
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

        {/* Notes Paged */}
        <h3>הערות קודמות</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="pager-btn pager-arrow"
            aria-label="לעמוד הקודם"
            disabled={loadingNotes || !notesPaged.hasPrev}
            onClick={() => loadNotesPage(Math.max(0, notesPage - 1))}
          >
            <span aria-hidden="true" className="chev">‹</span>
          </button>

          <div style={{ flex: 1 }}>
            {loadingNotes ? (
              <div style={{ textAlign: 'center', padding: 8 }}>טוען הערות…</div>
            ) : (notesPaged.data ?? []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: 8 }}>אין הערות</div>
            ) : (
              <ul className="note-history">
                {notesPaged.data.map((item) => (
                  <li key={item.id ?? item.created_at} className="note-item">
                    <p>{item.note}</p>
                    <p className="note-meta">
                      נכתב על ידי <strong>{item.created_by_name}</strong> בתאריך{' '}
                      {new Date(item.created_at).toLocaleString('he-IL')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ textAlign: 'center', fontSize: 12, color: '#666' }}>
              כרטיסיית הערות {notesPaged.totalPages ? notesPaged.page + 1 : 1} מתוך {notesPaged.totalPages || 1}
            </div>
          </div>

          <button
            className="pager-btn pager-arrow"
            aria-label="לעמוד הבא"
            disabled={loadingNotes || !notesPaged.hasNext}
            onClick={() => loadNotesPage(notesPage + 1)}
          >
            <span aria-hidden="true" className="chev">›</span>
          </button>
        </div>
      </div>

      {/* Add note + GPT */}
      <textarea
        placeholder="רשום הערות"
        value={notesInput}
        onChange={(e) => setNotesInput(e.target.value)}
      />
      <div />
      <button className="recommendation-button" onClick={handleSaveNotes}>שמור הערות</button>
      <button className="recommendation-button" onClick={handleGetRecommendation}>קבל המלצת טיפול מ-GPT</button>

      {loadingRecommendation && <p>⏳ ממתין לתשובת GPT...</p>}

      {treatmentRecommendation ? (
        <div className="recommendation-box">
          <h3>המלצת טיפול מ-GPT:</h3>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              whiteSpace: 'pre-line',
              direction: 'rtl',
              padding: '10px',
              backgroundColor: '#f3f3f3',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            {treatmentRecommendation}
          </div>
        </div>
      ) : (
        <p>אין עדיין המלצת טיפול.</p>
      )}

      {/* PDF Export */}
      <PatientDetailsPDFExport
        patient={patient}
        noteHistory={allNotesForPdf}
        treatmentRecommendation={treatmentRecommendation}
        refs={{
          manualChartRef,
          espChartRef,
          handPressureChartRef,
          footLiftChartRef,
        }}
      />

      {/* Consent / Policy */}
      <div className="measurement-policy-box">
        <p className="measurement-policy-title">מידע חשוב לפני התחלת מדידה</p>
        <ul className="measurement-policy-list">
          <li>המערכת תבצע מדידת נתוני הליכה (מהירות, מרחק, לחץ ידיים והרמות כף רגל).</li>
          <li>בעת המדידה תתבצע גם צילום וידאו ממוקד של כף/כפות הרגליים לצורכי תיעוד וקליניקה.</li>
          <li>בלחיצה על "התחלת מדידה בבקר" הינך מאשר/ת את ביצוע המדידה והצילום.</li>
        </ul>
      </div>

      {/* ESP Controls */}
      <div className="esp-measurement-controls">
        <button
          className="recommendation-button"
          onClick={handleStartEspMeasurement}
          disabled={espMeasurementRunning}
        >
          ▶️ התחלת מדידה בבקר
        </button>
        <button
          className="recommendation-button"
          onClick={() => handleStopEspMeasurement(false)}
          disabled={!espMeasurementRunning}
        >
          ⏹️ סיום מדידה בבקר
        </button>

        {((espIsTiming || espElapsedTime > 0) && espMeasurementRunning) && (
          <p className="timer-display">
            🕒 זמן מדידה: <strong>{formatTime(espElapsedTime)}</strong>
          </p>
        )}
      </div>

      {/* Manual measurement toggle */}
      <button
        className="recommendation-button"
        onClick={() => setShowManualSpeedSection((prev) => !prev)}
        disabled={espMeasurementRunning}
      >
        {showManualSpeedSection ? 'סגור מדידת מהירות ידנית' : 'מדידת מהירות ידנית'}
      </button>

      {/* Manual measurement box */}
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
            {manualIsTiming ? 'עצור שעון וחשב מהירות' : 'התחל מדידת זמן'}
          </button>

          {manualIsTiming && (
            <p className="timer-display">
              🕒 זמן נמדד: <strong>{formatTime(manualElapsedTime)}</strong>
            </p>
          )}

          {lastSpeed && (
            <p className="speed-result">
              ✅ מהירות מחושבת: <strong>{lastSpeed} קמ״ש</strong>
            </p>
          )}
        </div>
      )}

      {/* Charts */}
      <SpeedChart
        chartType={chartTypes.manual}
        onToggle={() => handleToggleChartType('manual')}
        chartRef={manualChartRef}
        data={speedHistory}
        title="ידניות"
        type="manual"
      />

      <p className="chart-tip">
        💡 לחיצה על עמודה בגרף המהירויות מהבקר תפתח פופ-אפ של סרטון המדידה <br/>(אם קיים).
      </p>

      <SpeedChart
        chartType={chartTypes.esp}
        onToggle={() => handleToggleChartType('esp')}
        chartRef={espChartRef}
        data={speedData}
        title="מהבקר"
        type="esp"
        onBarClick={handleVideoOpen}
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

      {/* Video popup */}
      <VideoPopup
        videoUrl={videoUrl}
        placeholderText={videoPlaceholder}
        onClose={() => {
          setVideoUrl(null);
          setVideoPlaceholder(null);
        }}
      />
    </div>
  );
}

export default PatientDetailsPage;
