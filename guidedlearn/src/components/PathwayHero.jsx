import { Rocket, Target, Layers, BookOpen, Zap } from 'lucide-react';

export default function PathwayHero({ pathway, totalLevels, totalTopics, totalResources }) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center justify-between">
        
        <div className="flex-1 w-full text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] sm:text-xs font-bold mb-3 sm:mb-4">
            <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Active Learning Path
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 tracking-tight leading-tight">
            {pathway.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Welcome to your personal learning bench. Master this topic step-by-step, track your progress, and utilize AI-curated tools to boost your knowledge.
          </p>
        </div>

        <div className="w-full lg:w-96 shrink-0 bg-slate-800/50 border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex justify-between items-end mb-2 sm:mb-3">
            <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2"><Target className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400"/> Overall Progress</h3>
            <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">{pathway.progress}%</span>
          </div>
          
          <div className="w-full h-2.5 sm:h-3 bg-slate-900 rounded-full overflow-hidden mb-5 sm:mb-6 border border-slate-700 shadow-inner">
            <div 
              className="h-full bg-linear-to-r from-cyan-400 to-blue-500 rounded-full relative transition-all duration-1000 ease-out"
              style={{ width: `${pathway.progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-slate-900/50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-slate-700/50">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-base sm:text-lg font-bold text-white">{totalLevels}</div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Levels</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-slate-700/50">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-base sm:text-lg font-bold text-white">{totalTopics}</div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Topics</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-slate-700/50">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-base sm:text-lg font-bold text-white">{totalResources}</div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Resources</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}