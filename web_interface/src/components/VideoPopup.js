// components/VideoPopup.js
import React, { useEffect, useMemo, useRef } from 'react';
import '../index.css';

function inferMimeFromUrl(url) {
  if (!url) return null;
  const u = url.toLowerCase();

  // אם מגיע פרמטר mime ב-SAS/URL נשתמש בו
  try {
    const q = new URL(url);
    const mimeParam = q.searchParams.get('mime');
    if (mimeParam) return mimeParam;
  } catch (_) {}

  if (u.includes('.mp4')) return 'video/mp4';
  if (u.includes('.webm')) return 'video/webm';
  if (u.includes('.ogv') || u.includes('.ogg')) return 'video/ogg';
  if (u.includes('.avi')) return 'video/x-msvideo'; // דפדפנים לרוב לא תומכים
  return 'application/octet-stream';
}

const isBrowserPlayable = (mime) =>
  ['video/mp4', 'video/webm', 'video/ogg'].includes(mime);

const VideoPopup = ({ videoUrl, placeholderText, onClose }) => {
  const overlayRef = useRef(null);
  const mime = useMemo(() => inferMimeFromUrl(videoUrl), [videoUrl]);
  const playable = videoUrl && isBrowserPlayable(mime);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!videoUrl && !placeholderText) return null;

  return (
    <div
      className="video-popup-overlay"
      onClick={onClose}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="video-popup-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '85vh' }}
      >
        {videoUrl ? (
          playable ? (
            <video
              controls
              autoPlay
              playsInline
              controlsList="nodownload"
              style={{ width: '100%', maxHeight: '75vh', borderRadius: 8 }}
              onError={() => {
                // אם הנגן זרק שגיאה – נציג הודעת fallback
                console.warn('Video element failed to load, mime:', mime);
              }}
            >
              <source src={videoUrl} type={mime || 'video/mp4'} />
              הדפדפן שלך לא תומך בניגון וידאו זה.
            </video>
          ) : (
            <div className="video-placeholder">
              <div className="video-placeholder-icon">🎥</div>
              <div className="video-placeholder-text" style={{ marginBottom: 12 }}>
                הפורמט ({mime || 'לא ידוע'}) לא נתמך בדפדפן. ניתן להוריד ולצפות בנגן חיצוני (למשל VLC).
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href={videoUrl}
                  download
                  className="btn"
                  style={{ padding: '8px 12px', borderRadius: 8 }}
                >
                  ⬇️ הורידו את הווידאו
                </a>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: '8px 12px', borderRadius: 8 }}
                >
                  🌐 פתיחה בלשונית חדשה
                </a>
              </div>
            </div>
          )
        ) : (
          <div className="video-placeholder">
            <div className="video-placeholder-icon">🎥</div>
            <div className="video-placeholder-text">{placeholderText}</div>
          </div>
        )}

        <button className="close-video-btn" onClick={onClose} aria-label="סגור">
          ✖ סגור
        </button>
      </div>
    </div>
  );
};

export default VideoPopup;
