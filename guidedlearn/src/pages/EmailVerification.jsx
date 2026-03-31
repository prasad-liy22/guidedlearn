import { Link } from 'react-router-dom';
import { MailCheck, ArrowRight } from 'lucide-react';

export default function EmailVerification() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden relative font-sans bg-[#020617]">
      
      {/* Background Glowing Effects */}
      <div className="absolute top-1/4 left-1/4 w-60 h-60 sm:w-72 sm:h-72 bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-[100px] sm:blur-[120px] -z-10"></div>

      {/* Verification Card */}
      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-10 text-center transform transition-all">
        
        {/* Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-6 sm:mb-8 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <MailCheck className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight">
          Verify your email
        </h2>
        
        <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed px-2 sm:px-0">
          We've sent a verification link to your email address. Please check your inbox (and spam folder) and click the link to activate your account.
        </p>

        <div className="flex flex-col gap-3 sm:gap-4">
          <a 
            href="https://mail.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transform active:scale-95 sm:hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Open Gmail <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          
          <Link 
            to="/signin" 
            className="w-full bg-slate-800/50 border border-slate-700 text-slate-300 font-bold py-3.5 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all active:scale-95 text-sm sm:text-base"
          >
            I've verified my email (Sign In)
          </Link>
        </div>

      </div>
    </div>
  );
}