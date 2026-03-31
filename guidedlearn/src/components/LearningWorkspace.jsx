import { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, FileText, Sparkles, Loader2, CheckCircle, Circle, HelpCircle } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import AiQuickQuiz from './AiQuickQuiz';

export default function LearningWorkspace({ pathwayTitle, levelTitle, topic, isCompleted, onMarkComplete }) {
  const [mode, setMode] = useState('text');
  const [articleContent, setArticleContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (mode === 'text' && topic) generateArticle();
  }, [topic, mode]);

  const generateArticle = async () => {
    setIsGenerating(true);
    try {
      const generateArticleFn = httpsCallable(functions, 'generateArticle');
      const result = await generateArticleFn({ 
        topic, 
        levelTitle, 
        pathwayTitle 
      });
      
      setArticleContent(result.data);
    } catch (error) {
      console.error("Article Error:", error);
      if (error.message === "RATE_LIMIT" || error.code === "resource-exhausted") {
        setArticleContent(`<div class="p-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-center"><h3 class="text-orange-400 font-bold text-xl mb-2">Wow, slow down a bit! 🚦</h3><p class="text-slate-300">Please wait about 30 seconds and try again.</p></div>`);
      } else {
        setArticleContent("<p class='text-red-400 font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20'>Oops! Failed to load the lesson. Please try again.</p>");
      }
    } finally { 
      setIsGenerating(false); 
    }
  };

  useEffect(() => {
    if (mode === 'video' && topic) {
      fetchYouTubeVideo();
    }
  }, [mode, topic, pathwayTitle]);

  const fetchYouTubeVideo = async () => {
    setIsVideoLoading(true);
    try {
      const fetchYouTubeVideoFn = httpsCallable(functions, 'fetchYouTubeVideo');
      const result = await fetchYouTubeVideoFn({ 
        topic, 
        pathwayTitle 
      });
      
      setVideoId(result.data.videoId);
    } catch (error) { 
      console.error("YouTube Error:", error);
      setVideoId(null); 
    } finally { 
      setIsVideoLoading(false); 
    }
  };

  return (
    <>
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[400px] sm:min-h-[500px]">
        
        {/* Header & Tool Bar */}
        <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center shrink-0 shadow-inner border border-cyan-500/30">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-black text-base sm:text-lg leading-tight truncate sm:max-w-[200px] md:max-w-xs">{topic}</h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">{levelTitle}</p>
            </div>
          </div>
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-700/50 shrink-0 w-full sm:w-auto">
            <button onClick={() => setMode('text')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-black transition-all ${mode === 'text' ? 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-100 sm:scale-105' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <FileText className="w-4 h-4" /> Read
            </button>
            <button onClick={() => setMode('video')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-black transition-all ${mode === 'video' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-100 sm:scale-105' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <PlayCircle className="w-4 h-4" /> Watch
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 md:p-8 flex-1 relative bg-slate-900/20 flex flex-col custom-scrollbar overflow-y-auto">
          {mode === 'text' && (
            <div className="animate-in fade-in duration-500 h-full">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-cyan-400 gap-4 min-h-[250px] sm:min-h-[300px]">
                  <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin" />
                  <p className="font-black animate-pulse flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm"><Sparkles className="w-4 h-4" /> AI is writing your lesson...</p>
                </div>
              ) : (
                <div className="prose prose-sm sm:prose-base prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: articleContent }} />
              )}
            </div>
          )}

          {mode === 'video' && (
            <div className="flex-1 w-full rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-700/50 shadow-inner animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center relative min-h-[200px] sm:min-h-[300px]">
              {isVideoLoading ? (
                <div className="flex flex-col items-center gap-4 text-slate-400"><Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-red-500" /><p className="font-black uppercase tracking-widest text-[10px] sm:text-xs">Searching YouTube...</p></div>
              ) : videoId ? (
                <iframe className="w-full h-full absolute inset-0" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} title="YouTube video" frameBorder="0" allowFullScreen></iframe>
              ) : (
                <div className="text-center p-6 sm:p-8 w-full">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">Watch Video Tutorial</h3>
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " " + pathwayTitle + " tutorial")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)] text-sm sm:text-base w-full sm:w-auto"><PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Open in YouTube</a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action Toolbar */}
        <div className="bg-slate-800/80 backdrop-blur-md border-t border-slate-700/50 p-4 sm:px-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-auto">
          <button 
            onClick={() => setShowQuiz(true)}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl font-black text-sm bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            AI Quick Quiz
          </button>

          <button 
            onClick={onMarkComplete} disabled={isCompleted}
            className={`group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm transition-all duration-500 transform ${isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white active:scale-95 sm:hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)]'}`}
          >
            {isCompleted ? <><CheckCircle className="w-4 h-4" /> Completed</> : <><Circle className="w-4 h-4" /> Mark as Completed</>}
          </button>
        </div>
      </div>

      <AiQuickQuiz 
        isOpen={showQuiz} 
        onClose={() => setShowQuiz(false)} 
        topic={topic} 
        pathwayTitle={pathwayTitle} 
      />
    </>
  );
}