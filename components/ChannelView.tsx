import React from 'react';
import { Goal } from '../types';
import { Play, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';

interface ChannelViewProps {
  goal: Goal;
  onUpdateProgress: (amount: number) => void;
}

export const ChannelView: React.FC<ChannelViewProps> = ({ goal, onUpdateProgress }) => {
  const percent = Math.round((goal.currentSteps / goal.totalSteps) * 100);
  
  // Retro color mapping based on category
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Sitcom': return 'text-yellow-400';
      case 'News': return 'text-blue-400';
      case 'Drama': return 'text-red-400';
      case 'Sports': return 'text-green-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <div className="w-full h-full p-8 md:p-16 flex flex-col relative overflow-hidden font-retro text-amber-500">
      
      {/* Broadcast overlay elements */}
      <div className="absolute top-8 left-8 flex items-center gap-2 animate-pulse">
        <div className="w-4 h-4 bg-red-600 rounded-full"></div>
        <span className="text-xl uppercase tracking-widest text-red-500 drop-shadow-md">LIVE</span>
      </div>

      <div className="absolute top-8 right-8 text-2xl text-amber-300 opacity-80">
        CH {goal.id.padStart(2, '0')}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 space-y-8">
        
        {/* Title Block */}
        <div className="bg-amber-900/20 border-y-4 border-amber-600/50 p-6 w-full max-w-2xl backdrop-blur-sm">
          <h2 className={`text-2xl md:text-3xl uppercase tracking-widest mb-2 ${getCategoryColor(goal.category)} opacity-80`}>
            {goal.category} Special
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold text-glow text-amber-400 mb-4 leading-none">
            {goal.title}
          </h1>
          <p className="text-xl md:text-2xl text-amber-200/80 font-light italic max-w-lg mx-auto">
            "{goal.description}"
          </p>
        </div>

        {/* Visual Metaphor: The Signal Strength / Antenna */}
        <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-xl text-amber-600 uppercase tracking-widest mb-1">
                <span>Signal Strength</span>
                <span>{percent}%</span>
            </div>
            <div className="h-8 md:h-12 w-full bg-stone-900 border-2 border-stone-700 relative p-1">
                {/* Progress Blocks */}
                <div 
                    className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(255,176,0,0.6)] transition-all duration-1000 ease-out"
                    style={{ width: `${percent}%` }}
                >
                    {/* Scanline pattern inside bar */}
                    <div className="w-full h-full bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:4px_100%]"></div>
                </div>
            </div>
             <div className="flex justify-between text-sm text-stone-500">
                <span>0</span>
                <span>Target: {goal.totalSteps}</span>
            </div>
        </div>
        
        {/* Controls */}
        <div className="flex gap-6 mt-8">
            <button 
                onClick={() => onUpdateProgress(1)}
                className="group relative px-8 py-3 bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold text-xl uppercase tracking-widest clip-path-polygon hover:scale-105 active:scale-95 transition-all"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)' }}
            >
                <div className="flex items-center gap-2">
                    <TrendingUp size={24} />
                    <span>Log Progress</span>
                </div>
                {/* Button shine */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
            </button>
            
            {percent >= 100 && (
                <div className="animate-bounce text-green-400 flex flex-col items-center">
                    <CheckCircle2 size={40} />
                    <span className="text-lg">COMPLETE!</span>
                </div>
            )}
        </div>
      </div>

      {/* Ticker at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-amber-900/40 flex items-center overflow-hidden border-t border-amber-700/30">
        <div className="animate-[scanline_10s_linear_infinite] whitespace-nowrap text-amber-300 text-xl uppercase tracking-widest pl-full">
          *** Breaking News: {goal.title} currently at {percent}% completion *** Stay tuned for more updates *** Weather forecast: Sunny with a chance of success ***
        </div>
      </div>
    </div>
  );
};
