// src/components/ConsentPopup.js
import React, { useEffect, useRef } from 'react';

const ConsentPopup = ({ open, onConfirm, onCancel }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open && dialogRef.current) {
      // פוקוס ראשוני לנגישות
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className="modal-card" ref={dialogRef} tabIndex={-1}>
        <h3 id="consent-title" className="modal-title">מידע חשוב לפני התחלת מדידה</h3>
        <ul className="modal-list">
          <li>המערכת תבצע מדידת נתוני הליכה (מהירות, מרחק, לחץ ידיים והרמות כף רגל).</li>
          <li>בעת המדידה יתבצע גם צילום וידאו ממוקד של כפות הרגליים לצורכי תיעוד וקליניקה.</li>
          <li>בלחיצה על "אני מאשר/ת" את/ה מאשר/ת את ביצוע המדידה והצילום.</li>
        </ul>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel} aria-label="ביטול">בטל</button>
          <button className="btn-primary" onClick={onConfirm} aria-label="אישור והתחלה">אני מאשר/ת והתחל מדידה</button>
        </div>
      </div>
    </div>
  );
};

export default ConsentPopup;
