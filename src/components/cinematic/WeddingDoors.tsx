import React from 'react';
import { CinematicState } from './WeddingEntrance';

interface WeddingDoorsProps {
  state: CinematicState;
  onTapToEnter: () => void;
}

export const WeddingDoors: React.FC<WeddingDoorsProps> = ({ state, onTapToEnter }) => {
  const isClosed = state === 'closed';
  const isOpening = state === 'opening';
  const isRevealing = state === 'revealing';
  const isSettling = state === 'settling';
  const isInvitation = state === 'invitation';

  const isDoorOpen = isOpening || isRevealing || isSettling || isInvitation;
  const isGoldenLightActive = isOpening || isRevealing;
  const isPortalDissolved = isSettling || isInvitation;

  return (
    <div
      className={`grand-venue-entrance-portal ${isDoorOpen ? 'animating' : ''} ${
        isGoldenLightActive ? 'golden-light-active' : ''
      } ${isDoorOpen ? 'doors-opened' : ''} ${isPortalDissolved ? 'portal-dissolved' : ''}`}
      onClick={isClosed ? onTapToEnter : undefined}
      role={isClosed ? 'button' : undefined}
      tabIndex={isClosed ? 0 : -1}
      onKeyDown={
        isClosed
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTapToEnter();
              }
            }
          : undefined
      }
      aria-label={isClosed ? 'Grand Entrance Doors - Tap to enter wedding celebration' : undefined}
    >
      <div className="grand-portal-stage">
        {/* Ambient atmospheric backdrop extension for ultra-wide and mobile screens */}
        <div className="portal-ambient-backdrop" aria-hidden="true"></div>

        {/* The Grand Architectural Temple Portal (963 x 542 aspect ratio) */}
        <div className="grand-portal-proscenium">
          {/* 1. Behind the frame: 3D Hinged Double Doors in the Doorway Opening */}
          <div className="portal-doorway-chamber">
            <div className="portal-doors-hinge-viewport">
              {/* LEFT DOOR LEAF */}
              <div className="portal-door-panel door-leaf-left" id="doorLeafLeft">
                <img
                  src="/assets/images/door_leaf_left.jpg"
                  alt="Left Carved Wooden Door"
                  className="door-leaf-img"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="door-panel-shade shade-left"></div>
                <div className="door-edge-brass trim-right"></div>
              </div>

              {/* RIGHT DOOR LEAF */}
              <div className="portal-door-panel door-leaf-right" id="doorLeafRight">
                <img
                  src="/assets/images/door_leaf_right.jpg"
                  alt="Right Carved Wooden Door"
                  className="door-leaf-img"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="door-panel-shade shade-right"></div>
                <div className="door-edge-brass trim-left"></div>
              </div>

              {/* Divine Golden Light Beam through the center door seam */}
              <div
                className={`portal-door-seam ${isGoldenLightActive ? 'light-bursting' : ''}`}
                aria-hidden="true"
              >
                <div className="seam-volumetric-flare"></div>
              </div>
            </div>
          </div>

          {/* 2. In front of the doors: The Grand Portal Frame with transparent doorway */}
          <img
            src="/assets/images/grand_doors_portal_frame.png"
            alt="Grand Entrance Stone Pillars, Garlands and Arch"
            className="portal-proscenium-frame-img"
            draggable={false}
            onError={(e) => {
              const current = e.currentTarget;
              if (!current.dataset.fallbackTried) {
                current.dataset.fallbackTried = 'true';
                current.src = '/images/wedding/grand-entrance.webp';
              }
            }}
          />

          {/* 3. Living temple effects: Flickering flames on the left & right brass oil lamps */}
          <div className="portal-flame-anchor flame-anchor-left" aria-hidden="true">
            <div className="lamp-flame-core"></div>
            <div className="lamp-flame-glow"></div>
          </div>
          <div className="portal-flame-anchor flame-anchor-right" aria-hidden="true">
            <div className="lamp-flame-core"></div>
            <div className="lamp-flame-glow"></div>
          </div>
        </div>

        {/* 4. Subtle, Royal "TAP TO ENTER" Indicator (Visible only in 'closed' state) */}
        {isClosed && (
          <div
            className="tap-to-enter-pill"
            onClick={(e) => {
              e.stopPropagation();
              onTapToEnter();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTapToEnter();
              }
            }}
            aria-label="Tap to enter wedding venue"
          >
            <div className="tap-badge-content">
              <span className="tap-diya-icon" aria-hidden="true">🪔</span>
              <span className="tap-badge-text">TAP TO ENTER</span>
              <span className="tap-diya-icon" aria-hidden="true">🪔</span>
            </div>
            <p className="tap-badge-sub">Click anywhere or press Enter to step into the celebration</p>
          </div>
        )}
      </div>
    </div>
  );
};
