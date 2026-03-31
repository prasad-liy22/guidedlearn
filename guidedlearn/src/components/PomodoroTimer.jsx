import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, BrainCircuit, Coffee, Zap } from 'lucide-react';

const TEMPLATES = {
  classic: { name: 'Classic', work: 25, break: 5, icon: BrainCircuit, color: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/50' },
  deep: { name: 'Deep Work', work: 50, break: 10, icon: Zap, color: 'from-purple-400 to-indigo-500', shadow: 'shadow-purple-500/50' },
  quick: { name: 'Quick', work: 15, break: 3, icon: Coffee, color: 'from-emerald-400 to-green-500', shadow: 'shadow-emerald-500/50' }
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
  const circleRadius = 65;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (progressPercentage / 100) * circleCircumference;
  const currentTheme = TEMPLATES[activeTemplate];

  // 💡 මෙතනින් Outer Backgrounds ඔක්කොම අයින් කළා!
  return (
    <div className="flex flex-col items-center">
      
      {/* Mode Status */}
      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-sm ${mode === 'work' ? `bg-${currentTheme.color.split('-')[1]}-500/20 text-${currentTheme.color.split('-')[1]}-400 border border-${currentTheme.color.split('-')[1]}-500/30` : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
        {mode === 'work' ? '🚀 Focus Time' : '☕ Break Time'}
      </span>

      {/* Circular Timer */}
      <div className="relative flex items-center justify-center mb-8">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle cx="80" cy="80" r={circleRadius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
          <circle 
            cx="80" cy="80" r={circleRadius} stroke="url(#gradient)" strokeWidth="8" fill="transparent" strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            style={{ strokeDasharray: circleCircumference, strokeDashoffset, filter: `drop-shadow(0 0 8px rgba(${mode === 'work' ? '6,182,212' : '16,185,129'}, 0.5))` }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mode === 'work' ? '#22d3ee' : '#34d399'} />
              <stop offset="100%" stopColor={mode === 'work' ? '#3b82f6' : '#10b981'} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black text-white tracking-wider font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setIsActive(!isActive)} className={`flex items-center justify-center w-14 h-14 rounded-full text-white transition-all transform hover:scale-110 shadow-lg ${isActive ? 'bg-slate-700 hover:bg-slate-600' : `bg-gradient-to-r ${currentTheme.color} hover:${currentTheme.shadow}`}`}>
          {isActive ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
        </button>
        <button onClick={resetTimer} className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Templates */}
      <div className="w-full bg-slate-950/50 p-1.5 rounded-2xl flex border border-slate-800/50">
        {Object.entries(TEMPLATES).map(([key, temp]) => (
          <button key={key} onClick={() => handleTemplateChange(key)} className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all ${activeTemplate === key ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
            {temp.name}
          </button>
        ))}
      </div>
    </div>
  );
}