import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, BrainCircuit } from 'lucide-react'; 
import { auth, db } from '../firebase'; // ඔයාගේ firebase.js තියෙන තැන අනුව path එක හදන්න
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

// --- Google Icon SVG ---
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.64 12.2727C23.64 11.4327 23.568 10.6173 23.43 9.81818H12V14.4709H18.5236C18.2427 15.9327 17.3918 17.1709 16.1264 18.0055V21.0191H20.0127C22.2855 18.96 23.64 15.8973 23.64 12.2727Z" fill="#4285F4"/>
    <path d="M12 24C15.24 24 17.9564 22.9255 19.9855 21.0191L16.1264 18.0055C15.0682 18.7118 13.7127 19.14 12 19.14C8.86909 19.14 6.21273 17.0673 5.26364 14.2691H1.21091V17.3455C3.18545 21.1855 7.21636 24 12 24Z" fill="#34A853"/>
    <path d="M5.26364 14.2691C5.01818 13.5382 4.88182 12.7718 4.88182 12C4.88182 11.2282 5.01818 10.4618 5.26364 9.73091V6.65455H1.21091C0.436364 8.16545 0 9.87273 0 12C0 14.1273 0.436364 15.8345 1.21091 17.3455L5.26364 14.2691Z" fill="#FBBC05"/>
    <path d="M12 4.86C13.7673 4.86 15.3491 5.45182 16.5982 6.61364L20.0727 3.21C17.9427 1.27091 15.2291 0 12 0C7.21636 0 3.18545 2.81455 1.21091 6.65455L5.26364 9.73091C6.21273 6.93273 8.86909 4.86 12 4.86Z" fill="#EA4335"/>
  </svg>
);

// --- 💡 අලුතින් එකතු කරපු GitHub Icon SVG එක ---
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.895 8.205 23.385C8.805 23.495 9.03 23.125 9.03 22.805C9.03 22.52 9.02 21.52 9.015 20.425C5.675 21.15 4.97 19.14 4.97 19.14C4.425 17.755 3.635 17.385 3.635 17.385C2.545 16.64 3.715 16.655 3.715 16.655C4.92 16.74 5.555 17.89 5.555 17.89C6.625 19.725 8.365 19.195 9.05 18.89C9.16 18.115 9.47 17.585 9.815 17.285C7.145 16.98 4.34 15.945 4.34 11.455C4.34 10.175 4.795 9.125 5.545 8.295C5.425 7.99 5.025 6.795 5.66 5.165C5.66 5.165 6.64 4.85 8.995 6.445C9.925 6.185 10.955 6.055 11.98 6.05C13.005 6.055 14.035 6.185 14.965 6.445C17.32 4.85 18.3 5.165 18.3 5.165C18.935 6.795 18.535 7.99 18.415 8.295C19.165 9.125 19.62 10.175 19.62 11.455C19.62 15.96 16.81 16.975 14.13 17.27C14.56 17.64 14.95 18.375 14.95 19.505C14.95 21.125 14.935 22.43 14.935 22.805C14.935 23.13 15.155 23.505 15.765 23.385C20.565 21.895 24 17.305 24 12C24 5.37 18.625 0 12 0Z"/>
  </svg>
);

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState({ score: 0, label: '', color: 'bg-transparent' });
  const { googleSignIn } = useAuth();

  useEffect(() => {
    const evaluatePassword = (pass) => {
      if (!pass) return { score: 0, label: '', color: 'bg-transparent' };
      let score = 0;
      if (pass.length >= 6) score += 1;
      if (pass.length >= 8) score += 1;
      if (/[A-Z]/.test(pass)) score += 1;
      if (/[0-9]/.test(pass)) score += 1;
      if (/[^A-Za-z0-9]/.test(pass)) score += 1;

      if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-red-500' };
      if (score <= 4) return { score: 66, label: 'Normal', color: 'bg-yellow-400' };
      return { score: 100, label: 'Strong', color: 'bg-cyan-500' };
    };
    setStrength(evaluatePassword(password));
  }, [password]);

  const handleSubmit = async (e) => { // 💡 මෙතනට 'async' දැම්මා
    e.preventDefault();
    const toastStyle = { borderRadius: '10px', background: '#1e293b', color: '#fff' };
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields!', { style: toastStyle });
      return;
    }
    if (strength.score < 100) {
      toast.error('Please use a Strong password.', { style: toastStyle });
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!', { style: toastStyle });
      return;
    }

    // 💡 නියම Firebase Logic එක පටන් ගන්නේ මෙතනින්
    const loadingToast = toast.loading('Creating your account...', { style: toastStyle });

    try {
      // 1. Firebase Auth ඇතුළේ User කෙනෙක් හදනවා
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. අර අපි කතා කරපු Email Verification Link එක යවනවා
      await sendEmailVerification(user);

      // 3. Firestore Database එකේ 'users' කියලා Collection එකක් හදලා User ගේ නම සේව් කරනවා
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName: name,
        email: email,
        createdAt: serverTimestamp(),
        role: 'student'
      });

      await signOut(auth);

      toast.dismiss(loadingToast);
      toast.success('Account created successfully!', { style: toastStyle });
      
      // 💡 Sign in වෙනුවට දැන් යන්නේ Verify Email පිටුවට (තත්පර 1.5කින්)
      setTimeout(() => navigate('/verify-email'), 1500);

    } catch (error) {
      toast.dismiss(loadingToast);
      // Firebase එකෙන් එන Error (උදා: Email එක දැනටමත් තියෙනවා නම්) ලස්සනට පෙන්වනවා
      toast.error(error.message.replace('Firebase: ', ''), { style: toastStyle });
    }
  };

  const handleGoogleSignIn = async () => {
  const toastStyle = { borderRadius: '10px', background: '#1e293b', color: '#fff' };
  try {
    await googleSignIn();
    toast.success('Successfully logged in with Google!', { style: toastStyle });
    navigate('/dashboard'); // කෙලින්ම Dashboard යවනවා
  } catch (error) {
    toast.error('Google Sign-In failed!', { style: toastStyle });
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen px-4 overflow-hidden relative font-sans">
      
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors group z-50"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </button>

      <div className="mt-23 w-full max-w-5xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-10 my-16 overflow-hidden flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/2 p-10 md:p-14 border-r border-slate-700/50 flex flex-col justify-center bg-slate-800/20">
          
          <Link to="/" className="inline-block text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 mb-4 drop-shadow-sm">
            AI EduApp
          </Link>

          <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-10 mt-6 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <BrainCircuit className="w-10 h-10" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Empower <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500">Your Learning Journey</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed mb-10">
            Education is not just about memorizing facts; it's about training the mind to think, innovate, and adapt. Register today to unlock personalized, AI-driven pathways tailored to your unique potential.
          </p>
          
          <div className="text-sm text-slate-600">
            © 2024 AI EduApp. All rights reserved.
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-14">
          
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm">Start your AI-powered learning journey.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"/>
              
              {password.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Password Strength</span>
                    <span className={`text-xs font-bold ${strength.label === 'Weak' ? 'text-red-400' : strength.label === 'Normal' ? 'text-yellow-400' : 'text-cyan-400'}`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-500 ease-out`} style={{ width: `${strength.score}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"/>
            </div>

            <button type="submit" className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 transition-all mt-6">
              Sign Up
            </button>
            
          </form>

          <div className="flex items-center gap-3 my-8">
            <div className="h-px w-full bg-slate-700/80"></div>
            <span className="text-slate-500 text-sm">OR</span>
            <div className="h-px w-full bg-slate-700/80"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleGoogleSignIn} className="flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-white/5 text-gray-300 transition-colors duration-300 cursor-pointer">
              <GoogleIcon />
              <span className="text-sm font-medium">with Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-white/5 text-gray-300 transition-colors duration-300">
              {/* 💡 මෙතනත් අපි SVG එක Call කළා */}
              <GithubIcon />
              <span className="text-sm font-medium">with GitHub</span>
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-10">
            Already have an account?{' '}
            <Link to="/signin" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
  
}