import React from 'react';
import { Goal } from '../types';

interface TVGuideProps {
  goals: Goal[];
  onSelect: (id: string) => void;
}

export const TVGuide: React.FC<TVGuideProps> = ({ goals, onSelect }) => {
  return (
    <div className="w-full h-full bg-retro-black p-4 md:p-8 font-retro text-amber-500 overflow-y-auto custom-scrollbar">
      <div className="border-b-4 border-amber-600 mb-6 pb-2 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl text-glow font-bold bg-amber-600 text-black px-2 inline-block transform -skew-x-12">TV GUIDE</h1>
          <p className="text-xl mt-2 opacity-80">Tonight's Listings</p>
        </div>
        <div className="text-right">
          <p className="text-2xl">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-sm opacity-60 uppercase">Ch {goals.length} Avail</p>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Header Row */}
        <div className="grid grid-cols-[80px_1fr_100px] md:grid-cols-[100px_1fr_150px] gap-2 md:gap-4 text-xl md:text-2xl border-b-2 border-amber-800/50 pb-2 opacity-70">
          <div>CH</div>
          <div>PROGRAM</div>
          <div className="text-right">STATUS</div>
        </div>

        {/* Rows */}
        {goals.map((goal, idx) => {
            const percent = Math.round((goal.currentSteps / goal.totalSteps) * 100);
            return (
                <div 
                  key={goal.id}
                  onClick={() => onSelect(goal.id)}
                  className="group cursor-pointer grid grid-cols-[80px_1fr_100px] md:grid-cols-[100px_1fr_150px] gap-2 md:gap-4 items-center p-2 hover:bg-amber-900/20 border border-transparent hover:border-amber-700/50 transition-colors"
                >
                    <div className="text-2xl md:text-3xl font-bold opacity-60 group-hover:opacity-100 group-hover:text-glow">
                        {goal.id}
                    </div>
                    <div>
                        <div className="text-xl md:text-2xl font-bold truncate text-amber-400 group-hover:text-yellow-300">
                            {goal.title}
                        </div>
                        <div className="text-sm md:text-lg opacity-60 truncate font-sans tracking-wide">
                            {goal.description}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <div className="text-xl md:text-2xl font-bold">
                           {percent}%
                       </div>
                       {/* Mini progress bar */}
                       <div className="w-full h-2 bg-stone-800 mt-1">
                           <div className="h-full bg-amber-500" style={{ width: `${percent}%` }}></div>
                       </div>
                    </div>
                </div>
            )
        })}
        
        {goals.length === 0 && (
            <div className="text-center py-20 opacity-50 text-2xl animate-pulse">
                NO SIGNAL DETECTED.<br/>PLEASE ADD PROGRAMMING.
            </div>
        )}
      </div>
    </div>
  );
};
