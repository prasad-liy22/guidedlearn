import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatorRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRegister = async () => {
    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { role: 'creator' });
      toast.success("Welcome to the Creator Club! 🎉");
      navigate('/blogs');
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 pt-24 sm:pt-32 relative overflow-hidden">
      
      {/* Background Glow (Optional enhancement for look) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>


      <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 text-center backdrop-blur-xl shadow-2xl relative z-10">
        
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4 tracking-tight">Become a Creator</h1>
        
        <p className="text-slate-400 text-xs sm:text-sm mb-8 sm:mb-10 leading-relaxed">
          By registering, you'll be able to write and publish blogs to the Knowledge Hub. Join our expert community today!
        </p>
        
        <button 
          onClick={handleRegister}
          disabled={isUpdating}
          className="w-full py-3.5 sm:py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-600 disabled:opacity-70 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 group active:scale-95 shadow-lg shadow-cyan-500/20"
        >
          {isUpdating ? (
            <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <>
              <span className="text-sm sm:text-base">I'm Ready</span> 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5" />
            </>
          )}
        </button>
        
      </div>
    </div>
  );
}