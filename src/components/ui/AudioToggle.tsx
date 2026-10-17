import React from 'react';

interface AudioToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ isPlaying, onToggle }) => {
  return (
    <div
      id="audioToggleBtn"
      className={`floating-audio-control ${isPlaying ? 'playing' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-label={isPlaying ? 'Mute Traditional Wedding Music' : 'Play Traditional Wedding Music'}
      title="Toggle Traditional Wedding Music"
    >
      <div className="music-disc-icon">🪔</div>
      <div className="music-info-group">
        <div className="audio-label">Wedding Nadaswaram</div>
        <div className="music-waves">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};
