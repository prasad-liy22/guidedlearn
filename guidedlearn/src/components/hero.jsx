import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="mt-15 relative flex flex-col items-center justify-center min-h-[85vh] px-4 text-center overflow-hidden">
      
      {/* --- Background Glowing Orbs --- */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* --- Live Status Tagline --- */}
      <div className="mb-8 inline-flex items-center px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-sm">
        <span className="flex w-2 h-2 rounded-full bg-cyan-400 mr-3 animate-pulse"></span>
        AI-Powered Learning Platform v1.0
      </div>

      {/* --- Main Headline --- */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
        The Future of <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500">
          Education Starts Here.
        </span>
      </h1>

      {/* --- Description --- */}
      <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
        Empowering the world through AI-driven education. Generate your personalized learning roadmap and start your journey today.
        </p>

      {/* --- Call to Action Buttons --- */}
      <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto z-10">
        
        <Link to="/signup" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-105 border border-cyan-400/30 flex items-center justify-center">
          Get Started
        </Link>
        
        <Link to="/blogs" className="px-8 py-4 rounded-xl text-lg font-bold text-white bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-cyan-500/50 backdrop-blur-md transition-all duration-300 hover:scale-105 flex items-center justify-center">
          Explore more
        </Link>

      </div>

      {/* --- Platform Statistics --- */}
      <div className="mt-24 grid grid-cols-3 gap-4 md:gap-12 border-t border-slate-800/80 pt-10 w-full max-w-3xl">
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">100+</h3>
          <p className="text-slate-500 text-xs md:text-sm uppercase tracking-wider">Topics</p>
        </div>
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 mb-1">100%</h3>
          <p className="text-slate-500 text-xs md:text-sm uppercase tracking-wider">AI Powered</p>
        </div>
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</h3>
          <p className="text-slate-500 text-xs md:text-sm uppercase tracking-wider">Access</p>
        </div>
      </div>

    </div>
  );
}

export default Hero;