import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Sparkles, Search, Loader2, BookOpen, Rocket } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { userData } = useAuth();
  const navigate = useNavigate();

  const userRole = userData?.role || 'student';

  useEffect(() => {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(docs);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching blogs:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const featuredBlog = blogs.find(b => b.featured) || blogs[0];
  const otherBlogs = blogs.filter(b => b.id !== featuredBlog?.id);

  const filteredBlogs = otherBlogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-purple-500 gap-4">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Loading Hub...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase mb-4 tracking-widest shadow-sm">
              <Sparkles size={12} /> Knowledge Hub
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3 sm:mb-4 tracking-tight leading-tight">The <span className="text-purple-500">Learning</span> Journal</h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium">Expert insights curated for the next generation of students.</p>
          </div>

          <div className="relative w-full md:w-72 mt-2 md:mt-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 sm:py-3 pl-12 pr-4 text-base sm:text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        {/* 🌟 Featured Post Section */}
        {!searchQuery && featuredBlog && (
          <div 
          onClick={() => navigate(`/blog/${featuredBlog.id}`)}
          className="relative group bg-slate-900/40 border border-slate-800 rounded-3xl lg:rounded-[2.5rem] overflow-hidden mb-12 sm:mb-16 hover:border-purple-500/40 transition-all duration-500 cursor-pointer shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-56 sm:h-72 lg:h-auto overflow-hidden">
                <img src={featuredBlog.coverImage} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <span className="w-fit px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-yellow-500/20 mb-4 sm:mb-6">Featured Today</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 leading-tight group-hover:text-purple-400 transition-colors">{featuredBlog.title}</h2>
                <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">{featuredBlog.excerpt}</p>
                <div className="flex items-center gap-3 sm:gap-4 mt-auto lg:mt-0">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-purple-400 shrink-0"><BookOpen size={18} /></div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold truncate">{featuredBlog.author}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{featuredBlog.readTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📋 Other Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          <div className="relative group overflow-hidden bg-gradient-to-br from-purple-900/40 to-slate-900/40 border-2 border-dashed border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all hover:border-purple-500/60 min-h-[300px] sm:min-h-[350px]">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-5 sm:mb-6 border border-purple-500/20">
              <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400 animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mb-2">Share your knowledge</h3>
            <p className="text-slate-400 text-xs mb-6 sm:mb-8 leading-relaxed">
              Register as a creator to post your own blogs and help others grow.
            </p>

            {userRole === 'creator' || userRole === 'admin' ? (
              <button
                onClick={() => navigate('/blog-editor')}
                className="w-full py-3.5 sm:py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-95"
              >
                Open Blog Editor
              </button>
            ) : (
              <button
                onClick={() => navigate('/creator-registration')}
                className="w-full py-3.5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm rounded-xl transition-all border border-slate-700 active:scale-95"
              >
                Register as Creator
              </button>
            )}
          </div>

          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}

        </div>

      </div>
    </div>
  );
}