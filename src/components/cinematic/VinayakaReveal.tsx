import React from 'react';

interface VinayakaRevealProps {
  isRevealed: boolean;
  isFaded?: boolean;
}

export const VinayakaReveal: React.FC<VinayakaRevealProps> = ({ isRevealed, isFaded }) => {
  return (
    <div
      className={`vinayaka-sanctum-focus ${isRevealed ? 'revealed' : ''} ${
        isFaded ? 'faded' : ''
      }`}
    >
      {/* Divine Soft Center Spotlight */}
      <div className="vinayaka-spotlight" aria-hidden="true"></div>

      {/* Radiant Divine Halo behind Vinayaka */}
      <div className="vinayaka-radiant-halo" aria-hidden="true"></div>
    </div>
  );
};
