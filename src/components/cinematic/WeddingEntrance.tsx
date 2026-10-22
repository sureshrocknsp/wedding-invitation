import React, { useState, useCallback, useEffect } from 'react';
import { WeddingInterior } from './WeddingInterior';
import { WeddingDoors } from './WeddingDoors';
import { CoupleNamesReveal } from './CoupleNamesReveal';
import { WeddingData } from '../../data/weddingData';

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
  const [isOpening, setIsOpening] = useState(false);
  const [isGoldenLightActive, setIsGoldenLightActive] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isCameraWalkIn, setIsCameraWalkIn] = useState(false);
  const [isVinayakaRevealed, setIsVinayakaRevealed] = useState(false);
  const [isMandapamRevealed, setIsMandapamRevealed] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [isCoupleNamesRevealed, setIsCoupleNamesRevealed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleProceedToInvitation = useCallback(() => {
    setIsDismissed(true);
    onComplete();
    setTimeout(() => {
      const inviteSection = document.getElementById('heroInvitation');
      if (inviteSection) {
        inviteSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  }, [onComplete]);

  const handleOpenDoors = useCallback(() => {
    if (isOpening) return;

    // 1. Start audio & celebratory temple bells (t = 0s)
    onAudioStart();

    // 2. Doors begin physical 3D rotation outward (t = 0s)
    setIsOpening(true);

    // 3. Golden light appears through opening seam (t = 0.3s)
    setTimeout(() => {
      setIsGoldenLightActive(true);
    }, 300);

    // 4. Doors swing open wide & camera walks forward into mandapam (t = 0.9s)
    setTimeout(() => {
      setIsDoorOpen(true);
      setIsCameraWalkIn(true);
      setIsMandapamRevealed(true);
    }, 900);

    // 5. Lord Vinayaka is illuminated at the center of the floral mandapam (t = 1.3s)
    setTimeout(() => {
      setIsVinayakaRevealed(true);
      setIsSettled(true);
    }, 1300);

    // 6. Couple names appear after the reveal (t = 2.4s)
    setTimeout(() => {
      setIsCoupleNamesRevealed(true);
    }, 2400);
  }, [isOpening, onAudioStart]);

  // Keyboard trigger (Enter, Space, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpening && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleOpenDoors();
      } else if (isOpening && (e.key === 'ArrowDown' || e.key === 'PageDown')) {
        handleProceedToInvitation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpening, handleOpenDoors, handleProceedToInvitation]);

  // Mouse wheel scroll to enter invitation directly once doors are open
  useEffect(() => {
    if (!isCoupleNamesRevealed) return;

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
  }, [isCoupleNamesRevealed, handleProceedToInvitation]);

  // Touch swipe-up to enter invitation on mobile
  useEffect(() => {
    if (!isCoupleNamesRevealed) return;

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
  }, [isCoupleNamesRevealed, handleProceedToInvitation]);

  if (isDismissed) {
    return null;
  }

  return (
    <section
      id="cinematicStage"
      className={`cinematic-entrance-viewport ${isOpening ? 'opening-started' : ''} ${
        isCameraWalkIn ? 'walk-in-active' : ''
      } ${isDismissed ? 'dismissed' : ''}`}
      aria-label="Cinematic Hindu Wedding Entrance and Reveal"
    >
      {/* Layer 1 (BACKGROUND): Photorealistic Vinayaka Kalyana Mandapam Interior Scene */}
      <WeddingInterior
        isOpening={isOpening}
        isGoldenLightActive={isGoldenLightActive}
        isVinayakaRevealed={isVinayakaRevealed}
        isMandapamRevealed={isMandapamRevealed}
        isSettled={isSettled}
      />

      {/* Layer 2 (MIDDLE): Realistic 3D Hinged Double Doors & Foreground Architectural Arch */}
      <WeddingDoors
        isOpening={isOpening}
        isGoldenLightActive={isGoldenLightActive}
        isDoorOpen={isDoorOpen}
        onTapToEnter={handleOpenDoors}
      />

      {/* Layer 3 (FOREGROUND): Couple Names Reveal Card - Appears after Vinayaka Mandapam is revealed */}
      <CoupleNamesReveal
        isRevealed={isCoupleNamesRevealed}
        brideName={data.couple.bride.name}
        groomName={data.couple.groom.name}
        teluguNames={`${data.couple.bride.teluguName} పరిణయం ${data.couple.groom.teluguName}`}
        onProceed={handleProceedToInvitation}
        autoProceedSeconds={5}
      />

      {/* Prominent, accessible Skip button whenever doors are opening */}
      {isOpening && (
        <button
          className="cinematic-skip-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleProceedToInvitation();
          }}
          type="button"
          aria-label="Skip entrance and go directly to Wedding Invitation"
        >
          <span>Skip to Invitation →</span>
        </button>
      )}
    </section>
  );
};

