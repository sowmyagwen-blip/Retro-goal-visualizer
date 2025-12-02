import React from 'react';

interface TVKnobProps {
  label: string;
  value: number; // used for rotation calculation
  min: number;
  max: number;
  onChange: (val: number) => void;
  steps?: boolean;
}

export const TVKnob: React.FC<TVKnobProps> = ({ label, value, min, max, onChange, steps = false }) => {
  const rotation = ((value - min) / (max - min)) * 270 - 135; // -135deg to +135deg range

  const handleClick = () => {
    // Simple increment loop for demo
    const next = value + 1 > max ? min : value + 1;
    onChange(next);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-stone-800 shadow-[0_4px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] border-2 border-stone-900 cursor-pointer active:scale-95 transition-transform"
        onClick={handleClick}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Indicator line */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 md:h-4 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
        {/* Grip Texture */}
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-stone-700 opacity-50"></div>
      </div>
      <span className="text-[10px] md:text-xs font-retro text-stone-400 uppercase tracking-widest">{label}</span>
    </div>
  );
};
