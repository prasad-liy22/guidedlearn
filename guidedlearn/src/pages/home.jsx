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
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-hidden">
      
      {/* 🌟 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" /> The Future of Learning
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            Master Your Studies with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              Structured Pathways
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Stop guessing what to learn next. Discover expertly curated learning pathways, track your progress, and acquire new skills all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/blogs" className="w-full sm:w-auto px-8 py-4 bg-white text-[#020617] hover:bg-slate-200 font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
              Start Exploring <ArrowRight size={20} />
            </Link>
            
            {user ? (
              <Link to="/roadmap" className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <Map size={20} /> Go to Dashboard
              </Link>
            ) : (
              <Link to="/signin" className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                <Compass size={20} /> Join to Start Learning
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 🗺️ 2. CORE PURPOSE SECTION (The True Pathway Process) */}
      <section className="py-24 px-6 relative z-10 bg-slate-950/50 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Route size={14} /> The Learning Process
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Master Any Skill in <br/> <span className="text-cyan-400">3 Simple Steps</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              We make self-learning highly organized. Find the perfect pathway for your career, bring it into your personal space, and simply follow the steps. Learning has never been this clear.
            </p>
            <ul className="space-y-6 mb-8">
              <li className="flex items-center gap-4 text-slate-300 font-medium">
                <div className="p-3 bg-cyan-500/20 rounded-xl"><Search size={20} className="text-cyan-400"/></div> 
                <div>
                  <h4 className="font-bold text-white">1. Search & Import</h4>
                  <p className="text-sm text-slate-500">Find a pathway and add it to your dashboard.</p>
                </div>
              </li>
              <li className="flex items-center gap-4 text-slate-300 font-medium">
                <div className="p-3 bg-purple-500/20 rounded-xl"><BookOpen size={20} className="text-purple-400"/></div> 
                <div>
                  <h4 className="font-bold text-white">2. Learn the Content</h4>
                  <p className="text-sm text-slate-500">Dive into curated resources step-by-step.</p>
                </div>
              </li>
              <li className="flex items-center gap-4 text-slate-300 font-medium">
                <div className="p-3 bg-pink-500/20 rounded-xl"><Trophy size={20} className="text-pink-400"/></div> 
                <div>
                  <h4 className="font-bold text-white">3. Gain the Skill</h4>
                  <p className="text-sm text-slate-500">Complete milestones and master the subject.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="md:w-1/2 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 to-purple-600/20 blur-3xl rounded-full"></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
               
               {/* Step 1 Mockup: Import */}
               <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center"><Search size={16} className="text-cyan-400"/></div>
                   <div><h4 className="text-white font-bold text-sm">Fullstack Development</h4><p className="text-xs text-slate-400">Found 1 Pathway</p></div>
                 </div>
                 <button className="px-3 py-1.5 bg-cyan-600/20 text-cyan-400 text-xs font-bold rounded-lg border border-cyan-500/30 flex items-center gap-1">
                   <Download size={14}/> Import
                 </button>
               </div>

               {/* Step 2 Mockup: Progress */}
               <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="text-white font-bold text-sm">Learning Progress</h4>
                   <span className="text-xs text-purple-400 font-bold">65%</span>
                 </div>
                 <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 w-[65%] rounded-full"></div>
                 </div>
               </div>

               {/* Step 3 Mockup: Achievement */}
               <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl relative overflow-hidden group">
                 <div className="absolute right-[-10px] top-[-10px] opacity-10 transform rotate-12"><Trophy size={80} className="text-pink-400"/></div>
                 <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                   <CheckCircle2 size={24} className="text-pink-400"/>
                 </div>
                 <div className="relative z-10">
                   <p className="text-[10px] text-pink-400 font-black uppercase tracking-widest mb-0.5">Skill Acquired</p>
                   <h4 className="text-white font-bold">React Developer</h4>
                 </div>
               </div>

            </div>
          </div>
        </div>
      </section>

      {/* 🚀 3. FEATURES SECTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Everything you need in one place</h2>
            <p className="text-slate-400">Powerful tools designed to accelerate your learning journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-cyan-500/50 transition-colors group">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Study Tools</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Boost your focus with smart timers and personalized study planners that adapt to your rhythm.</p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-purple-500/50 transition-colors group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Knowledge Hub</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Access a massive library of high-quality articles covering tech, productivity, and science.</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-pink-500/50 transition-colors group">
              <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/20 group-hover:scale-110 transition-transform">
                <PenTool className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Creator Studio</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Write your own blogs, share your expertise, and build your portfolio as a verified creator.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 4. STATS SECTION */}
      <section className="py-20 border-y border-slate-800/60 bg-slate-950/50 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-4xl md:text-5xl font-black text-white mb-2">10K<span className="text-cyan-500">+</span></h4>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Active Learners</p>
            </div>
            <div>
              <h4 className="text-4xl md:text-5xl font-black text-white mb-2">500<span className="text-purple-500">+</span></h4>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Published Articles</p>
            </div>
            <div>
              <h4 className="text-4xl md:text-5xl font-black text-white mb-2">50<span className="text-pink-500">+</span></h4>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Verified Creators</p>
            </div>
            <div>
              <h4 className="text-4xl md:text-5xl font-black text-white mb-2">4.9<span className="text-yellow-500">/5</span></h4>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ 5. FAQ SECTION */}
      <section className="py-24 px-6 relative z-10 bg-[#020617]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about Learning Bench.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-300 ${openFaq === index ? 'border-cyan-500/50 bg-slate-900/80 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-bold text-white">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-cyan-400' : ''}`} 
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="p-6 pt-0 text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 6. FINAL CTA BANNER */}
      <section className="py-20 px-6 relative z-10 mb-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-900 to-cyan-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 blur-[80px] rounded-full"></div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">Ready to start learning?</h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 relative z-10 font-medium">
            Join thousands of students who are already using Learning Bench to import pathways and master new skills.
          </p>
          
          <Link to={user ? "/dashboard" : "/signin"} className="inline-flex items-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-transform transform hover:scale-105 relative z-10 shadow-xl">
            {user ? "Go to Dashboard" : "Get Started for Free"} <ChevronRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
}