import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">
          Welcome back, <span className="text-cyan-400">{user?.fullName}</span>! 👋
        </h1>
        <p className="text-slate-400 mt-2">Here's an overview of your AI learning progress.</p>
      </div>

      {/* Dashboard Stats / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-4">My Profile</h3>
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl font-bold">
                {user?.fullName?.charAt(0)}
             </div>
             <div>
                <p className="text-white font-bold">{user?.fullName}</p>
                <p className="text-slate-500 text-xs">{user?.email}</p>
             </div>
          </div>
        </div>

        {/* Saved Roadmaps Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-4">Active Roadmaps</h3>
          <p className="text-2xl font-black text-white">0</p>
          <p className="text-slate-500 text-xs mt-1">Start creating your first roadmap!</p>
        </div>

        {/* Courses in Progress */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-4">Completed Lessons</h3>
          <p className="text-2xl font-black text-white">0%</p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2">
            <div className="bg-cyan-500 h-full w-[0%] rounded-full"></div>
          </div>
        </div>

      </div>
    </div>
  );
}