// PatientListPage.js
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientsPaged } from '../api/patientApi';
import '../index.css';

function PatientListPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);                  // 0-based
  const [pageSize, setPageSize] = useState(4);
  const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'desc' });

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [qName, setQName] = useState('');
  const [qId, setQId] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setQName(searchName.toLowerCase().trim());
      setQId(searchId.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [searchName, searchId]);

  // Retrieve therapist data from local storage
  const therapistData = JSON.parse(localStorage.getItem('therapist'));
  const therapistName = therapistData ? therapistData.name : 'מטפל';

  const loadPage = async (nextPage = 0, nextSort = sortConfig, nextPageSize = pageSize, name = qName, id = qId) => {
    setLoading(true);
    try {
      const sortBy = nextSort.key;
      const sortDir = nextSort.direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      const res = await getPatientsPaged({
        page: nextPage,
        pageSize: nextPageSize,
        sortBy,
        sortDir,
        qName: name || undefined,
        qId: id || undefined
      });

      setRows(res.data || []);
      setTotalPages(res.totalPages || 0);
      setPage(nextPage);
    } catch (e) {
      console.error('Error fetching patients (paged):', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(page, sortConfig, pageSize, qName, qId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortConfig.key, sortConfig.direction, qName, qId]);

  const filteredRows = useMemo(() => {
    let filtered = rows;
    if (searchName.trim()) {
      const nameQ = searchName.toLowerCase();
      filtered = filtered.filter(p =>
        (`${p.first_name} ${p.last_name}`).toLowerCase().includes(nameQ)
      );
    }
    if (searchId.trim()) {
      filtered = filtered.filter(p => String(p.patient_id || '').includes(searchId));
    }
    return filtered;
  }, [rows, searchName, searchId]);

  const sortPatients = (key) => {
    setPage(0); // מתחילים מעמוד ראשון בכל שינוי סידור
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const getPageItems = (current, total, maxNeighbors = 1) => {
    // current 0-based; נהפוך 1-based להצגה
    const cur = current + 1;
    const items = [];
    const add = (v) => items.push(v);

    // תמיד מציגים את 1 ואת האחרון; בין לבין – שכנים של העמוד הנוכחי
    const start = Math.max(2, cur - maxNeighbors);
    const end = Math.min(total - 1, cur + maxNeighbors);

    add(1);
    if (start > 2) add('…');
    for (let i = start; i <= end; i++) add(i);
    if (end < total - 1) add('…');
    if (total > 1) add(total);

    return items;
  };

  const pageItems = getPageItems(page, totalPages || 1, 1);

  const handleGoto = (n1based) => {
    const n = Math.max(1, Math.min(n1based, totalPages || 1)) - 1; // back to 0-based
    setPage(n);
  };

  const handleLogout = () => {
    // Remove therapist data from local storage on logout
    localStorage.removeItem('therapist');
    navigate('/');
  };

  return (
    <div className="patient-list-container">
      <div className="header-container">
        <button className="logout-button" onClick={handleLogout}>התנתק</button>
        <div className="welcome-row">
          <span className="welcome-message">ברוך הבא, {therapistName}</span>
          <span className="context-id">
            הרצפלד · פיזיותרפיה · תפקיד: מטפל/ת
          </span>
        </div>
      </div>

      <h2>רשימת מטופלים</h2>

      <div className="search-container">
        <input type="text" placeholder="חפש לפי שם מלא" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <input type="text" placeholder="חפש לפי תעודת זהות" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
      </div>

      <button className="add-patient-button" onClick={() => navigate('/patients/add')}>הוסף מטופל חדש</button>


      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginInlineStart: 'auto' }}>
          כמות רשומות :{' '}
          <select
            value={pageSize}
            onChange={(e) => { setPage(0); setPageSize(Number(e.target.value)); }}
            style={{ width: '60px', padding: '4px 6px', fontSize: '14px', marginRight: '3px' }}>
            {[1, 4, 10, 20, 100].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <table className="patient-table">
        <thead>
          <tr>
            <th onClick={() => sortPatients('patient_id')}>ת"ז{getSortArrow('patient_id')}</th>
            <th onClick={() => sortPatients('first_name')}>שם מלא{getSortArrow('first_name')}</th>
            <th onClick={() => sortPatients('updated_at')}>עודכן לאחרונה{getSortArrow('updated_at')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map(patient => (
            <tr key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)}>
              <td>{patient.patient_id}</td>
              <td>{patient.first_name} {patient.last_name}</td>
              <td>{patient.updated_at ? new Date(patient.updated_at).toLocaleDateString('he-IL') : '—'}</td>
            </tr>
          ))}
          {!loading && filteredRows.length === 0 && (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16 }}>לא נמצאו תוצאות</td></tr>
          )}
          {loading && (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16 }}>טוען…</td></tr>
          )}
        </tbody>
      </table>

      <nav className="pager" aria-label="דפדוף עמודים" dir="rtl" style={{ marginTop: 12 }}>
        <button
          className="pager-btn pager-arrow"
          disabled={loading || page === 0}
          onClick={() => setPage(0)}
          aria-label="לעמוד הראשון"
        >
          <span aria-hidden="true" className="chev">≪</span>
        </button>
        <button
          className="pager-btn pager-arrow"
          disabled={loading || page === 0}
          onClick={() => setPage(p => Math.max(0, p - 1))}
          aria-label="לעמוד הקודם"
        >
          <span aria-hidden="true" className="chev">‹</span>
        </button>

        {pageItems.map((it, idx) =>
          it === '…' ? (
            <span key={`dots-${idx}`} className="pager-dots">…</span>
          ) : (
            <button
              key={it}
              className={`pager-btn ${page === (it - 1) ? 'active' : ''}`}
              onClick={() => handleGoto(it)}
              aria-current={page === (it - 1) ? 'page' : undefined}
              disabled={loading}
            >
              {it}
            </button>
          )
        )}

        <button
          className="pager-btn pager-arrow"
          disabled={loading || (page + 1) >= (totalPages || 1)}
          onClick={() => setPage(p => p + 1)}
          aria-label="לעמוד הבא"
        >
          <span aria-hidden="true" className="chev">›</span>
        </button>

        <button
          className="pager-btn pager-arrow"
          disabled={loading || (page + 1) >= (totalPages || 1)}
          onClick={() => setPage((totalPages || 1) - 1)}
          aria-label="לעמוד האחרון"
        >
          <span aria-hidden="true" className="chev">≫</span>
        </button>

      </nav>

    </div >
  );
}

export default PatientListPage;