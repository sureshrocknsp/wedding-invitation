import React from 'react';
import { VinayakaReveal } from './VinayakaReveal';
import { CinematicState } from './WeddingEntrance';

interface WeddingInteriorProps {
  state: CinematicState;
}

export const WeddingInterior: React.FC<WeddingInteriorProps> = ({ state }) => {
  const isOpening = state !== 'closed';
  const isGoldenLightActive = state === 'opening' || state === 'revealing' || state === 'settling' || state === 'invitation';
  const isMandapamRevealed = state === 'revealing' || state === 'settling' || state === 'invitation';
  const isCameraSettling = state === 'settling' || state === 'invitation';
  const isInvitationState = state === 'invitation';

  return (
    <div
      className={`mandapam-interior-scene ${isOpening ? 'opening' : ''} ${
        isGoldenLightActive ? 'golden-glow' : ''
      } ${isMandapamRevealed ? 'mandapam-active' : ''} ${
        isCameraSettling ? 'camera-settling' : ''
      } ${isInvitationState ? 'invitation-active' : ''}`}
      aria-hidden={!isOpening}
    >
      {/* Realistic Kalyana Mandapam Backdrop with Lord Vinayaka Centered */}
      <div className="mandapam-photo-wrapper">
        <picture>
          <source srcSet="/images/wedding/vinayaka-mandapam.webp" type="image/webp" />
          <img
            src="/assets/images/vinayaka_mandapam.jpg"
            alt="Lord Vinayaka in Grand Traditional Floral Mandapam"
            className="mandapam-photo-img"
            loading="eager"
            decoding="sync"
            onError={(e) => {
              const current = e.currentTarget;
              if (!current.dataset.fallbackTried) {
                current.dataset.fallbackTried = 'true';
                current.src = '/images/wedding/vinayaka-mandapam.webp';
              }
            }}
          />
        </picture>
        <div className="mandapam-cinematic-vignette" aria-hidden="true"></div>
        <div className="mandapam-ambient-warmth" aria-hidden="true"></div>
        <div className="mandapam-lower-gradient" aria-hidden="true"></div>
      </div>

      {/* Volumetric Warm Golden Ambient Lighting */}
      <div className="mandapam-volumetric-glow" aria-hidden="true"></div>

      {/* Central Vinayaka Sacred Illumination and Radiant Halo */}
      <VinayakaReveal isRevealed={isMandapamRevealed} />
    </div>
  );
};
