import { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, FileText, Sparkles, Loader2, CheckCircle, Circle } from 'lucide-react';

export default function LearningWorkspace({ pathwayTitle, levelTitle, topic, isCompleted, onMarkComplete }) {
  const [mode, setMode] = useState('text');
  const [articleContent, setArticleContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // --- 🚀 AI Article Generation ---
  useEffect(() => {
    if (mode === 'text' && topic) {
      generateArticle();
    }
  }, [topic, mode]);

  const generateArticle = async () => {
    setIsGenerating(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const prompt = `
        You are an expert tutor. Explain the topic "${topic}" which is a part of the "${levelTitle}" level in a "${pathwayTitle}" course.
        Keep it highly engaging, simple to understand, and under 300 words. 
        Format the response STRICTLY in valid HTML using only <h3>, <p>, <ul>, <li>, and <strong> tags. 
        Do not use markdown like \`\`\`html. Start directly with the content.
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("RATE_LIMIT"); 
        }
        throw new Error("API_ERROR");
      }

      let htmlContent = data.candidates[0].content.parts[0].text;
      htmlContent = htmlContent.replace(/```html/gi, '').replace(/```/gi, '').trim();
      setArticleContent(htmlContent);

    } catch (error) {
      console.error("Failed to generate article:", error);
      if (error.message === "RATE_LIMIT") {
        setArticleContent(`
          <div class="p-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-center">
            <h3 class="text-orange-400 font-bold text-xl mb-2">Wow, slow down a bit! 🚦</h3>
            <p class="text-slate-300">You are requesting new lessons too fast and hit the free AI limit. Please wait about 30 seconds and try clicking 'Read' again.</p>
          </div>
        `);
      } else {
        setArticleContent("<p class='text-red-400'>Oops! Failed to load the AI explanation. Please check your internet connection or API key.</p>");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 🚀 YouTube Video Fetching ---
  useEffect(() => {
    if (mode === 'video' && topic) {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      if (apiKey) {
        fetchYouTubeVideo(apiKey);
      } else {
        setVideoId(null);
      }
    }
  }, [mode, topic, pathwayTitle]);

  const fetchYouTubeVideo = async (apiKey) => {
    setIsVideoLoading(true);
    try {
      const query = encodeURIComponent(`${topic} ${pathwayTitle} tutorial programming`);
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&key=${apiKey}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        setVideoId(data.items[0].id.videoId);
      }
    } catch (error) {
      console.error("YouTube API Error:", error);
      setVideoId(null);
    } finally {
      setIsVideoLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
      
      {/* --- 🛠️ Header & Tool Bar --- */}
      <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight truncate max-w-[200px] sm:max-w-xs">{topic}</h2>
            <p className="text-xs text-slate-400">{levelTitle}</p>
          </div>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700/50 shrink-0">
          <button 
            onClick={() => setMode('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'text' ? 'bg-cyan-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <FileText className="w-4 h-4" /> Read
          </button>
          <button 
            onClick={() => setMode('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'video' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-slate-400 hover:text-white'}`}
          >
            <PlayCircle className="w-4 h-4" /> Watch
          </button>
        </div>
      </div>

      {/* --- 📖 Content Area --- */}
      <div className="p-6 md:p-8 flex-1 relative bg-slate-900/20 flex flex-col">
        
        {/* TEXT MODE */}
        {mode === 'text' && (
          <div className="animate-in fade-in duration-500">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-64 text-cyan-400 gap-4">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="font-bold animate-pulse flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI is writing your lesson...
                </p>
              </div>
            ) : (
              <div 
                className="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: articleContent }}
              />
            )}
          </div>
        )}

        {/* VIDEO MODE */}
        {mode === 'video' && (
          <div className="flex-1 w-full rounded-2xl overflow-hidden bg-slate-950/50 border border-slate-700/50 shadow-inner animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center relative">
            
            {isVideoLoading ? (
              <div className="flex flex-col items-center gap-4 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                <p className="font-medium text-sm">Searching YouTube for best tutorials...</p>
              </div>
            ) : videoId ? (
              <iframe 
                className="w-full h-full absolute inset-0"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-center p-8 w-full">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {/* YouTube SVG */}
                  <svg className="w-10 h-10 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Watch Video Tutorial</h3>
                <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                  We found the best video tutorials for <strong className="text-slate-200">"{topic}"</strong>. Click below to watch them on YouTube.
                </p>
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " " + pathwayTitle + " tutorial")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                >
                  <PlayCircle className="w-5 h-5" /> Open in YouTube
                </a>
              </div>
            )}

          </div>
        )}
      </div>

      {/* --- 🚀 NEW: Bottom Action Toolbar --- */}
      <div className="bg-slate-800/80 backdrop-blur-md border-t border-slate-700/50 p-4 px-6 flex items-center justify-end mt-auto">
        <button 
          onClick={onMarkComplete}
          disabled={isCompleted}
          className={`group flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-500 transform ${
            isCompleted 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-0.5'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 animate-in zoom-in duration-300" /> 
              Completed
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
              Mark as Completed
            </>
          )}
        </button>
      </div>

    </div>
  );
}