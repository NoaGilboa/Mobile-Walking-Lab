// PatientListPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPatients } from '../api/patientApi'; // Import patient API
import '../index.css';

function PatientListPage() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  // Retrieve therapist data from local storage
  const therapistData = JSON.parse(localStorage.getItem('therapist'));
  const therapistName = therapistData ? therapistData.name : 'מטפל';


  useEffect(() => {
    // בקשה לנתונים של המטופלים מהשרת
    getAllPatients()
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error("Error fetching patients", error);
      });
  }, []);

  const handleLogout = () => {
    // Remove therapist data from local storage on logout
    localStorage.removeItem('therapist');
    navigate('/login');
  };

  return (
    <div className="patient-list-container">
      <div className="header-container">
      <div className="welcome-message">היי, {therapistName}</div>
      <button className="logout-button" onClick={handleLogout}>התנתק</button>
      </div>
      <h2>רשימת מטופלים</h2>
      <button className="add-patient-button" onClick={() => navigate('/patients/add')}>הוסף מטופל חדש</button>
      <table className="patient-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.userId} onClick={() => navigate(`/patients/${patient.userId}`)}>
              <td>{patient.userId}</td>
              <td>{patient.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientListPage;