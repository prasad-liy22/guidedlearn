import { Zap, Clock, Users, Lightbulb, Trash2 } from 'lucide-react';

// 💡 1. pathwayTitle එක අලුතින් ගත්තා
export default function SidebarWidgets({ pathwayTitle, funFact, timeSpent, learners, onDeleteClick }) {
  
  // --- 🚀 Sharing Logic ---
  const currentUrl = window.location.href; // දැනට ඉන්න පිටුවේ ලින්ක් එක (localhost හරි domain එක හරි)
  const shareText = `Check out this awesome learning pathway I'm following: ${pathwayTitle}! 🚀`;

  const handleShare = (platform) => {
    let url = '';
    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    } else if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n\n" + currentUrl)}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    }
    
    // අලුත් Tab එකකින් Share පිටුව Open කරනවා
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
      
      <h3 className="text-white font-bold flex items-center gap-2">
        <Zap className="w-5 h-5 text-cyan-400" /> Pathway Overview
      </h3>

      <div className="flex gap-3">
        <div className="flex-1 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
          <Clock className="w-5 h-5 text-purple-400 mb-2" />
          <p className="text-xl font-black text-white leading-tight">{timeSpent}</p>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Spent</p>
        </div>
        <div className="flex-1 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
          <Users className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-xl font-black text-white leading-tight">{learners}</p>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Learners</p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5 animate-pulse" />
          <p className="text-slate-300 text-xs leading-relaxed italic">"{funFact}"</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">Share Journey</span>
        <div className="flex gap-2">
          
          {/* 💡 2. onClick Events ටික Add කළා */}
          <button onClick={() => handleShare('facebook')} className="w-8 h-8 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 rounded-lg flex items-center justify-center transition-all group">
            <svg className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c1.05 0 2.05.2 2.05.2v2.25h-1.16c-1.14 0-1.39.75-1.39 1.45V12h2.5l-.5 3h-2v6.8C18.56 20.87 22 16.84 22 12z" /></svg>
          </button>
          
          <button onClick={() => handleShare('whatsapp')} className="w-8 h-8 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg flex items-center justify-center transition-all group">
            <svg className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.46 14.15c-.21.58-1.15 1.09-1.67 1.15-.42.06-1.02.13-3.23-.79-2.67-1.11-4.38-3.83-4.5-4.02-.12-.17-1.08-1.42-1.08-2.71 0-1.29.67-1.92.92-2.17.25-.25.54-.31.71-.31.17 0 .33 0 .48.02.17.02.35-.06.52-.46.21-.5.54-1.31.58-1.42.06-.11.13-.23.02-.44-.1-.21-.21-.33-.42-.56-.21-.21-.42-.38-.58-.58-.17-.21-.38-.42-.17-.79.21-.38.92-1.5 1.92-2.38.25-.21.5-.33.79-.21.29.13 1.83.92 2.15 1.08.31.17.52.25.6.38.08.13.08.79-.13 1.38z" /></svg>
          </button>
          
          <button onClick={() => handleShare('linkedin')} className="w-8 h-8 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 rounded-lg flex items-center justify-center transition-all group">
            <svg className="w-4 h-4 text-[#0A66C2] group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47A1.45,1.45,0,0,0,21.94,20.57V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h-.02a1.56,1.56,0,1,1,.02,0Zm11.5,10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12,13.2a2,2,0,0,0-.11.73v4.81h-3s.04-8.15,0-9h3v1.27a3,3,0,0,1,2.7-1.49c2,0,3.5,1.31,3.5,4.11Z"/></svg>
          </button>

        </div>
      </div>

      <hr className="border-slate-700/50" />

      <button onClick={onDeleteClick} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 py-3.5 rounded-xl transition-all font-bold text-sm">
        <Trash2 className="w-4 h-4" /> Abandon Pathway
      </button>

    </div>
  );
}