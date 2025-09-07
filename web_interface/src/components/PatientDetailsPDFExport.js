// PatientDetailsPDFExport.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PatientPdfDocument from '../utils/PatientPdfDocument';
import { calculateAge } from '../utils/formatUtils';
import '../index.css';

function PatientDetailsPDFExport({ patient, noteHistory = [], treatmentRecommendation, refs }) {
  const [chartImages, setChartImages] = useState([]);

  const generateChartImages = useCallback(() => {
    const charts = [
      { ref: refs.manualChartRef, title: 'גרף מהירויות ידניות' },
      { ref: refs.espChartRef, title: 'גרף מהירויות מהבקר' },
      { ref: refs.handPressureChartRef, title: 'גרף לחץ ידיים מהבקר' },
      { ref: refs.footLiftChartRef, title: 'גרף מספר ניתוקים של הרגליים מהרצפה' },
    ];

    const newChartImages = charts
      .filter(c => c.ref?.current)
      .map(c => ({
        title: c.title,
        base64: c.ref.current.toBase64Image(),
      }));

    setChartImages(newChartImages);
  }, [refs.manualChartRef, refs.espChartRef, refs.handPressureChartRef, refs.footLiftChartRef]);

  useEffect(() => {
    const timeout = setTimeout(generateChartImages, 1000);
    return () => clearTimeout(timeout);
  }, [generateChartImages]);

  const enrichedPatient = {
    ...patient,
    age: calculateAge(patient.birth_date),
  };

  return (
    <PDFDownloadLink
      className="pdf-btn"
      role="button"
      aria-label="הורדת דו״ח PDF של המטופל"
      document={
        <PatientPdfDocument
          patient={enrichedPatient}
          notes={noteHistory}
          recommendation={treatmentRecommendation}
          chartImages={chartImages}
        />
      }
      fileName={`patient_${patient.patient_id}_details.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <span className="pdf-btn__spinner" aria-hidden="true" />
        ) : (
          <>
            <img
              src="/images/pdf_download.png"
              className="pdf-btn__icon"
              alt=""
              aria-hidden="true"
            />
          </>
        )
      }
    </PDFDownloadLink>
  );
}

export default PatientDetailsPDFExport;
