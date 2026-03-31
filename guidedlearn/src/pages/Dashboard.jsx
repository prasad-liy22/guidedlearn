import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, BookOpen, PlayCircle, Plus } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; 

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myPathways, setMyPathways] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyPathways = async () => {
      if (!user?.uid) return;
      try {
        const q = query(
          collection(db, 'users', user.uid, 'my_pathways'),
          orderBy('enrolledAt', 'desc') 
        );
        const querySnapshot = await getDocs(q);
        const pathways = [];
        querySnapshot.forEach((doc) => {
          pathways.push({ id: doc.id, ...doc.data() });
        });
        setMyPathways(pathways);
      } catch (error) {
        console.error("Error fetching pathways:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPathways();
  }, [user]);

  return (
    // 💡 Navbar එකට යට නොවෙන්න pt-24 sm:pt-28 දුන්නා
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-16 font-sans">
      
      {/* Admin Banner */}
      {user?.role === 'admin' && (
        // 💡 bg-linear-to-r එක bg-gradient-to-r කියලා හැදුවා, gap-4 දුන්නා mobile වලට
        <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-[0_10px_30px_rgba(147,51,234,0.3)] gap-4">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 sm:p-2.5 bg-white/20 rounded-xl shrink-0">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">Admin Privileges Active</h3>
              <p className="text-purple-200 text-[11px] sm:text-xs mt-0.5">You have full access to manage the platform.</p>
            </div>
          </div>
          {/* 💡 Mobile වල w-full සහ active:scale-95 දුන්නා */}
          <Link to="/admin" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-700 hover:bg-purple-50 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 sm:hover:-translate-y-0.5 shrink-0">
            Go to Admin Panel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-10 sm:mb-12">
        <HeroSection />
      </div>

      {/* --- 🚀 My Active Pathways Section --- */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0" /> My Active Pathways
        </h2>
        <Link to="/roadmap" className="text-cyan-400 text-xs sm:text-sm font-bold hover:text-cyan-300 flex items-center gap-1 transition-colors active:scale-95 shrink-0 bg-cyan-500/10 px-3 py-1.5 rounded-lg sm:bg-transparent sm:px-0 sm:py-0">
          <Plus className="w-4 h-4" /> <span className="hidden xs:inline">Add New</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-800/50 rounded-2xl sm:rounded-3xl border border-slate-700/50"></div>)}
        </div>
      ) : myPathways.length === 0 ? (
        // 💡 Mobile වල p-6 දුන්නා
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center flex flex-col items-center justify-center shadow-lg">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No active pathways yet</h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-md">Start your learning journey by generating an AI roadmap for any topic you want to master.</p>
          <Link to="/roadmap" className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3.5 sm:py-3 rounded-xl transition-all shadow-lg active:scale-95 sm:hover:shadow-cyan-500/25 flex items-center justify-center">
            Generate a Roadmap
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {myPathways.map((pathway) => (
            // 💡 p-5 සහ active:scale-[0.98] දුන්නා
            <div key={pathway.id} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col hover:border-cyan-500/30 transition-all group active:scale-[0.98] sm:hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight pr-4 line-clamp-2">{pathway.title}</h3>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0 border border-slate-700">
                  <span className="text-[10px] sm:text-xs font-bold text-cyan-400">{pathway.progress}%</span>
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-2 mb-6 sm:mb-8 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${pathway.progress}%` }}
                ></div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                  {Object.keys(pathway.levels || {}).length} Levels inside
                </span>
                <button 
                  onClick={() => navigate(`/pathway/${pathway.id}`)} 
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-white bg-white/5 hover:bg-white/10 px-3 sm:px-4 py-2 rounded-lg transition-colors group-hover:text-cyan-400 active:scale-95"
                >
                  <PlayCircle className="w-4 h-4" /> Resume
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}