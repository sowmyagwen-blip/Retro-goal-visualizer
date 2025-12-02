import React from 'react';

export const CRTOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 rounded-lg overflow-hidden">
      {/* Scanlines */}
      <div className="absolute inset-0 crt-overlay opacity-50"></div>
      
      {/* Moving scanline bar */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.05)] to-transparent h-full w-full animate-scanline pointer-events-none"></div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>
      
      {/* Screen reflection/glare */}
      <div className="absolute top-0 right-0 w-2/3 h-1/3 bg-gradient-to-bl from-[rgba(255,255,255,0.05)] to-transparent rounded-tr-lg transform skew-x-12"></div>
    </div>
  );
};
