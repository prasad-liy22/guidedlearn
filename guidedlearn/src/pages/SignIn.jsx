import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';


// --- Google Icon SVG ---
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.64 12.2727C23.64 11.4327 23.568 10.6173 23.43 9.81818H12V14.4709H18.5236C18.2427 15.9327 17.3918 17.1709 16.1264 18.0055V21.0191H20.0127C22.2855 18.96 23.64 15.8973 23.64 12.2727Z" fill="#4285F4"/>
    <path d="M12 24C15.24 24 17.9564 22.9255 19.9855 21.0191L16.1264 18.0055C15.0682 18.7118 13.7127 19.14 12 19.14C8.86909 19.14 6.21273 17.0673 5.26364 14.2691H1.21091V17.3455C3.18545 21.1855 7.21636 24 12 24Z" fill="#34A853"/>
    <path d="M5.26364 14.2691C5.01818 13.5382 4.88182 12.7718 4.88182 12C4.88182 11.2282 5.01818 10.4618 5.26364 9.73091V6.65455H1.21091C0.436364 8.16545 0 9.87273 0 12C0 14.1273 0.436364 15.8345 1.21091 17.3455L5.26364 14.2691Z" fill="#FBBC05"/>
    <path d="M12 4.86C13.7673 4.86 15.3491 5.45182 16.5982 6.61364L20.0727 3.21C17.9427 1.27091 15.2291 0 12 0C7.21636 0 3.18545 2.81455 1.21091 6.65455L5.26364 9.73091C6.21273 6.93273 8.86909 4.86 12 4.86Z" fill="#EA4335"/>
  </svg>
);

// --- GitHub Icon SVG ---
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.895 8.205 23.385C8.805 23.495 9.03 23.125 9.03 22.805C9.03 22.52 9.02 21.52 9.015 20.425C5.675 21.15 4.97 19.14 4.97 19.14C4.425 17.755 3.635 17.385 3.635 17.385C2.545 16.64 3.715 16.655 3.715 16.655C4.92 16.74 5.555 17.89 5.555 17.89C6.625 19.725 8.365 19.195 9.05 18.89C9.16 18.115 9.47 17.585 9.815 17.285C7.145 16.98 4.34 11.455 4.34 11.455C4.34 10.175 4.795 9.125 5.545 8.295C5.425 7.99 5.025 6.795 5.66 5.165C5.66 5.165 6.64 4.85 8.995 6.445C9.925 6.185 10.955 6.055 11.98 6.05C13.005 6.055 14.035 6.185 14.965 6.445C17.32 4.85 18.3 5.165 18.3 5.165C18.935 6.795 18.535 7.99 18.415 8.295C19.165 9.125 19.62 10.175 19.62 11.455C19.62 15.96 16.81 16.975 14.13 17.27C14.56 17.64 14.95 18.375 14.95 19.505C14.95 21.125 14.935 22.43 14.935 22.805C14.935 23.13 15.155 23.505 15.765 23.385C20.565 21.895 24 17.305 24 12C24 5.37 18.625 0 12 0Z"/>
  </svg>
);

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { googleSignIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastStyle = { borderRadius: '10px', background: '#1e293b', color: '#fff' };
    
    if (!email || !password) {
      toast.error('Please enter both email and password.', { style: toastStyle });
      return;
    }
    
    const loadingToast = toast.loading('Signing in...', { style: toastStyle });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      toast.dismiss(loadingToast);

      if (!user.emailVerified) {
        toast.error('Please verify your email address. Check your inbox!', { style: toastStyle, duration: 4000 });
        return;
      }

      toast.success('Successfully logged in!', { style: toastStyle });
      navigate('/'); 

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Invalid email or password!', { style: toastStyle });
    }
  };

  const handleGoogleSignIn = async () => {
    const toastStyle = { borderRadius: '10px', background: '#1e293b', color: '#fff' };
    try {
      await googleSignIn();
      toast.success('Logged in with Google!', { style: toastStyle });
      navigate('/dashboard'); 
    } catch (error) {
      toast.error('Google Sign-In failed!', { style: toastStyle });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 overflow-x-hidden relative font-sans bg-[#020617]">
      
      {/* Background Glowing Effects */}
      <div className="absolute top-1/4 right-1/4 w-60 h-60 sm:w-72 sm:h-72 bg-blue-500/10 rounded-full blur-[80px] sm:blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-600/10 rounded-full blur-[100px] sm:blur-[120px] -z-10"></div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-50 text-sm font-bold active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Home</span>
      </button>

      {/* Main Login Container */}
      <div className="w-full max-w-5xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-10 overflow-hidden flex flex-col md:flex-row-reverse mt-10">
        
        {/* Left Side: Welcome Info */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-14 border-t md:border-t-0 md:border-l border-slate-700/50 flex flex-col justify-center bg-slate-800/10">
          
          <Link to="/" className="inline-block text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            AI EduApp
          </Link>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 sm:mb-10 mt-2 sm:mt-6 shadow-inner">
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4 sm:mb-6">
            Welcome <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500">Back!</span>
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-6 sm:mb-10">
            Pick up right where you left off. Access your personalized AI roadmaps and keep upgrading your skills.
          </p>
          
          <div className="text-[10px] sm:text-xs text-slate-600 font-bold uppercase tracking-widest">
            © 2026 AI EduApp.
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-14">
          
          <div className="mb-8 sm:mb-10 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Sign In</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Access your AI-powered dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com" 
                // 💡 text-base (16px) for iOS zoom fix
                className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-white text-base sm:text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-[10px] sm:text-xs text-cyan-400 hover:text-cyan-300 font-bold">
                  Forgot?
                </a>
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-white text-base sm:text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            <button 
              type="submit" 
              // 💡 active:scale-95 and corrected bg-gradient
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-3.5 sm:py-4 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all mt-4 text-sm sm:text-base uppercase tracking-widest"
            >
              Sign In
            </button>
            
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="h-px w-full bg-slate-800"></div>
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-tighter">OR</span>
            <div className="h-px w-full bg-slate-800"></div>
          </div>

          {/* Social Sign In Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button onClick={handleGoogleSignIn} className="cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-700 hover:bg-white/5 text-slate-300 transition-all active:scale-95">
              <GoogleIcon />
              <span className="text-xs sm:text-sm font-bold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-700 hover:bg-white/5 text-slate-300 transition-all active:scale-95">
              <GithubIcon />
              <span className="text-xs sm:text-sm font-bold">GitHub</span>
            </button>
          </div>

          <p className="text-center text-slate-500 text-xs sm:text-sm mt-8 font-medium">
            New here?{' '}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  ); 
}