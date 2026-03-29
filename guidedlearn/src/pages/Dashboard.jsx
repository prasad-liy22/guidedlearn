import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react'; // 💡 Icons අලුතින් ගත්තා

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      
      {/* --- 💡 Admin Banner Section --- */}
      {user?.role === 'admin' && (
        <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-[0_10px_30px_rgba(147,51,234,0.3)] animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 text-white mb-3 sm:mb-0">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Admin Privileges Active</h3>
              <p className="text-purple-200 text-xs">You have full access to manage the platform.</p>
            </div>
          </div>
          <Link 
            to="/admin" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-700 hover:bg-purple-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Go to Admin Panel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* --- කලින් තිබුණු Dashboard එකේ Header එක --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">
          Welcome back, <span className="text-cyan-400">{user?.fullName}</span>! 👋
        </h1>
        <p className="text-slate-400 mt-2">Here's an overview of your AI learning progress.</p>
      </div>

      {/* Dashboard Stats / Grid එක කලින් විදිහටම තියන්න... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ... */}
      </div>
      
    </div>
  );
}