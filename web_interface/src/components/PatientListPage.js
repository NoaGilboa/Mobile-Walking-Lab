// PatientListPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPatients } from '../api/patientApi';
import '../index.css';

function PatientListPage() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'desc' });
  const navigate = useNavigate();

  // Retrieve therapist data from local storage
  const therapistData = JSON.parse(localStorage.getItem('therapist'));
  const therapistName = therapistData ? therapistData.name : 'מטפל';


  useEffect(() => {
    // בקשה לנתונים של המטופלים מהשרת
    getAllPatients()
      .then(response => {
        setPatients(response.data);
        setFilteredPatients(response.data);
      })
      .catch(error => {
        console.error("Error fetching patients", error);
      });
  }, []);

  useEffect(() => {
    const filtered = patients.filter(p => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      return (
        fullName.includes(searchName.toLowerCase()) &&
        p.patient_id.includes(searchId)
      );
    });
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
    setFilteredPatients(filtered);
  }, [searchName, searchId, patients, sortConfig]);

  const handleLogout = () => {
    // Remove therapist data from local storage on logout
    localStorage.removeItem('therapist');
    navigate('/login');
  };
  
  const sortPatients = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="patient-list-container">
      <div className="header-container">
        <div className="welcome-message">היי, {therapistName}</div>
        <button className="logout-button" onClick={handleLogout}>התנתק</button>
      </div>
      <h2>רשימת מטופלים</h2>

      <div className="search-container">
        <input type="text" placeholder="חפש לפי שם מלא" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <input type="text" placeholder="חפש לפי תעודת זהות" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
      </div>

      <button className="add-patient-button" onClick={() => navigate('/patients/add')}>➕ הוסף מטופל חדש</button>
      <table className="patient-table">
        <thead>
          <tr>
          <th onClick={() => sortPatients('patient_id')}>ת"ז{getSortArrow('patient_id')}</th>
            <th onClick={() => sortPatients('first_name')}>שם מלא{getSortArrow('first_name')}</th>
            <th onClick={() => sortPatients('updated_at')}>עודכן לאחרונה{getSortArrow('updated_at')}</th>
          </tr>
        </thead>
        <tbody>
        {filteredPatients.map(patient => (
            <tr key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)}>
             <td>{patient.patient_id}</td>
              <td>{patient.first_name} {patient.last_name}</td>
              <td>{patient.updated_at ? new Date(patient.updated_at).toLocaleDateString('he-IL') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientListPage;