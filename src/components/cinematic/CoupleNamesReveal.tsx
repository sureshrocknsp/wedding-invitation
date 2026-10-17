import React from 'react';

interface CoupleNamesRevealProps {
  isRevealed: boolean;
  brideName: string;
  groomName: string;
  teluguNames?: string;
  onProceed: () => void;
}

export const CoupleNamesReveal: React.FC<CoupleNamesRevealProps> = ({
  isRevealed,
  brideName,
  groomName,
  teluguNames,
  onProceed
}) => {
  if (!isRevealed) return null;

  return (
    <div
      className="couple-names-sanctum-card animate-card-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="card-top-accent" aria-hidden="true"></div>
      <p className="names-tagline">శ్రీరస్తు • శుభమస్తు • కళ్యాణమస్తు</p>
      
      <div className="names-headline-row">
        <span className="bride-headline gold-shimmer-text">{brideName}</span>
        <span className="headline-amp">&</span>
        <span className="groom-headline gold-shimmer-text">{groomName}</span>
      </div>

      {teluguNames && (
        <div
          className="telugu-sub-names"
          style={{
            color: '#f9d976',
            fontSize: '1.05rem',
            margin: '2px 0 10px',
            fontFamily: 'serif',
            letterSpacing: '0.5px'
          }}
        >
          {teluguNames}
        </div>
      )}

      <p className="names-invitation-request">
        We solicit your gracious presence with family & friends<br />
        at their auspicious wedding celebration.
      </p>

      <button
        className="enter-invitation-btn"
        onClick={(e) => {
          e.stopPropagation();
          onProceed();
        }}
        type="button"
        aria-label="Enter Full Wedding Invitation"
      >
        <span>Enter Wedding Invitation</span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </svg>
      </button>
    </div>
  );
};

