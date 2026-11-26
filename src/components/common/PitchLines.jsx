import React from 'react';

/**
 * Decorative pitch markings: halfway line, centre circle, and a penalty-box corner.
 * Pure SVG, inherits colour from `currentColor` so it works on any surface.
 */
export function PitchLines({ variant = 'centre', className = '' }) {
  if (variant === 'corner') {
    return (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
        <path d="M0 0H120M0 0V120" />
        <path d="M0 40A40 40 0 0 0 40 0" />
        <path d="M0 80H80V0" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 600 600" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="300" cy="300" r="190" />
      <circle cx="300" cy="300" r="6" fill="currentColor" />
      <path d="M300 0V600" />
      <path d="M0 300H110M490 300H600" opacity="0" />
    </svg>
  );
}
