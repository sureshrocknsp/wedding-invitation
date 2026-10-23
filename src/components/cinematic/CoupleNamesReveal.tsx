import React, { useEffect, useState } from 'react';

export type CinematicState = 'closed' | 'opening' | 'revealing' | 'settling' | 'invitation';

interface CoupleNamesRevealProps {
  isRevealed: boolean;
  brideFullName: string;
  brideTeluguName: string;
  groomFullName: string;
  groomTeluguName: string;
  invitationMessageEnglish: string;
  invitationMessageTelugu: string;
  weddingDateFormatted: string;
  muhurthamTime: string;
  venueName: string;
  onProceed: () => void;
  autoProceedSeconds?: number;
}

export const CoupleNamesReveal: React.FC<CoupleNamesRevealProps> = ({
  isRevealed,
  brideFullName,
  brideTeluguName,
  groomFullName,
  groomTeluguName,
  invitationMessageEnglish,
  invitationMessageTelugu,
  weddingDateFormatted,
  muhurthamTime,
  venueName,
  onProceed,
  autoProceedSeconds = 5
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
      aria-label="Wedding Invitation Announcement - Click or scroll down to enter full invitation"
    >
      <div className="card-top-accent" aria-hidden="true"></div>

      {/* 1. Traditional Invocation & Family Invitation Header */}
      <div className="reveal-header-block">
        <p className="names-tagline">శ్రీరస్తు • శుభమస్తు • కళ్యాణమస్తు</p>
        <p className="together-families-label">Together with their families</p>
      </div>

      {/* 2. Couple Names: Bride & Groom in exact requested order */}
      <div className="couple-names-block">
        <div className="bride-name-unit">
          <h2 className="bride-headline gold-shimmer-text">{brideFullName}</h2>
          {brideTeluguName && <span className="telugu-sub-title">{brideTeluguName}</span>}
        </div>

        <div className="names-ampersand-divider" aria-hidden="true">
          <span className="headline-amp">&</span>
        </div>

        <div className="groom-name-unit">
          <h2 className="groom-headline gold-shimmer-text">{groomFullName}</h2>
          {groomTeluguName && <span className="telugu-sub-title">{groomTeluguName}</span>}
        </div>
      </div>

      {/* 3. Existing Invitation Message */}
      <div className="invitation-message-unit">
        <p className="names-invitation-request">
          {invitationMessageEnglish}
        </p>
        {invitationMessageTelugu && (
          <p className="names-invitation-telugu">
            {invitationMessageTelugu}
          </p>
        )}
      </div>

      {/* 4. Event & Venue pill */}
      <div className="reveal-event-summary-pill" aria-label={`Date: ${weddingDateFormatted}, Venue: ${venueName}`}>
        <span className="summary-pill-item">
          <span className="pill-icon" aria-hidden="true">🗓️</span>
          <span>{weddingDateFormatted} ({muhurthamTime})</span>
        </span>
        <span className="pill-dot" aria-hidden="true">•</span>
        <span className="summary-pill-item">
          <span className="pill-icon" aria-hidden="true">📍</span>
          <span>{venueName}</span>
        </span>
      </div>

      {/* 5. Primary Action Button */}
      <div className="card-action-row">
        <button
          className="enter-invitation-btn"
          onClick={(e) => {
            e.stopPropagation();
            onProceed();
          }}
          type="button"
          aria-label="Enter Wedding Invitation"
        >
          <span>Enter Wedding Invitation</span>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </button>
      </div>

      {/* 6. Auto-proceed Indicator & Scroll Hint */}
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
