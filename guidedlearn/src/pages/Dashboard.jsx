import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, BookOpen, PlayCircle, Plus } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; // 💡 අලුත් Imports

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myPathways, setMyPathways] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 Dashboard එක Load වෙද්දී User ගේ Pathways ටික අදිනවා
  useEffect(() => {
    const fetchMyPathways = async () => {
      if (!user?.uid) return;
      try {
        const q = query(
          collection(db, 'users', user.uid, 'my_pathways'),
          orderBy('enrolledAt', 'desc') // අලුත්ම ඒවා උඩින් පෙන්වන්න
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 font-sans">
      
      {/* Admin Banner */}
      {user?.role === 'admin' && (
        <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-[0_10px_30px_rgba(147,51,234,0.3)]">
          <div className="flex items-center gap-3 text-white mb-3 sm:mb-0">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Admin Privileges Active</h3>
              <p className="text-purple-200 text-xs">You have full access to manage the platform.</p>
            </div>
          </div>
          <Link to="/admin" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-700 hover:bg-purple-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:-translate-y-0.5">
            Go to Admin Panel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-12">
        <HeroSection />
      </div>

      {/* --- 🚀 My Active Pathways Section --- */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-cyan-400" /> My Active Pathways
        </h2>
        <Link to="/roadmap" className="text-cyan-400 text-sm font-bold hover:text-cyan-300 flex items-center gap-1 transition-colors">
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-800/50 rounded-3xl border border-slate-700/50"></div>)}
        </div>
      ) : myPathways.length === 0 ? (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No active pathways yet</h3>
          <p className="text-slate-400 mb-6 max-w-md">Start your learning journey by generating an AI roadmap for any topic you want to master.</p>
          <Link to="/roadmap" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25">
            Generate a Roadmap
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPathways.map((pathway) => (
            <div key={pathway.id} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 flex flex-col hover:border-cyan-500/30 transition-all group hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white leading-tight pr-4">{pathway.title}</h3>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-cyan-400">{pathway.progress}%</span>
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${pathway.progress}%` }}
                ></div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {Object.keys(pathway.levels || {}).length} Levels inside
                </span>
                <button 
                  onClick={() => navigate(`/pathway/${pathway.id}`)} // 💡 පස්සේ මේ පිටුව හදමු
                  className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors group-hover:text-cyan-400"
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