import React, { useEffect, useState } from 'react';

interface CoupleNamesRevealProps {
  isRevealed: boolean;
  brideName: string;
  groomName: string;
  teluguNames?: string;
  onProceed: () => void;
  autoProceedSeconds?: number;
}

export const CoupleNamesReveal: React.FC<CoupleNamesRevealProps> = ({
  isRevealed,
  brideName,
  groomName,
  teluguNames,
  onProceed,
  autoProceedSeconds = 4
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(autoProceedSeconds);

  useEffect(() => {
    if (!isRevealed) return;

    setSecondsRemaining(autoProceedSeconds);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onProceed();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRevealed, autoProceedSeconds, onProceed]);

  if (!isRevealed) return null;

  return (
    <div
      className="couple-names-sanctum-card animate-card-fade-in"
      onClick={(e) => {
        e.stopPropagation();
        onProceed();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onProceed();
        }
      }}
      aria-label="Couple names card - Click or scroll down to enter invitation"
    >
      <div className="card-top-accent" aria-hidden="true"></div>
      <p className="names-tagline">శ్రీరస్తు • శుభమస్తు • కళ్యాణమస్తు</p>
      
      <div className="names-headline-row">
        <span className="bride-headline gold-shimmer-text">{brideName}</span>
        <span className="headline-amp">&</span>
        <span className="groom-headline gold-shimmer-text">{groomName}</span>
      </div>

      {teluguNames && (
        <div className="telugu-sub-names">
          {teluguNames}
        </div>
      )}

      <p className="names-invitation-request">
        We solicit your gracious presence with family & friends<br />
        at our auspicious wedding celebration.
      </p>

      {/* Primary Action Button */}
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

      {/* Auto-proceed Indicator & Swipe Hint */}
      <div className="auto-proceed-container" aria-hidden="true">
        <div className="auto-proceed-progress-bar">
          <div
            className="auto-proceed-progress-fill"
            style={{
              animationDuration: `${autoProceedSeconds}s`
            }}
          ></div>
        </div>
        <p className="auto-proceed-hint">
          {secondsRemaining > 0
            ? `Entering invitation in ${secondsRemaining}s... • or scroll / swipe up`
            : 'Stepping into the wedding hall...'}
        </p>
      </div>
    </div>
  );
};

