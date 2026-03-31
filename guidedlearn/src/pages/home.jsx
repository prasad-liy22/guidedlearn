import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, ArrowRight, Brain, BookOpen, PenTool, 
  Zap, Users, Star, ChevronRight, ChevronDown,
  Map, Route, Compass, Search, Download, Trophy, CheckCircle2
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Is Learning Bench completely free to use?",
      a: "Yes! All our core features, including the study tools, focus timers, and the entire knowledge hub, are 100% free for students."
    },
    {
      q: "How can I become a verified creator?",
      a: "Simply register your profile, and you can start publishing blogs immediately from your Creator Studio."
    },
    {
      q: "How does the Learning Pathway work?",
      a: "You search for a specific subject pathway, import it to your personal dashboard, and follow the curated content step-by-step to master the skill."
    },
    {
      q: "Are the study tools available on mobile?",
      a: "Yes, our platform is fully responsive. You can read blogs, track pathways, and use productivity tools perfectly on your smartphone or tablet."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative pt-28 pb-16 lg:pt-48 lg:pb-32 px-4 sm:px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] sm:h-[600px] bg-purple-600/10 sm:bg-purple-600/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 left-1/4 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-cyan-600/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8 backdrop-blur-md shadow-sm">
            <Sparkles size={12} className="animate-pulse sm:w-3.5 sm:h-3.5" /> The Future of Learning
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 sm:mb-8 leading-tight sm:leading-[1.1]">
            Master Your Studies with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500">
              Structured Pathways
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 font-medium leading-relaxed px-2">
            Stop guessing what to learn next. Discover expertly curated learning pathways, track your progress, and acquire new skills all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link to="/blogs" className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white text-[#020617] hover:bg-slate-200 font-black rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 text-sm sm:text-base">
              Start Exploring <ArrowRight size={18} />
            </Link>
            
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-bold rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 backdrop-blur-md active:scale-95 text-sm sm:text-base">
                <Map size={18} /> Go to Dashboard
              </Link>
            ) : (
              <Link to="/signin" className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-white font-bold rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 backdrop-blur-md active:scale-95 text-sm sm:text-base">
                <Compass size={18} /> Join to Start Learning
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 🗺️ 2. CORE PURPOSE SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 bg-slate-950/50 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-5 sm:mb-6">
              <Route size={12} /> The Learning Process
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 sm:mb-6 leading-tight">
              Master Any Skill in <br/> <span className="text-cyan-400">3 Simple Steps</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
              We make self-learning highly organized. Find the perfect pathway for your career, bring it into your personal space, and simply follow the steps.
            </p>
            <ul className="space-y-5 sm:space-y-6 mb-8">
              <li className="flex items-start sm:items-center gap-4 text-slate-300 font-medium">
                <div className="p-3 bg-cyan-500/20 rounded-xl shrink-0"><Search size={18} className="text-cyan-400"/></div> 
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">1. Search & Import</h4>
                  <p className="text-xs sm:text-sm text-slate-500">Find a pathway and add it to your dashboard.</p>
                </div>
              </li>
              <li className="flex items-start sm:items-center gap-4 text-slate-300 font-medium">
                <div className="p-3 bg-purple-500/20 rounded-xl shrink-0"><BookOpen size={18} className="text-purple-400"/></div> 
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">2. Learn the Content</h4>
                  <p className="text-xs sm:text-sm text-slate-500">Dive into curated resources step-by-step.</p>
                </div>
              </li>
              <li className="flex items-start sm:items-center gap-4 text-slate-300 font-medium">
                <div className="p-3 bg-pink-500/20 rounded-xl shrink-0"><Trophy size={18} className="text-pink-400"/></div> 
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">3. Gain the Skill</h4>
                  <p className="text-xs sm:text-sm text-slate-500">Complete milestones and master the subject.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="w-full lg:w-1/2 relative mt-4 lg:mt-0">
            <div className="absolute inset-0 bg-linear-to-tr from-cyan-600/20 to-purple-600/20 blur-3xl rounded-full"></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-4 sm:gap-6">
               
               {/* Step 1 Mockup */}
               <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-800/50 border border-slate-700 rounded-xl sm:rounded-2xl">
                 <div className="flex items-center gap-2 sm:gap-3">
                   <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0"><Search size={14} className="text-cyan-400"/></div>
                   <div className="min-w-0"><h4 className="text-white font-bold text-xs sm:text-sm truncate">Fullstack Dev</h4><p className="text-[10px] text-slate-400">Found 1 Pathway</p></div>
                 </div>
                 <button className="px-2.5 py-1.5 bg-cyan-600/20 text-cyan-400 text-[10px] font-bold rounded-lg border border-cyan-500/30 flex items-center gap-1 shrink-0">
                   <Download size={12}/> Import
                 </button>
               </div>

               {/* Step 2 Mockup */}
               <div className="p-3 sm:p-4 bg-slate-800/50 border border-slate-700 rounded-xl sm:rounded-2xl">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="text-white font-bold text-xs sm:text-sm">Learning Progress</h4>
                   <span className="text-[10px] sm:text-xs text-purple-400 font-bold">65%</span>
                 </div>
                 <div className="w-full h-1.5 sm:h-2 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-linear-to-r from-cyan-400 to-purple-500 w-[65%] rounded-full"></div>
                 </div>
               </div>

               {/* Step 3 Mockup */}
               <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-linear-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl sm:rounded-2xl relative overflow-hidden group">
                 <div className="absolute right-[-5px] top-[-5px] opacity-10 transform rotate-12"><Trophy size={60} className="text-pink-400 sm:w-20 sm:h-20"/></div>
                 <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)] shrink-0">
                   <CheckCircle2 size={20} className="text-pink-400 sm:w-6 sm:h-6"/>
                 </div>
                 <div className="relative z-10">
                   <p className="text-[8px] sm:text-[10px] text-pink-400 font-black uppercase tracking-widest mb-0.5">Skill Acquired</p>
                   <h4 className="text-white font-bold text-xs sm:text-sm">React Developer</h4>
                 </div>
               </div>

            </div>
          </div>
        </div>
      </section>

      {/* 🚀 3. FEATURES SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Everything you need</h2>
            <p className="text-slate-400 text-sm sm:text-base">Powerful tools designed to accelerate your learning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:border-cyan-500/50 transition-colors group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-5 sm:mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">AI Study Tools</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Boost your focus with smart timers and personalized planners that adapt to you.</p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:border-purple-500/50 transition-colors group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5 sm:mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">Knowledge Hub</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Access a massive library of high-quality articles covering tech and science.</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] hover:border-pink-500/50 transition-colors group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-5 sm:mb-6 border border-pink-500/20 group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">Creator Studio</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Write your own blogs and build your portfolio as a verified creator.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 4. STATS SECTION */}
      <section className="py-16 sm:py-20 border-y border-slate-800/60 bg-slate-950/50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="p-2">
              <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 sm:mb-2">10K<span className="text-cyan-500">+</span></h4>
              <p className="text-slate-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest">Active Learners</p>
            </div>
            <div className="p-2">
              <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 sm:mb-2">500<span className="text-purple-500">+</span></h4>
              <p className="text-slate-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest">Articles</p>
            </div>
            <div className="p-2">
              <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 sm:mb-2">50<span className="text-pink-500">+</span></h4>
              <p className="text-slate-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest">Creators</p>
            </div>
            <div className="p-2">
              <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 sm:mb-2">4.9<span className="text-yellow-500">/5</span></h4>
              <p className="text-slate-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ 5. FAQ SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 bg-[#020617]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">FAQs</h2>
            <p className="text-slate-400 text-sm">Everything you need to know about G-Learn.</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-xl sm:rounded-2xl transition-all duration-300 ${openFaq === index ? 'border-cyan-500/50 bg-slate-900/80' : 'border-slate-800 bg-slate-900/30'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-white pr-4">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180 text-cyan-400' : ''}`} 
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="p-5 sm:p-6 pt-0 text-slate-400 text-sm sm:text-base leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 6. FINAL CTA BANNER */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative z-10 mb-6 sm:mb-10">
        <div className="max-w-5xl mx-auto bg-linear-to-br from-purple-900 to-cyan-900 rounded-3xl sm:rounded-[3rem] p-8 sm:p-16 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-white/10 blur-[60px] sm:blur-[80px] rounded-full"></div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 sm:mb-6 relative z-10 leading-tight">Ready to start?</h2>
          <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-8 sm:mb-10 relative z-10 font-medium px-2">
            Join thousands of students who are already using G-Learn to master new skills.
          </p>
          
          <Link to={user ? "/dashboard" : "/signin"} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-purple-900 px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black hover:bg-slate-100 active:scale-95 transition-all relative z-10 shadow-xl text-sm sm:text-base">
            {user ? "Go to Dashboard" : "Get Started for Free"} <ChevronRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}