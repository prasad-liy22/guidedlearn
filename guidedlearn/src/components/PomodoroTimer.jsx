import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, BrainCircuit, Coffee, Zap } from 'lucide-react';

const TEMPLATES = {
  classic: { name: 'Classic', work: 25, break: 5, icon: BrainCircuit, color: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/50', badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  deep: { name: 'Deep Work', work: 50, break: 10, icon: Zap, color: 'from-purple-400 to-indigo-500', shadow: 'shadow-purple-500/50', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  quick: { name: 'Quick', work: 15, break: 3, icon: Coffee, color: 'from-emerald-400 to-green-500', shadow: 'shadow-emerald-500/50', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
};

export default function PomodoroTimer() {
  const [activeTemplate, setActiveTemplate] = useState('classic');
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(TEMPLATES.classic.work * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      const isWorkNow = mode === 'work';
      const template = TEMPLATES[activeTemplate];
      setMode(isWorkNow ? 'break' : 'work');
      setTimeLeft((isWorkNow ? template.break : template.work) * 60);
      setIsActive(false); 
      try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play(); } catch(e){}
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, activeTemplate]);

  const handleTemplateChange = (key) => {
    setActiveTemplate(key);
    setMode('work');
    setTimeLeft(TEMPLATES[key].work * 60);
    setIsActive(false);
  };

  const resetTimer = () => {
    setMode('work');
    setTimeLeft(TEMPLATES[activeTemplate].work * 60);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentTotalSeconds = (mode === 'work' ? TEMPLATES[activeTemplate].work : TEMPLATES[activeTemplate].break) * 60;
  const progressPercentage = ((currentTotalSeconds - timeLeft) / currentTotalSeconds) * 100;
  
  // 💡 SVG viewBox setup
  const circleRadius = 45;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (progressPercentage / 100) * circleCircumference;
  const currentTheme = TEMPLATES[activeTemplate];

  return (
    <div className="flex flex-col items-center w-full px-2">
      
      {/* Mode Status */}
      <span className={`mt-5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 sm:mb-8 shadow-sm border ${mode === 'work' ? currentTheme.badgeColor : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
        {mode === 'work' ? '🚀 Focus Time' : '☕ Break Time'}
      </span>

      {/* Circular Timer */}
      <div className="relative flex items-center justify-center mb-8 w-48 h-48 sm:w-56 sm:h-56">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={circleRadius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800/80" />
          <circle 
            cx="50" cy="50" r={circleRadius} stroke="url(#gradient)" strokeWidth="4" fill="transparent" strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            style={{ 
              strokeDasharray: circleCircumference, 
              strokeDashoffset, 
              filter: `drop-shadow(0 0 4px rgba(${mode === 'work' ? '6,182,212' : '16,185,129'}, 0.4))` 
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mode === 'work' ? '#22d3ee' : '#34d399'} />
              <stop offset="100%" stopColor={mode === 'work' ? '#3b82f6' : '#10b981'} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center inset-0">
          <span className="text-4xl sm:text-5xl font-black text-white tracking-wider font-mono drop-shadow-lg">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-5 sm:gap-6 mb-8">
        <button 
          onClick={resetTimer} 
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 active:scale-95"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button 
          onClick={() => setIsActive(!isActive)} 
          className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white transition-all transform active:scale-95 shadow-xl ${isActive ? 'bg-slate-800 border-2 border-slate-700 hover:bg-slate-700' : `bg-gradient-to-br ${currentTheme.color} hover:scale-105 hover:${currentTheme.shadow}`}`}
        >
          {isActive ? <Pause className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" /> : <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" fill="currentColor" />}
        </button>
      </div>

      {/* Templates */}
      <div className="w-full max-w-[300px] bg-slate-950/80 p-1.5 rounded-2xl flex border border-slate-800/80 shadow-inner mt-auto">
        {Object.entries(TEMPLATES).map(([key, temp]) => (
          <button 
            key={key} 
            onClick={() => handleTemplateChange(key)} 
            className={`flex-1 py-2.5 sm:py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all ${activeTemplate === key ? 'bg-slate-800 text-white shadow-md border border-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}`}
          >
            {temp.name}
          </button>
        ))}
      </div>
    </div>
  );
}