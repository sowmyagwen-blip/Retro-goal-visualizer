import React from 'react';
import { Power, Volume2, VolumeX, Menu, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { AppView } from '../types';

interface RemoteProps {
  isOn: boolean;
  togglePower: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  onNavigate: (dir: 'up' | 'down') => void;
  onViewChange: (view: AppView) => void;
  currentView: AppView;
}

export const Remote: React.FC<RemoteProps> = ({ 
  isOn, togglePower, isMuted, toggleMute, onNavigate, onViewChange, currentView 
}) => {
  return (
    <div className="fixed right-4 bottom-4 md:right-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-24 md:w-32 bg-stone-800 rounded-xl border-b-8 border-stone-950 shadow-2xl p-4 flex flex-col gap-4 z-50">
      <div className="text-center">
        <span className="font-retro text-stone-500 text-xs tracking-widest block">ZENITH</span>
        <span className="font-retro text-stone-600 text-[8px] uppercase">Space Command</span>
      </div>

      <button 
        onClick={togglePower}
        className="w-full h-10 md:h-12 bg-red-800 hover:bg-red-700 rounded-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_2px_0_#330000] active:translate-y-[2px] active:shadow-none flex items-center justify-center text-white/80 transition-all"
      >
        <Power size={18} />
      </button>

      <div className="h-px bg-stone-700 w-full my-1"></div>

      {/* Channel Controls */}
      <div className="flex flex-col gap-2">
        <label className="text-[8px] text-stone-500 font-retro text-center uppercase">Channel</label>
        <button 
          onClick={() => onNavigate('up')}
          disabled={!isOn}
          className="bg-stone-700 hover:bg-stone-600 h-10 rounded shadow-[0_2px_0_#1a1a1a] active:translate-y-[2px] active:shadow-none flex items-center justify-center text-stone-300 disabled:opacity-50"
        >
          <ChevronUp size={20} />
        </button>
        <button 
          onClick={() => onNavigate('down')}
          disabled={!isOn}
          className="bg-stone-700 hover:bg-stone-600 h-10 rounded shadow-[0_2px_0_#1a1a1a] active:translate-y-[2px] active:shadow-none flex items-center justify-center text-stone-300 disabled:opacity-50"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="h-px bg-stone-700 w-full my-1"></div>

      {/* View Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onViewChange(AppView.GUIDE)}
          disabled={!isOn}
          className={`h-10 rounded active:translate-y-[2px] active:shadow-none flex items-center justify-center disabled:opacity-50 ${currentView === AppView.GUIDE ? 'bg-amber-700 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' : 'bg-stone-700 text-stone-400 shadow-[0_2px_0_#1a1a1a]'}`}
          title="Guide"
        >
          <Menu size={16} />
        </button>
        <button 
          onClick={toggleMute}
          disabled={!isOn}
          className={`h-10 rounded active:translate-y-[2px] active:shadow-none flex items-center justify-center disabled:opacity-50 ${isMuted ? 'bg-red-900/50 text-red-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' : 'bg-stone-700 text-stone-400 shadow-[0_2px_0_#1a1a1a]'}`}
          title="Mute"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
       
      <button 
          onClick={() => onViewChange(AppView.CREATE)}
          disabled={!isOn}
          className="bg-blue-900/40 hover:bg-blue-800/60 border border-blue-900 h-8 mt-2 rounded flex items-center justify-center text-blue-200 text-xs font-retro tracking-wider disabled:opacity-50"
        >
          <Plus size={12} className="mr-1" /> NEW
      </button>

      {/* Decor */}
      <div className="mt-2 grid grid-cols-3 gap-1 opacity-30">
        <div className="h-1 bg-white rounded-full"></div>
        <div className="h-1 bg-white rounded-full"></div>
        <div className="h-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
};
