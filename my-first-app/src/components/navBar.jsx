import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 💡 Dropdown එකෙන් එළියේ click කළොත් ඒක වහන Logic එක
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <div className="pt-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      
      {/* ප්‍රධාන Navbar එක */}
      <nav className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(6,182,212,0.15)] rounded-2xl px-6 py-3 transition-all duration-300">
        <div className="flex justify-between items-center">
          
          {/* 1. Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 hover:scale-105 transition-transform duration-300 drop-shadow-sm">
              G-Learn
            </Link>
          </div>

          {/* 2. Main Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link to="/" className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 lg:px-4 rounded-xl text-sm font-medium transition-all duration-300">
              Home
            </Link>
            <Link to="/blogs" className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 lg:px-4 rounded-xl text-sm font-medium transition-all duration-300">
              Blogs
            </Link>
            <Link to="/tools" className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 lg:px-4 rounded-xl text-sm font-medium transition-all duration-300">
              Tools
            </Link>
            <Link to="/roadmap" className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 lg:px-4 rounded-xl text-sm font-medium transition-all duration-300">
              Roadmap
            </Link>
          </div>

          {/* 3. Auth Section & Dashboard */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              
              <div className="flex items-center gap-3 md:gap-6">
                
                {/* 💡 Dashboard Button (කෙලින්ම Navbar එකේ පේන්න දැම්මා) */}
                <Link 
                  to="/dashboard" 
                  className="hidden sm:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-colors bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* පොඩි ඉරක් (Divider) */}
                <div className="hidden sm:block w-px h-6 bg-slate-700/50"></div>

                {/* 💡 Dropdown Menu Section */}
                <div className="relative" ref={dropdownRef}>
                  
                  {/* Profile Picture Trigger Button */}
                  <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center focus:outline-none group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 p-0.5 group-hover:border-cyan-400 transition-all duration-300 relative shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      {/* Online Status Dot */}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                    </div>
                  </button>

                  {/* 💡 Dropdown Card (Profile & Logout පමණයි) */}
                  {isOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                      
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      {/* Profile Link */}
                      <div className="p-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                          <UserIcon className="w-4 h-4 text-cyan-400" />
                          My Profile
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="p-1 border-t border-white/5 mt-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </div>

            ) : (
              
              /* --- ලොග් වෙලා නැතිනම් පේන බට්න් දෙක --- */
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Link to="/signin" className="text-gray-300 hover:text-cyan-400 text-sm font-semibold transition-colors duration-300">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </div>

            )}
          </div>

        </div>
      </nav>
      
    </div>
  );
}

export default Navbar;