import React from 'react';

/**
 * Club-style shield with the GH monogram.
 * tone="dark"  → turf shield (for light backgrounds)
 * tone="light" → chalk shield (for dark backgrounds)
 */
export function Crest({ className = 'w-9 h-10', tone = 'dark', title = 'Goat Haven' }) {
  const fill = tone === 'dark' ? '#0B2D21' : '#FAFBF7';
  const text = tone === 'dark' ? '#FAFBF7' : '#0B2D21';
  const line = tone === 'dark' ? '#FAFBF7' : '#0B2D21';
  return (
    <svg viewBox="0 0 40 46" className={className} role="img" aria-label={title}>
      <path
        d="M20 2 37 8v16c0 10-8 17-17 20C11 41 3 34 3 24V8z"
        fill={fill}
        stroke="#FFD21F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M5.5 24h29" stroke={line} strokeOpacity=".22" strokeWidth="1" />
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fontSize="17"
        fontWeight="900"
        fill={text}
        className="font-display"
        style={{ letterSpacing: '0.02em' }}
      >
        GH
      </text>
    </svg>
  );
}
