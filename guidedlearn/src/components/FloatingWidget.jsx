import { useState, useRef, useEffect } from 'react';
import { Minus, X, GripHorizontal, AlertTriangle } from 'lucide-react';

export default function FloatingWidget({ 
  title, icon: Icon, isOpen, isMinimized, 
  closeRequested, onRequestClose, onConfirmClose, onCancelClose, 
  onMinimize, onRestore, children, 
  defaultWidth = 340 
}) {
  
  const getCenterPos = () => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Phone එකේදී 340px ට වඩා කුඩා නම් Screen Width එකෙන් 32px (Margin) අඩු කරලා ගන්නවා
      const actualWidth = w < defaultWidth ? w - 32 : defaultWidth;
      // Phone එකේදි Widget එක ගොඩක් පල්ලෙහාට යන්නේ නැති වෙන්න limit එකක් දැම්මා
      const yPos = (h - 500) / 2 > 60 ? (h - 500) / 2 : 60;
      
      return { 
        x: (w - actualWidth) / 2, 
        y: yPos 
      };
    }
    return { x: 20, y: 100 };
  };

  const [position, setPosition] = useState(getCenterPos());
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0, isClick: true });

  useEffect(() => {
    const handleResize = () => setPosition(getCenterPos());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultWidth]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setPosition(getCenterPos());
    }
  }, [isOpen, isMinimized, defaultWidth]);

  const handlePointerDown = (e) => {
    if (closeRequested) return; 
    setIsDragging(true);
    dragInfo.current = { startX: e.clientX, startY: e.clientY, offsetX: e.clientX - position.x, offsetY: e.clientY - position.y, isClick: true };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    if (Math.abs(e.clientX - dragInfo.current.startX) > 5 || Math.abs(e.clientY - dragInfo.current.startY) > 5) {
      dragInfo.current.isClick = false;
    }
    
    let newX = e.clientX - dragInfo.current.offsetX;
    let newY = e.clientY - dragInfo.current.offsetY;
    
    if (typeof window !== 'undefined') {
      const maxX = window.innerWidth - (window.innerWidth < defaultWidth ? window.innerWidth - 32 : defaultWidth);
      const maxY = window.innerHeight - 60;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    }

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
    
    if (dragInfo.current.isClick && isMinimized) {
      setPosition(getCenterPos());
      onRestore();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Minimized Bubble එක */}
      <div
        className={`fixed z-[9999] w-14 h-14 sm:w-16 sm:h-16 bg-slate-800/90 backdrop-blur-md border-2 border-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${isMinimized ? 'flex' : 'hidden'}`}
        style={{ left: position.x, top: position.y, touchAction: 'none' }}
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
      >
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-cyan-500 border-2 border-slate-900"></span>
        </span>
      </div>

      {/* 2. Maximized Window එක */}
      <div
        className={`fixed z-[9998] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${isMinimized ? 'hidden' : 'flex'}`}
        style={{ 
          left: position.x, 
          top: position.y,
          width: `${defaultWidth}px`, 
          maxWidth: 'calc(100vw - 32px)' 
        }}
      >
        <div
          className="bg-slate-800/80 px-4 py-3 sm:py-4 flex justify-between items-center cursor-grab active:cursor-grabbing border-b border-slate-700/50"
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} style={{ touchAction: 'none' }}
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <GripHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="text-white font-bold text-sm sm:text-base tracking-wide">{title}</span>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <button onClick={onMinimize} className="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 p-2 rounded-lg transition-colors active:scale-95"><Minus className="w-4 h-4" /></button>
            <button onClick={onRequestClose} className="text-slate-400 hover:text-red-400 bg-slate-700/50 hover:bg-red-500/20 p-2 rounded-lg transition-colors active:scale-95"><X className="w-4 h-4" /></button>
          </div>
        </div>
        
        {/* Children content area */}
        <div className="p-0 m-0 w-full overflow-hidden custom-scrollbar max-h-[70vh] sm:max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>

      {/* 3. Close Popup */}
      {closeRequested && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            </div>
            <h4 className="text-white font-black text-xl sm:text-2xl mb-2">Close {title}?</h4>
            <p className="text-slate-400 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed font-medium">Are you sure? Any active progress will be reset.</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button onClick={onCancelClose} className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-white text-sm sm:text-base font-bold py-3.5 sm:py-3 rounded-xl transition-colors active:scale-95 border border-slate-700">Cancel</button>
              <button onClick={onConfirmClose} className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-bold py-3.5 sm:py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-95">Yes, Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}