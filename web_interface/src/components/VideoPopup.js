// components/VideoPopup.js
import React from 'react';
import '../index.css';

const VideoPopup = ({ videoUrl, onClose }) => {
  if (!videoUrl) return null;

  return (
    <div className="video-popup-overlay" onClick={onClose}>
      <div className="video-popup-content" onClick={(e) => e.stopPropagation()}>
        <video
          controls
          autoPlay
          style={{
            maxWidth: '90vw',
            maxHeight: '80vh',
            width: '100%',
            borderRadius: '8px'
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          הדפדפן שלך לא תומך בתגית וידאו.
        </video>
        <button className="close-video-btn" onClick={onClose}>✖ סגור</button>
      </div>
    </div>
  );
};

export default VideoPopup;
