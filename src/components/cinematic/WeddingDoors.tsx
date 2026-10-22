import React from 'react';

interface WeddingDoorsProps {
  isOpening: boolean;
  isGoldenLightActive: boolean;
  isDoorOpen: boolean;
  onTapToEnter: () => void;
}

export const WeddingDoors: React.FC<WeddingDoorsProps> = ({
  isOpening,
  isGoldenLightActive,
  isDoorOpen,
  onTapToEnter
}) => {
  return (
    <div
      className={`grand-venue-entrance-portal ${isOpening ? 'animating' : ''} ${
        isGoldenLightActive ? 'golden-light-active' : ''
      } ${isDoorOpen ? 'doors-opened' : ''}`}
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
                  alt="Left Door"
                  className="door-leaf-img"
                  draggable={false}
                />
                <div className="door-panel-shade shade-left"></div>
                <div className="door-edge-brass trim-right"></div>
              </div>

              {/* RIGHT DOOR LEAF */}
              <div className="portal-door-panel door-leaf-right" id="doorLeafRight">
                <img
                  src="/assets/images/door_leaf_right.jpg"
                  alt="Right Door"
                  className="door-leaf-img"
                  draggable={false}
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
            alt="Grand Entrance Portal"
            className="portal-proscenium-frame-img"
            draggable={false}
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

        {/* 4. Elegant, Royal "TAP TO ENTER" Indicator */}
        {!isOpening && (
          <div
            className="tap-to-enter-pill"
            onClick={onTapToEnter}
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
              <span className="tap-diya-icon">🪔</span>
              <span className="tap-badge-text">TAP TO ENTER</span>
              <span className="tap-diya-icon">🪔</span>
            </div>
            <p className="tap-badge-sub">Click anywhere or press Enter to step into the celebration</p>
          </div>
        )}
      </div>
    </div>
  );
};




