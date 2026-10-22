import React, { useState, useCallback, useEffect } from 'react';
import { WeddingInterior } from './WeddingInterior';
import { WeddingDoors } from './WeddingDoors';
import { WeddingData } from '../../data/weddingData';

interface WeddingEntranceProps {
  data: WeddingData;
  onAudioStart: () => void;
  onPetalBurst: (x: number, y: number, count: number) => void;
  onComplete: () => void;
}

export const WeddingEntrance: React.FC<WeddingEntranceProps> = ({
  data,
  onAudioStart,
  onPetalBurst,
  onComplete
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isGoldenLightActive, setIsGoldenLightActive] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isCameraWalkIn, setIsCameraWalkIn] = useState(false);
  const [isVinayakaRevealed, setIsVinayakaRevealed] = useState(false);
  const [isVinayakaFaded, setIsVinayakaFaded] = useState(false);
  const [isMandapamRevealed, setIsMandapamRevealed] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
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

    // 1. Start audio & celebratory petal burst (t = 0s)
    onAudioStart();
    onPetalBurst(window.innerWidth / 2, window.innerHeight * 0.45, 45);

    // 2. Doors begin physical 3D rotation outward (t = 0s)
    setIsOpening(true);

    // 3. Golden light appears through opening seam (t = 0.3s)
    setTimeout(() => {
      setIsGoldenLightActive(true);
    }, 300);

    // 4. Reveal central Lord Vinayaka & Sacred Invocation (t = 0.8s)
    setTimeout(() => {
      setIsVinayakaRevealed(true);
    }, 800);

    // 5. Doors fully open & camera push forward into mandapam (t = 1.6s)
    setTimeout(() => {
      setIsDoorOpen(true);
      setIsCameraWalkIn(true);
    }, 1600);

    // 6. Full mandapam illuminated in wide view (t = 2.4s)
    setTimeout(() => {
      setIsMandapamRevealed(true);
    }, 2400);

    // 7. Lord Vinayaka & sacred invocation gently FADE OUT (t = 3.6s)
    setTimeout(() => {
      setIsVinayakaFaded(true);
      setIsSettled(true);
    }, 3600);

    // 8. Seamlessly glide directly into the main wedding invitation (t = 4.2s)
    setTimeout(() => {
      handleProceedToInvitation();
    }, 4200);
  }, [isOpening, onAudioStart, onPetalBurst, handleProceedToInvitation]);

  // Keyboard trigger (Enter, Space, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpening && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleOpenDoors();
      } else if (isOpening && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'Enter')) {
        handleProceedToInvitation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpening, handleOpenDoors, handleProceedToInvitation]);

  // Mouse wheel scroll to enter invitation directly
  useEffect(() => {
    if (!isOpening) return;

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
  }, [isOpening, handleProceedToInvitation]);

  // Touch swipe-up to enter invitation on mobile
  useEffect(() => {
    if (!isOpening) return;

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
      // User swiped up by more than 40px
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
  }, [isOpening, handleProceedToInvitation]);

  if (isDismissed) {
    return null;
  }

  return (
    <section
      id="cinematicStage"
      className={`cinematic-entrance-viewport ${isOpening ? 'opening-started' : ''} ${
        isCameraWalkIn ? 'walk-in-active' : ''
      } ${isDismissed ? 'dismissed' : ''}`}
      onClick={() => {
        if (!isOpening) {
          handleOpenDoors();
        } else {
          handleProceedToInvitation();
        }
      }}
      aria-label="Cinematic Hindu Wedding Entrance and Reveal"
    >
      {/* Layer 1 (BACKGROUND): Photorealistic Vinayaka Kalyana Mandapam Interior Scene */}
      <WeddingInterior
        isOpening={isOpening}
        isGoldenLightActive={isGoldenLightActive}
        isVinayakaRevealed={isVinayakaRevealed}
        isVinayakaFaded={isVinayakaFaded}
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

