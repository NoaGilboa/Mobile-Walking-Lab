// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UserGuidePage from './components/UserGuidePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PatientListPage from './components/PatientListPage';
import PatientDetailsPage from './components/PatientDetailsPage';
import AddPatientPage from './components/AddPatientPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/guide" element={<UserGuidePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/patients" element={<PatientListPage />} />
        <Route path="/patients/add" element={<AddPatientPage />} />
        <Route path="/patients/:userId" element={<PatientDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;