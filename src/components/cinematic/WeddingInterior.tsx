import React from 'react';
import { VinayakaReveal } from './VinayakaReveal';

interface WeddingInteriorProps {
  isOpening: boolean;
  isGoldenLightActive: boolean;
  isVinayakaRevealed: boolean;
  isVinayakaFaded?: boolean;
  isMandapamRevealed: boolean;
  isSettled: boolean;
}

export const WeddingInterior: React.FC<WeddingInteriorProps> = ({
  isOpening,
  isGoldenLightActive,
  isVinayakaRevealed,
  isVinayakaFaded,
  isMandapamRevealed,
  isSettled
}) => {
  return (
    <div
      className={`mandapam-interior-scene ${isOpening ? 'opening' : ''} ${
        isGoldenLightActive ? 'golden-glow' : ''
      } ${isMandapamRevealed ? 'mandapam-active' : ''} ${isSettled ? 'settled' : ''} ${
        isVinayakaFaded ? 'vinayaka-faded-state' : ''
      }`}
      aria-hidden={!isOpening}
    >
      {/* Photorealistic Grand Kalyana Mandapam Backdrop with Lord Vinayaka in Center */}
      <div className="mandapam-photo-wrapper">
        <img
          src="/assets/images/vinayaka_mandapam.jpg"
          alt="Lord Vinayaka in Grand Traditional Floral Mandapam"
          className="mandapam-photo-img"
        />
        <div className="mandapam-cinematic-vignette"></div>
        <div className="mandapam-ambient-warmth"></div>
        {/* Soft veil after Vinayaka fades so couple names card has clear focus */}
        <div className={`mandapam-names-veil ${isVinayakaFaded ? 'active' : ''}`}></div>
      </div>

      {/* Volumetric Warm Golden Ambient Lighting */}
      <div className="mandapam-volumetric-glow" aria-hidden="true"></div>

      {/* Central Vinayaka Sacred Illumination */}
      <VinayakaReveal isRevealed={isVinayakaRevealed} isFaded={isVinayakaFaded} />
    </div>
  );
};

