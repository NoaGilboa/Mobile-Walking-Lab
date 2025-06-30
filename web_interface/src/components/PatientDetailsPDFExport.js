// PatientDetailsPDFExport.jsx
import React, { useEffect, useState, useRef } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PatientPdfDocument from '../utils/PatientPdfDocument';
import { calculateAge } from '../utils/formatUtils';

function PatientDetailsPDFExport({ patient, noteHistory, treatmentRecommendation, refs }) {
    const [chartImages, setChartImages] = useState([]);

    const generateChartImages = () => {
        const charts = [
            { ref: refs.manualChartRef, title: 'גרף מהירויות ידניות' },
            { ref: refs.espChartRef, title: 'גרף מהירויות מהבקר' },
            { ref: refs.handPressureChartRef, title: 'גרף לחץ ידיים מהבקר' },
            { ref: refs.footLiftChartRef, title: 'גרף מספר ניתוקים של הרגליים מהרצפה' }
        ];

        const newChartImages = charts
            .filter(c => c.ref?.current)
            .map(c => ({
                title: c.title,
                base64: c.ref.current.toBase64Image()
            }));

        setChartImages(newChartImages);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            generateChartImages();
        }, 1000);
        return () => clearTimeout(timeout);
    }, [refs.manualChartRef.current, refs.espChartRef.current, refs.handPressureChartRef.current, refs.footLiftChartRef.current]);

    const enrichedPatient = {
        ...patient,
        age: calculateAge(patient.birth_date),
    };

    return (
        <PDFDownloadLink   style={{ display: 'inline-block', marginBottom: '10px', marginTop:'10px' }}
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

                loading ? 'טוען PDF...' : (
                    <>
                        <img src="/images/pdf_download.svg" style={{ width: '20px', height: '20px', verticalAlign: 'middle', marginLeft: 5 }} alt="הורדה" />הורד PDF
                    </>
                )

            }
        </PDFDownloadLink>
    );
}

export default PatientDetailsPDFExport;
