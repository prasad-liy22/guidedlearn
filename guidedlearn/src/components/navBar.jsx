import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

function Navbar() {
  const { user, logout, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isLearningBench = location.pathname.includes('/pathway/');

  return (
    <div
      className={`w-full z-50 transition-all duration-300 ${isLearningBench ? 'absolute top-0 left-0 right-0' : 'fixed top-0'
        } ${isScrolled && !isLearningBench
          ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3 px-4 sm:px-6 lg:px-8'
          : 'bg-transparent pt-6 px-4 sm:px-6 lg:px-8'
        }`}
    >

      <nav
        className={`max-w-6xl mx-auto transition-all duration-300 ${isScrolled && !isLearningBench
            ? 'px-2 md:px-6 py-1'
            : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(6,182,212,0.15)] rounded-2xl px-5 sm:px-6 py-3'
          }`}
      >
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition-transform duration-300 drop-shadow-sm">
              G-Learn
            </Link>
          </div>

          {/* Main Links (Desktop Only) */}
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

          {/* Auth Section, Dashboard & Mobile Toggle */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <div className="flex items-center gap-3 md:gap-6">

                {/* Dashboard Button (Desktop Only) */}
                <Link
                  to="/dashboard"
                  className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-colors bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <div className="hidden md:block w-px h-6 bg-slate-700/50"></div>

                {/* Dropdown Menu Section (Profile Picture) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center focus:outline-none group"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-cyan-500/30 p-0.5 group-hover:border-cyan-400 transition-all duration-300 relative shadow-[0_0_15px_rgba(6,182,212,0.2)]">

                      {/* 💡 මෙතන user වෙනුවට userData?.profilePic පාවිච්චි කරන්න */}
                      {userData?.profilePic ? (
                        <img
                          src={userData.profilePic}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        /* පින්තූරයක් නැති වෙලාවට නමේ මුල් අකුර පෙන්වනවා */
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}

                      {/* Online Status Indicator */}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                    </div>
                  </button>

                  {/* Profile Dropdown Card */}
                  {isOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
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

              /* Sign In / Sign Up Buttons */
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/signin" className="text-gray-300 hover:text-cyan-400 text-xs sm:text-sm font-semibold transition-colors duration-300">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </div>

            )}

            {/* 💡 Hamburger Mobile Menu Toggle Button */}
            <button
              className="md:hidden p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* 💡 Mobile Menu Dropdown (Visible only on small screens) */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-700/50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl text-sm font-bold transition-all">Home</Link>
              <Link to="/blogs" className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl text-sm font-bold transition-all">Blogs</Link>
              <Link to="/tools" className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl text-sm font-bold transition-all">Tools</Link>
              <Link to="/roadmap" className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl text-sm font-bold transition-all">Roadmap</Link>
              {user && (
                <div className="pt-2 mt-2 border-t border-slate-700/50">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </nav>

    </div>
  );
}

export default Navbar;