import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database, Users, Settings, PlusCircle } from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 💡 ආරක්ෂකයා: Admin නෙවෙයි නම් මේ පිටුවට එන්න බැහැ
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user) return <div className="text-white text-center mt-20 text-xl font-bold">Loading Admin Data...</div>;
  if (user.role !== 'admin') return <div className="text-red-400 text-center mt-20 text-xl font-bold">Access Denied: You are not an Admin!</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-700/50">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-500" />
            Admin Control Center
          </h1>
          <p className="text-slate-400 mt-1">Manage users, roadmaps, and system settings.</p>
        </div>
      </div>

      {/* Admin Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Manage Roadmaps Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] transition-all group">
          <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Database className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Manage Roadmaps</h3>
          <p className="text-slate-400 text-sm mb-6">Add, edit, or delete popular learning paths from the database.</p>
          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <PlusCircle className="w-4 h-4" /> Add New Data
          </button>
        </div>

        {/* Manage Users Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 hover:border-blue-500/30 transition-all group">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">User Directory</h3>
          <p className="text-slate-400 text-sm mb-6">View registered students, update roles, or suspend accounts.</p>
          <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition-colors">
            View All Users
          </button>
        </div>

      </div>

    </div>
  );
}