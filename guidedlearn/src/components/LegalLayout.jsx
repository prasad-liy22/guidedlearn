import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LegalLayout({ title, icon: Icon, children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors font-bold text-sm active:scale-95"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-inner">
            <Icon className="text-cyan-400 w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">{title}</h1>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="prose prose-invert prose-cyan max-w-none 
            prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:font-bold prose-h2:text-white prose-h2:mt-8 prose-h2:mb-4
            prose-p:text-slate-400 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-sm sm:prose-p:text-base
            prose-li:text-slate-400 prose-li:text-sm sm:prose-li:text-base prose-li:mb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}