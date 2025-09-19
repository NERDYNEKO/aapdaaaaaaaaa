
import React from 'react';

// FIX: Populating file with an SVG icon component to resolve parsing errors.
export const MicrosoftIcon: React.FC = () => (
  <svg className="w-6 h-6" viewBox="0 0 21 21">
    <path fill="#f25022" d="M1 1h9v9H1z"/>
    <path fill="#00a4ef" d="M1 11h9v9H1z"/>
    <path fill="#7fba00" d="M11 1h9v9h-9z"/>
    <path fill="#ffb900" d="M11 11h9v9h-9z"/>
  </svg>
);
