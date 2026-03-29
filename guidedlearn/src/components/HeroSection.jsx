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
          
          // --- 🚀 Streak Calculation Logic ---
          const todayDate = new Date();
          // දවස විතරක් වෙන් කරගන්නවා (උදා: "2026-03-29")
          const todayStr = todayDate.toISOString().split('T')[0]; 
          
          let currentStreak = data.streak || 0;
          let lastActive = data.lastActiveDate || null;
          let needsUpdate = false; // Database එක අප්ඩේට් කරන්න ඕනෙද කියලා බලන්න

          if (lastActive !== todayStr) {
            // අද දවසට තාම අප්ඩේට් වෙලා නෑ. ඒ කියන්නේ අපි Streak එක චෙක් කරන්න ඕනේ.
            const yesterdayDate = new Date(todayDate);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

            if (lastActive === yesterdayStr) {
              // ඊයේ ඇවිත් තියෙනවා! Streak එක වැඩි කරනවා 🔥
              currentStreak += 1;
            } else {
              // දවස් මිස් වෙලා. Streak එක 1න් පටන් ගන්නවා 😢
              currentStreak = 1;
            }
            
            needsUpdate = true; // අලුත් අගයන් සේව් කරන්න ඕනේ
          }

          // State එකට දානවා UI එකේ පෙන්වන්න
          setStats({
            streak: currentStreak,
            progress: data.progress || 0,
            title: data.learningTitle || 'Novice Explorer'
          });

          // 💡 Database එක Update කරනවා (අවශ්‍ය නම් විතරක්)
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

  // Circular Progress Bar එක සඳහා ගණනය කිරීම්
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.progress / 100) * circumference;

  if (isLoading) {
    return <div className="w-full h-40 bg-slate-900/50 rounded-3xl animate-pulse border border-slate-700/50"></div>;
  }

  return (
    <div className="relative w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl">
      
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Welcome Text */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-400 text-xs font-bold mb-4">
            <Sparkles className="w-3 h-3" />
            {stats.title}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.fullName?.split(' ')[0] || 'Student'}</span>! 👋
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg">
            Ready to conquer new concepts today? Your personalized AI learning path is waiting for you.
          </p>
        </div>

        {/* Right Side: Stats Cards */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          
          {/* Streak Card */}
          <div className="flex-1 md:flex-none bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] hover:border-orange-500/30 transition-colors group">
            <Flame className={`w-8 h-8 mb-2 ${stats.streak > 0 ? 'text-orange-500 group-hover:animate-bounce' : 'text-slate-500'}`} />
            <div className="text-2xl font-black text-white">{stats.streak}</div>
            <div className="text-xs text-slate-400 font-medium">Day Streak</div>
          </div>

          {/* Progress Card (Circular Bar) */}
          <div className="flex-1 md:flex-none bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[140px] hover:border-cyan-500/30 transition-colors">
            <div className="relative w-20 h-20 flex items-center justify-center mb-1">
              {/* SVG Circular Progress */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                {/* Background Circle */}
                <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-700/50" />
                {/* Progress Circle */}
                <circle 
                  cx="40" cy="40" r={radius} 
                  stroke="currentColor" strokeWidth="6" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round"
                  className="text-cyan-400 transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-black text-white">{stats.progress}%</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Target className="w-3 h-3 text-cyan-400" /> Overall
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}