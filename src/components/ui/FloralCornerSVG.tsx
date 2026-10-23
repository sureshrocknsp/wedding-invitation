import React from 'react';

interface FloralCornerSVGProps {
  className?: string;
  size?: number;
}

export const FloralCornerSVG: React.FC<FloralCornerSVGProps> = ({ className = '', size = 56 }) => {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`floral-corner-svg ${className}`}
      aria-hidden="true"
    >
      {/* Outer corner frame with rounded radius */}
      <path
        d="M3 75V24C3 12.4 12.4 3 24 3H75"
        stroke="#C9A45C"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Delicate inner accent line */}
      <path
        d="M10 75V27C10 17.6 17.6 10 27 10H75"
        stroke="#E8D5A5"
        strokeWidth="1"
        strokeOpacity="0.65"
        strokeLinecap="round"
      />
      {/* Stylized Lotus & Jasmine Petals in Corner Apex */}
      <circle cx="24" cy="24" r="3.2" fill="#E8D5A5" />
      <path
        d="M24 14C24 19 29 24 34 24C29 24 24 29 24 34C24 29 19 24 14 24C19 24 24 19 24 14Z"
        fill="#C9A45C"
        opacity="0.85"
      />
      {/* Botanical foliage scrolls */}
      <path
        d="M44 6C44 14 36 17 28 17"
        stroke="#E8D5A5"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M6 44C14 44 17 36 17 28"
        stroke="#E8D5A5"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Tiny jewel dots */}
      <circle cx="48" cy="6" r="1.5" fill="#C9A45C" />
      <circle cx="6" cy="48" r="1.5" fill="#C9A45C" />
      <circle cx="60" cy="3" r="1.8" fill="#E8D5A5" />
      <circle cx="3" cy="60" r="1.8" fill="#E8D5A5" />
    </svg>
  );
};
