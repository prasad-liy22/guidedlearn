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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 pt-32">
      <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 text-center backdrop-blur-xl">
        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <ShieldCheck className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Become a Creator</h1>
        <p className="text-slate-400 text-sm mb-10 leading-relaxed">
          By registering, you'll be able to write and publish blogs to the Knowledge Hub. Join our expert community today!
        </p>
        <button 
          onClick={handleRegister}
          disabled={isUpdating}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl transition-all flex items-center justify-center gap-2 group"
        >
          {isUpdating ? <Loader2 className="animate-spin" /> : <>I'm Ready <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
        </button>
      </div>
    </div>
  );
}