import React, { useState, useCallback, useEffect, useRef } from 'react';
import { WeddingInterior } from './WeddingInterior';
import { WeddingDoors } from './WeddingDoors';
import { CoupleNamesReveal } from './CoupleNamesReveal';
import { WeddingData } from '../../data/weddingData';

export type CinematicState = 'closed' | 'opening' | 'revealing' | 'settling' | 'invitation';

interface WeddingEntranceProps {
  data: WeddingData;
  onAudioStart: () => void;
  onComplete: () => void;
}

export const WeddingEntrance: React.FC<WeddingEntranceProps> = ({
  data,
  onAudioStart,
  onComplete
}) => {
  const [cinematicState, setCinematicState] = useState<CinematicState>('closed');
  const [isDismissed, setIsDismissed] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const handleProceedToInvitation = useCallback(() => {
    clearAllTimers();
    setIsDismissed(true);
    onComplete();
    setTimeout(() => {
      const inviteSection = document.getElementById('heroInvitation');
      if (inviteSection) {
        inviteSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  }, [clearAllTimers, onComplete]);

  const handleOpenDoors = useCallback(() => {
    // Prevent repeated triggers while animation is in flight
    if (cinematicState !== 'closed') return;

    // 1. Start audio and celebratory temple bells
    onAudioStart();

    // Check for user reduced-motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCinematicState('invitation');
      return;
    }

    // 2. Closed -> Opening (t = 0s)
    // Doors start 3D rotation outward, golden light starts bursting
    setCinematicState('opening');

    // 3. Opening -> Revealing (t = 1.8s)
    // Doors sufficiently open; reveal the realistic Vinayaka mandapam image
    const tReveal = window.setTimeout(() => {
      setCinematicState('revealing');
    }, 1800);

    // 4. Revealing -> Settling (t = 2.8s)
    // Camera moves gently forward toward mandapam; Vinayaka remains centered in crisp visual focus
    const tSettle = window.setTimeout(() => {
      setCinematicState('settling');
    }, 2800);

    // 5. Settling -> Invitation (t = 4.4s)
    // Camera settles; fade in the couple names and invitation message
    const tInvite = window.setTimeout(() => {
      setCinematicState('invitation');
    }, 4400);

    timersRef.current = [tReveal, tSettle, tInvite];
  }, [cinematicState, onAudioStart]);

  // Keyboard navigation & accessibility (Enter, Space, Escape, ArrowDown, PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleProceedToInvitation();
        return;
      }

      if (cinematicState === 'closed') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenDoors();
        }
      } else if (cinematicState === 'invitation') {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') {
          e.preventDefault();
          handleProceedToInvitation();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cinematicState, handleOpenDoors, handleProceedToInvitation]);

  // Mouse wheel scroll to enter invitation directly once in 'invitation' state
  useEffect(() => {
    if (cinematicState !== 'invitation') return;

    let wheelAccumulator = 0;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 15) {
        wheelAccumulator += e.deltaY;
        if (wheelAccumulator > 30) {
          handleProceedToInvitation();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [cinematicState, handleProceedToInvitation]);

  // Touch swipe-up to enter invitation on mobile
  useEffect(() => {
    if (cinematicState !== 'invitation') return;

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY || !e.touches || !e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;
      if (diffY > 40) {
        handleProceedToInvitation();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [cinematicState, handleProceedToInvitation]);

  if (isDismissed) {
    return null;
  }

  return (
    <section
      id="cinematicStage"
      className={`cinematic-entrance-viewport state-${cinematicState} ${
        isDismissed ? 'dismissed' : ''
      }`}
      aria-label="Cinematic Hindu Wedding Entrance and Vinayaka Reveal"
    >
      {/* Layer 1 (BACKGROUND): Realistic Vinayaka Kalyana Mandapam Interior Scene */}
      <WeddingInterior state={cinematicState} />

      {/* Layer 2 (MIDDLE): Realistic 3D Hinged Double Doors & Foreground Architectural Arch */}
      <WeddingDoors
        state={cinematicState}
        onTapToEnter={handleOpenDoors}
      />

      {/* Layer 3 (FOREGROUND): Couple Names Reveal Card (Shown after camera settles) */}
      <CoupleNamesReveal
        isRevealed={cinematicState === 'invitation'}
        brideFullName={data.couple.bride.fullName}
        brideTeluguName={data.couple.bride.teluguName}
        groomFullName={data.couple.groom.fullName}
        groomTeluguName={data.couple.groom.teluguName}
        invitationMessageEnglish={data.invitationNoteEnglish}
        invitationMessageTelugu={data.invitationNoteTelugu}
        weddingDateFormatted={data.weddingDateFormatted}
        muhurthamTime={data.muhurthamTime}
        venueName={data.venue.name}
        onProceed={handleProceedToInvitation}
        autoProceedSeconds={5}
      />

      {/* Accessible Direct Access / Skip Button — Available at all times for returning visitors */}
      <button
        className="cinematic-skip-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleProceedToInvitation();
        }}
        type="button"
        aria-label={
          cinematicState === 'closed'
            ? 'Directly enter Wedding Invitation without opening sequence'
            : 'Skip cinematic sequence and go directly to Wedding Invitation'
        }
        title="Direct to Wedding Invitation"
      >
        <span>{cinematicState === 'closed' ? 'Direct to Invitation →' : 'Skip to Invitation →'}</span>
      </button>
    </section>
  );
};
