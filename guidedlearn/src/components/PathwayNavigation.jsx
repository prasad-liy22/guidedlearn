import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export default function PathwayNavigation({ 
  currentLevelKey, 
  currentLevelTitle, 
  currentTopic, 
  onNext, 
  onPrev, 
  isFirst, 
  isLast,
  totalSteps,
  currentStepNum
}) {

  // --- 🚀 Dynamic Color Logic ---
  let theme = { text: 'text-cyan-400', bg: 'bg-cyan-500/10', bar: 'from-cyan-400 to-blue-500' };

  if (currentLevelKey === 'beginner') {
    theme = { text: 'text-emerald-400', bg: 'bg-emerald-500/10', bar: 'from-emerald-400 to-green-500' };
  } else if (currentLevelKey === 'intermediate') {
    theme = { text: 'text-amber-400', bg: 'bg-amber-500/10', bar: 'from-amber-400 to-orange-500' };
  } else if (currentLevelKey === 'advanced') {
    theme = { text: 'text-rose-400', bg: 'bg-rose-500/10', bar: 'from-rose-400 to-pink-500' };
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg grid grid-cols-2 md:flex md:flex-row items-center justify-between gap-4 md:gap-6 mt-6 animate-in slide-in-from-bottom-5 duration-500">
      
      {/* ⬅️ Back Button */}
      <button 
        onClick={onPrev} 
        disabled={isFirst}
        className={`col-span-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 sm:py-2.5 rounded-xl font-bold transition-all w-full md:w-auto text-xs sm:text-sm active:scale-95 ${
          isFirst 
            ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-800' 
            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:-translate-x-1'
        }`}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Prev
      </button>
      <div className="col-span-2 order-first md:order-none flex flex-col items-center text-center w-full flex-1 px-2 md:px-4 mb-2 md:mb-0">
         <span className={`${theme.text} ${theme.bg} text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-full transition-colors duration-500`}>
           {currentLevelTitle}
         </span>
         
         <h3 className="text-white font-bold text-sm sm:text-base md:text-lg leading-snug line-clamp-2 max-w-lg transition-all duration-300">
           {currentTopic}
         </h3>
         
         <div className="flex items-center justify-center gap-3 mt-3 w-full">

            <div className="w-full max-w-[160px] sm:max-w-[200px] md:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
               <div 
                 className={`h-full bg-gradient-to-r ${theme.bar} rounded-full transition-all duration-700 ease-out`}
                 style={{ width: `${(currentStepNum / totalSteps) * 100}%` }}
               ></div>
            </div>
            <span className="text-slate-400 text-[10px] sm:text-xs font-bold whitespace-nowrap">{currentStepNum} / {totalSteps}</span>
         </div>
      </div>

      {/* ➡️ Next Button */}
      <button 
        onClick={onNext} 
        disabled={isLast}
        // 💡 Mobile වල text-xs සහ padding වෙනස් කළා
        className={`col-span-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 sm:py-2.5 rounded-xl font-bold transition-all w-full md:w-auto text-xs sm:text-sm active:scale-95 ${
          isLast 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : `bg-gradient-to-r ${theme.bar} text-white hover:scale-105 hover:shadow-lg`
        }`}
      >
        {isLast ? (
          <><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Finish</>
        ) : (
          <>Next <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /></>
        )}
      </button>

    </div>
  );
}