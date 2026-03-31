import { useState, useRef, useEffect } from 'react';
import { Minus, X, GripHorizontal, AlertTriangle } from 'lucide-react';

export default function FloatingWidget({ 
  title, icon: Icon, isOpen, isMinimized, 
  closeRequested, onRequestClose, onConfirmClose, onCancelClose, 
  onMinimize, onRestore, children, 
  defaultWidth = 340 // 💡 අලුත්: පළල Number එකක් විදිහට ගන්නවා (උදා: 700)
}) {
  
  // 💡 අලුත්: දැන් Centering Math එක වැඩ කරන්නේ defaultWidth එකට අනුවයි!
  const getCenterPos = () => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Phone එකේදී Screen එකට වඩා ලොකු වෙන්න බැරි නිසා Actual Width එක හොයනවා
      const actualWidth = w < defaultWidth ? w - 40 : defaultWidth;
      
      return { 
        x: (w - actualWidth) / 2, 
        y: (h - 500) / 2 > 50 ? (h - 500) / 2 : 50 
      };
    }
    return { x: 20, y: 100 };
  };

  const [position, setPosition] = useState(getCenterPos());
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0, isClick: true });

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setPosition(getCenterPos());
    }
  }, [isOpen, isMinimized, defaultWidth]); // defaultWidth වෙනස් වුණොත් ආයෙත් මැදට ගන්නවා

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
    setPosition({ x: e.clientX - dragInfo.current.offsetX, y: e.clientY - dragInfo.current.offsetY });
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
        className={`fixed z-[9999] w-14 h-14 bg-slate-800/90 backdrop-blur-md border-2 border-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${isMinimized ? 'flex' : 'hidden'}`}
        style={{ left: position.x, top: position.y, touchAction: 'none' }}
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
      >
        <Icon className="w-6 h-6 text-cyan-400" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-900"></span>
        </span>
      </div>

      {/* 2. Maximized Window එක */}
      <div
        className={`fixed z-[9998] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${isMinimized ? 'hidden' : 'flex'}`}
        style={{ 
          left: position.x, 
          top: position.y,
          width: `${defaultWidth}px`, // 💡 මෙතනින් පළල දෙනවා
          maxWidth: '95vw' // 💡 Phone එකේදි Screen එකෙන් එළියට යන්න දෙන්නේ නෑ
        }}
      >
        <div
          className="bg-slate-800/80 px-4 py-3 flex justify-between items-center cursor-grab active:cursor-grabbing border-b border-slate-700/50"
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} style={{ touchAction: 'none' }}
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <GripHorizontal className="w-4 h-4 text-slate-500" />
            <Icon className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold text-sm tracking-wide">{title}</span>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <button onClick={onMinimize} className="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 p-1.5 rounded-lg transition-colors"><Minus className="w-3.5 h-3.5" /></button>
            <button onClick={onRequestClose} className="text-slate-400 hover:text-red-400 bg-slate-700/50 hover:bg-red-500/20 p-1.5 rounded-lg transition-colors"><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        
        <div className="p-0 m-0 w-full overflow-hidden">{children}</div>
      </div>

      {/* 3. Close Popup එක */}
      {closeRequested && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="text-white font-black text-xl mb-2">Close {title}?</h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Are you sure? Any active progress will be reset.</p>
            <div className="flex gap-3 w-full">
              <button onClick={onCancelClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-3 rounded-xl transition-colors">Cancel</button>
              <button onClick={onConfirmClose} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">Yes, Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}