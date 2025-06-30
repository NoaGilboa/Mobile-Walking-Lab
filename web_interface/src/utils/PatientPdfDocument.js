// PatientPdfDocument.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import '../utils/fonts';
import '../index.css';

// עיצוב PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Alef-Regular',
    },
    section: {
        marginBottom: 20,
        direction: 'rtl',
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        direction: 'rtl',
    },
    text: {
        fontSize: 12,
        marginBottom: 4,
        direction: 'rtl',
    },
    recommendationBox: {
        direction: 'rtl',
        padding: '10px',
        backgroundColor: '#f3f3f3',
        border: '1px solid #ccc'
    },
    note: {
        marginBottom: 8,
    },
    chartImage: {
        marginTop: 10,
        marginBottom: 20,
        width: '100%',
        height: 250,
    }
});

const PatientPdfDocument = ({ patient, notes, recommendation, chartImages }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* פרטי מטופל */}
            <View style={styles.section}>
                <Text style={styles.title}>פרטי מטופל</Text>
                <Text style={styles.text}>שם פרטי: {patient.first_name}</Text>
                <Text style={styles.text}>שם משפחה: {patient.last_name}</Text>
                <Text style={styles.text}>תעודת זהות: {patient.patient_id}</Text>
                <Text style={styles.text}>תאריך לידה: {new Date(patient.birth_date).toLocaleDateString('he-IL')}</Text>
                <Text style={styles.text}>גיל: {patient.age}</Text>
                <Text style={styles.text}>מין: {patient.gender}</Text>
                <Text style={styles.text}>משקל: {patient.weight} ק"ג</Text>
                <Text style={styles.text}>גובה: {patient.height} ס"מ</Text>
                <Text style={styles.text}>טלפון: {patient.phone}</Text>
                <Text style={styles.text}>אימייל: {patient.email}</Text>
                <Text style={styles.text}>מצב רפואי: {patient.medical_condition}</Text>
            </View>

            {/* הערות */}
            <View style={styles.section}>
                <Text style={styles.title}>הערות קודמות</Text>
                {notes.length === 0 ? (
                    <Text style={styles.text}>אין הערות</Text>
                ) : (
                    notes.map((n, idx) => (
                        <View key={idx} style={styles.note}>
                            <Text style={styles.text}>- {n.note}</Text>
                            <Text style={styles.text}>  נכתב על ידי {n.created_by_name} בתאריך {new Date(n.created_at).toLocaleString('he-IL')}</Text>
                        </View>
                    ))
                )}
            </View>

            {/* המלצה */}
            {recommendation && (
                <View style={styles.section}>
                    <Text style={styles.title}>המלצת GPT:</Text>
                    <View style={styles.recommendationBox}>
                        {recommendation.split('\n').map((line, index) => (
                            <Text key={index} style={styles.text}>{line}</Text>
                        ))}
                    </View>
                </View>
            )}

            {/* גרפים */}
            {chartImages?.map(({ title, base64 }, idx) => (
                <View key={idx} style={styles.section}>
                    <Text style={styles.title}>{title}</Text>
                    <Image src={base64} style={styles.chartImage} />
                </View>
            ))}
        </Page>
    </Document >
);

export default PatientPdfDocument;