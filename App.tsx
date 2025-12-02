import React, { useState, useEffect, useRef } from 'react';
import { TVKnob } from './components/TVKnob';
import { Remote } from './components/Remote';
import { CRTOverlay } from './components/CRTOverlay';
import { TVGuide } from './components/TVGuide';
import { ChannelView } from './components/ChannelView';
import { Goal, AppView, TVState } from './types';
import { playSound } from './utils/audio';
import { generateRetroGoalDetails } from './services/geminiService';
import { Loader2, Sparkles } from 'lucide-react';

const INITIAL_GOALS: Goal[] = [
  { id: '1', title: 'Morning Jog', description: 'The daily race against the sunrise.', progress: 20, totalSteps: 30, currentSteps: 6, category: 'Sports' },
  { id: '2', title: 'Learn React', description: 'A thrilling drama of components and hooks.', progress: 45, totalSteps: 100, currentSteps: 45, category: 'Documentary' },
  { id: '3', title: 'Drink Water', description: 'Hydration Station: Stay liquid, stay alive.', progress: 80, totalSteps: 8, currentSteps: 6, category: 'News' },
];

export default function App() {
  const [state, setState] = useState<TVState>({
    isOn: false,
    volume: 5,
    currentChannelIndex: 0,
    view: AppView.GUIDE,
    isMuted: false,
  });

  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Audio effect wrapper
  const play = (type: 'static' | 'click' | 'success' | 'power') => {
    if (!state.isMuted && state.isOn) {
      // Don't play sound if power is off, unless it's the power button
      if (type !== 'power' && !state.isOn) return;
      playSound(type, state.volume / 10);
    }
    // Allow power sound even if off (to turn on)
    if (type === 'power') {
         playSound('power', state.volume / 10);
    }
  };

  const togglePower = () => {
    play('power');
    setState(prev => ({ ...prev, isOn: !prev.isOn }));
  };

  const handleChannelChange = (direction: 'up' | 'down') => {
    if (!state.isOn) return;
    play('static'); // Static noise between channels
    
    setTimeout(() => {
        setState(prev => {
        let nextIndex = direction === 'up' ? prev.currentChannelIndex + 1 : prev.currentChannelIndex - 1;
        if (nextIndex >= goals.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = goals.length - 1;
        return { ...prev, currentChannelIndex: nextIndex, view: AppView.CHANNEL };
        });
    }, 150);
  };
  
  const handleSelectGoal = (id: string) => {
      const idx = goals.findIndex(g => g.id === id);
      if (idx !== -1) {
          play('click');
          setState(prev => ({ ...prev, currentChannelIndex: idx, view: AppView.CHANNEL }));
      }
  };

  const updateGoalProgress = (amount: number) => {
    const currentGoal = goals[state.currentChannelIndex];
    if (currentGoal.currentSteps >= currentGoal.totalSteps) return;

    const nextSteps = Math.min(currentGoal.currentSteps + amount, currentGoal.totalSteps);
    
    setGoals(prev => prev.map((g, i) => 
        i === state.currentChannelIndex ? { ...g, currentSteps: nextSteps } : g
    ));

    if (nextSteps === currentGoal.totalSteps) {
        play('success');
    } else {
        play('click');
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newGoalInput.trim()) return;

      setIsGenerating(true);
      play('static'); // Processing sound

      // AI Generation
      const details = await generateRetroGoalDetails(newGoalInput);
      
      const newGoal: Goal = {
          id: (goals.length + 1).toString(),
          title: details.title,
          description: details.description,
          category: details.category,
          progress: 0,
          currentSteps: 0,
          totalSteps: 10, // Default
      };

      setGoals([...goals, newGoal]);
      setNewGoalInput('');
      setIsGenerating(false);
      setState(prev => ({ ...prev, view: AppView.GUIDE }));
      play('success');
  };

  return (
    <div className="w-screen h-screen bg-stone-900 flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      
      {/* Wooden TV Cabinet */}
      <div className={`relative w-full max-w-5xl aspect-[4/3] md:aspect-[16/10] bg-[#3e2723] rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_100px_rgba(0,0,0,0.9)] border-t border-white/10 flex flex-col md:flex-row gap-4 transition-all duration-500 ${state.isOn ? 'shadow-[0_0_80px_rgba(255,176,0,0.1)]' : ''}`}>
        
        {/* Wood Texture Overlay */}
        <div className="absolute inset-0 rounded-3xl opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>

        {/* Speaker Grille (Left on desktop, hidden on mobile for space) */}
        <div className="hidden md:block w-16 h-full bg-black/40 rounded-lg relative overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,1)_25%,transparent_25%,transparent_75%,rgba(0,0,0,1)_75%,rgba(0,0,0,1)),linear-gradient(45deg,rgba(0,0,0,1)_25%,transparent_25%,transparent_75%,rgba(0,0,0,1)_75%,rgba(0,0,0,1))] bg-[length:4px_4px] bg-[position:0_0,2px_2px] opacity-50"></div>
        </div>

        {/* Screen Bezel */}
        <div className="flex-1 bg-stone-800 rounded-[2rem] p-2 md:p-4 shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative border-[12px] border-stone-700/50">
           
           {/* The Screen Itself */}
           <div className={`w-full h-full bg-black rounded-[1.5rem] relative overflow-hidden transition-all duration-300 ${state.isOn ? 'animate-turn-on' : 'animate-turn-off'}`}>
              
              {state.isOn && (
                <>
                  <CRTOverlay />
                  <div className="w-full h-full relative z-10">
                     {state.view === AppView.GUIDE && (
                         <TVGuide goals={goals} onSelect={handleSelectGoal} />
                     )}
                     {state.view === AppView.CHANNEL && goals[state.currentChannelIndex] && (
                         <ChannelView 
                            goal={goals[state.currentChannelIndex]} 
                            onUpdateProgress={updateGoalProgress}
                         />
                     )}
                     {state.view === AppView.CREATE && (
                         <div className="w-full h-full flex flex-col items-center justify-center p-8 text-amber-500 font-retro">
                             <h2 className="text-3xl mb-8 uppercase tracking-widest text-glow">New Broadcast</h2>
                             <form onSubmit={handleCreateGoal} className="w-full max-w-md flex flex-col gap-4">
                                 <input 
                                    type="text" 
                                    value={newGoalInput}
                                    onChange={(e) => setNewGoalInput(e.target.value)}
                                    placeholder="Enter Goal (e.g., Read 10 Books)"
                                    className="bg-transparent border-b-4 border-amber-600 text-2xl p-2 outline-none text-center placeholder-amber-800/50"
                                    autoFocus
                                 />
                                 <div className="h-4"></div>
                                 <button 
                                    type="submit" 
                                    disabled={isGenerating}
                                    className="bg-amber-600 text-black text-xl py-3 uppercase font-bold hover:bg-amber-500 disabled:opacity-50 flex items-center justify-center gap-2"
                                 >
                                     {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                     {isGenerating ? 'Tuning Signal...' : 'Auto-Tune Program'}
                                 </button>
                                 <p className="text-sm text-center opacity-60 mt-2">
                                     *Uses AI Satellite Technology to name your show*
                                 </p>
                             </form>
                         </div>
                     )}
                  </div>
                </>
              )}

              {/* Screen Off Reflection */}
              {!state.isOn && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[1.5rem]"></div>
              )}
           </div>
        </div>

        {/* Control Panel (Right) */}
        <div className="w-full md:w-32 bg-[#2d1b18] md:rounded-r-2xl p-4 flex md:flex-col items-center justify-between md:justify-start md:gap-8 border-l border-black/20 relative">
             
             {/* Metal plate background for controls */}
             <div className="absolute inset-x-2 inset-y-2 bg-gradient-to-b from-[#b8860b] to-[#8b6508] opacity-10 rounded-xl pointer-events-none"></div>

             <div className="hidden md:block w-full text-center mb-2">
                 <span className="font-retro text-amber-500/50 uppercase tracking-widest text-xs border border-amber-500/30 px-2 py-1">UHF / VHF</span>
             </div>

             <TVKnob 
                label="Channel" 
                value={state.currentChannelIndex} 
                min={0} 
                max={goals.length - 1} 
                onChange={(val) => {
                    play('click');
                    setState(p => ({ ...p, currentChannelIndex: val, view: AppView.CHANNEL }));
                }}
             />
             
             <TVKnob 
                label="Volume" 
                value={state.volume} 
                min={0} 
                max={10} 
                onChange={(val) => {
                    // Just visual update for now, sets state
                    setState(p => ({ ...p, volume: val }));
                }}
             />

             <div className="flex-1"></div>

             {/* Power Switch */}
             <div className="flex flex-col items-center gap-2">
                 <button 
                    onClick={togglePower}
                    className={`w-8 h-8 rounded-full border-2 border-stone-800 shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all ${state.isOn ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-red-900'}`}
                 ></button>
                 <span className="text-[10px] font-retro text-stone-400 uppercase">Power</span>
             </div>
        </div>
      </div>

      <Remote 
        isOn={state.isOn}
        togglePower={togglePower}
        isMuted={state.isMuted}
        toggleMute={() => setState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
        onNavigate={handleChannelChange}
        onViewChange={(view) => {
            play('click');
            setState(prev => ({ ...prev, view }));
        }}
        currentView={state.view}
      />
    </div>
  );
}
