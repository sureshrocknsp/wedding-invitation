import React, { useState, useCallback, useEffect } from 'react';
import { WeddingInterior } from './WeddingInterior';
import { WeddingDoors } from './WeddingDoors';
import { CoupleNamesReveal } from './CoupleNamesReveal';
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
  const [isMandapamRevealed, setIsMandapamRevealed] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [isNamesRevealed, setIsNamesRevealed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleOpenDoors = useCallback(() => {
    if (isOpening) return;

    // 1. Start audio & celebratory petal burst (t = 0s)
    onAudioStart();
    onPetalBurst(window.innerWidth / 2, window.innerHeight * 0.45, 45);

    // 2. Doors begin physical 3D rotation outward (t = 0s)
    setIsOpening(true);

    // 3. Golden light appears through opening seam (t = 0.4s)
    setTimeout(() => {
      setIsGoldenLightActive(true);
    }, 400);

    // 4. At ~60% door open, begin revealing central Lord Vinayaka (t = 1.3s)
    setTimeout(() => {
      setIsVinayakaRevealed(true);
    }, 1300);

    // 5. Doors fully open & subtle camera push forward through entrance (t = 2.4s)
    setTimeout(() => {
      setIsDoorOpen(true);
      setIsCameraWalkIn(true);
    }, 2400);

    // 6. Full mandapam illuminated in wide view (t = 3.6s)
    setTimeout(() => {
      setIsMandapamRevealed(true);
    }, 3600);

    // 7. Camera settles into place (t = 5.0s)
    setTimeout(() => {
      setIsSettled(true);
    }, 5000);

    // 8. Couple Names card fades in gracefully (t = 6.0s)
    setTimeout(() => {
      setIsNamesRevealed(true);
    }, 6000);
  }, [isOpening, onAudioStart, onPetalBurst]);


  const handleProceedToInvitation = useCallback(() => {
    setIsDismissed(true);
    onComplete();
    setTimeout(() => {
      const inviteSection = document.getElementById('heroInvitation');
      if (inviteSection) {
        inviteSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 250);
  }, [onComplete]);

  // Keyboard trigger (Enter or Space) when closed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpening && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleOpenDoors();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpening, handleOpenDoors]);

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
        }
      }}
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

      {/* Layer 3: Couple Names Reveal Card (Only appears after Mandapam & Vinayaka settle) */}
      <CoupleNamesReveal
        isRevealed={isNamesRevealed}
        brideName={data.couple.bride.name}
        groomName={data.couple.groom.name}
        teluguNames={`${data.couple.bride.teluguName} పరిణయం ${data.couple.groom.teluguName}`}
        onProceed={handleProceedToInvitation}
      />

      {/* Subtle Skip button if guest wants immediate access */}
      {isOpening && !isNamesRevealed && (
        <button
          className="cinematic-skip-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleProceedToInvitation();
          }}
          type="button"
          aria-label="Skip entrance intro"
        >
          Skip to Invitation →
        </button>
      )}
    </section>
  );
};

