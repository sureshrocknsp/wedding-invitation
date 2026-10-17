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
      {/* 3D Hinged Perspective Viewport Container (perspective: 1800px) */}
      <div className="doors-perspective-viewport">
        {/* LEFT DOOR LEAF (Hinged on Left, 3D outward rotation to Left) */}
        <div className="door-panel-hinged door-hinged-left" id="doorLeafLeft">
          <div className="door-panel-inner">
            <div
              className="door-texture-layer texture-left"
              style={{ backgroundImage: `url('/assets/images/grand_doors.jpg')` }}
            ></div>
            <div className="door-depth-shade shade-left"></div>
            <div className="door-edge-brass-trim trim-right"></div>
          </div>
        </div>

        {/* RIGHT DOOR LEAF (Hinged on Right, 3D outward rotation to Right) */}
        <div className="door-panel-hinged door-hinged-right" id="doorLeafRight">
          <div className="door-panel-inner">
            <div
              className="door-texture-layer texture-right"
              style={{ backgroundImage: `url('/assets/images/grand_doors.jpg')` }}
            ></div>
            <div className="door-depth-shade shade-right"></div>
            <div className="door-edge-brass-trim trim-left"></div>
          </div>
        </div>

        {/* Thin Warm Golden Light Seam between the doors */}
        <div className={`door-gap-golden-seam ${isGoldenLightActive ? 'light-bursting' : ''}`} aria-hidden="true">
          <div className="seam-volumetric-flare"></div>
        </div>
      </div>

      {/* Foreground Ambient Layer: Subtle garland sway, brass lamp flickers, floor reflection */}
      <div className="entrance-foreground-layer" aria-hidden="true">
        {/* Subtle floral canopy ambient accents */}
        <div className="ambient-floral-canopy-accents">
          <div className="swaying-garland garland-left"></div>
          <div className="swaying-garland garland-center"></div>
          <div className="swaying-garland garland-right"></div>
        </div>

        {/* Flanking Brass Kuthu Vilakku Lamps with gentle flame flickers */}
        <div className="entrance-foreground-lamps">
          <div className="entrance-lamp lamp-flank-left">
            <div className="entrance-lamp-flame"></div>
            <div className="entrance-lamp-glow"></div>
          </div>
          <div className="entrance-lamp lamp-flank-right">
            <div className="entrance-lamp-flame"></div>
            <div className="entrance-lamp-glow"></div>
          </div>
        </div>

        {/* Polished Floor Floral Pathway Warm Reflection */}
        <div className="entrance-floor-pathway-lighting"></div>
      </div>

      {/* Elegant, Non-intrusive "TAP TO ENTER" Indicator with subtle breathing */}
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
  );
};



