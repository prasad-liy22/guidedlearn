import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { Flame, Target, Trophy, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ streak: 0, progress: 0, title: 'Novice Explorer' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          
          const todayDate = new Date();
          const todayStr = todayDate.toISOString().split('T')[0]; 
          
          let currentStreak = data.streak || 0;
          let lastActive = data.lastActiveDate || null;
          let needsUpdate = false; 

          if (lastActive !== todayStr) {
            const yesterdayDate = new Date(todayDate);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

            if (lastActive === yesterdayStr) {
              currentStreak += 1;
            } else {
              currentStreak = 1;
            }
            
            needsUpdate = true; 
          }

          setStats({
            streak: currentStreak,
            progress: data.progress || 0,
            title: data.learningTitle || 'Novice Explorer'
          });

          if (needsUpdate) {
            await updateDoc(userRef, {
              streak: currentStreak,
              lastActiveDate: todayStr
            });
          }

        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.progress / 100) * circumference;

  if (isLoading) {
    return <div className="w-full min-h-[280px] md:min-h-[160px] bg-slate-900/50 rounded-2xl md:rounded-3xl animate-pulse border border-slate-700/50"></div>;
  }

  return (
    <div className="relative w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 overflow-hidden shadow-2xl">
      
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        
        {/* Left Side: Welcome Text */}
        <div className="flex-1 text-center md:text-left w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-400 text-xs font-bold mb-3 sm:mb-4 shadow-sm">
            <Sparkles className="w-3 h-3" />
            {stats.title}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight leading-tight">
            Welcome back, <br className="block sm:hidden"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.fullName?.split(' ')[0] || 'Student'}</span>! 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-lg mx-auto md:mx-0 leading-relaxed">
            Ready to conquer new concepts today? Your personalized AI learning path is waiting for you.
          </p>
        </div>

        {/* Right Side: Stats Cards */}
        <div className="grid grid-cols-2 md:flex items-stretch gap-3 sm:gap-4 w-full md:w-auto">
          
          {/* Streak Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center w-full md:min-w-[120px] hover:border-orange-500/30 transition-colors group shadow-lg">
            <Flame className={`w-7 h-7 sm:w-8 sm:h-8 mb-2 ${stats.streak > 0 ? 'text-orange-500 group-hover:animate-bounce' : 'text-slate-500'}`} />
            <div className="text-xl sm:text-2xl font-black text-white">{stats.streak}</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Day Streak</div>
          </div>

          {/* Progress Card (Circular Bar) */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center w-full md:min-w-[140px] hover:border-cyan-500/30 transition-colors shadow-lg">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-1 sm:mb-2">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700/50" />
                {/* Progress Circle */}
                <circle 
                  cx="50" cy="50" r={radius} 
                  stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round"
                  className="text-cyan-400 transition-all duration-1000 ease-out" 
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-base sm:text-lg font-black text-white">{stats.progress}%</span>
              </div>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
              <Target className="w-3 h-3 text-cyan-400" /> Overall
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}