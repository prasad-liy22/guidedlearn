import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ArrowLeft, Clock, Calendar, Loader2, Sparkles } from 'lucide-react';
import BlogCard from '../components/BlogCard'; 

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        } else {
          setBlog(null);
        }

        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('createdAt', 'desc'), limit(5)); 
        const querySnapshot = await getDocs(q);
        
        const fetchedBlogs = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== id) {
            fetchedBlogs.push({ id: doc.id, ...doc.data() });
          }
        });
        
        setRecentBlogs(fetchedBlogs.slice(0, 4));

      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  }, [id]); 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex justify-center items-center">
        <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center text-white px-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Blog not found!</h2>
        <button onClick={() => navigate('/blogs')} className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 rounded-xl transition-colors">
          <ArrowLeft size={16} /> Go back to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 text-white overflow-x-hidden">
      
      {/* 📖 Main Article Section (Center Aligned) */}
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/blogs')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 sm:mb-10 transition-colors font-bold text-xs sm:text-sm active:scale-95 w-fit"
        >
          <ArrowLeft size={16} /> Back to Articles
        </button>

        <div className="mb-8 sm:mb-10">
          <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-md sm:rounded-full border border-purple-500/20 mb-4 sm:mb-6">
            {blog.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl md:leading-tight font-black mb-4 sm:mb-6 tracking-tight leading-snug">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-400 text-xs sm:text-sm font-medium border-y border-slate-800/60 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-sm">
                {blog.author ? blog.author.charAt(0).toUpperCase() : 'C'}
              </div>
              <span className="text-slate-200">{blog.author || 'Creator'}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Calendar size={14} className="sm:w-4 sm:h-4" />
              <span>{blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : "Just Now"}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock size={14} className="sm:w-4 sm:h-4" />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>

        {blog.coverImage && (
          <div className="w-full h-56 sm:h-[400px] md:h-[500px] rounded-2xl sm:rounded-[2.5rem] overflow-hidden mb-8 sm:mb-12 border border-slate-800 shadow-xl sm:shadow-2xl">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div 
          className="text-slate-300 text-base sm:text-lg leading-relaxed 
                       [&>h2]:text-2xl sm:[&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-10 sm:[&>h2]:mt-12 [&>h2]:mb-4 sm:[&>h2]:mb-6 [&>h2]:tracking-tight [&>h2]:leading-snug
                       [&>h3]:text-xl sm:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-8 sm:[&>h3]:mt-10 [&>h3]:mb-3 sm:[&>h3]:mb-4 [&>h3]:leading-snug
                       [&>p]:mb-5 sm:[&>p]:mb-6
                       [&>ul]:list-disc [&>ul]:pl-5 sm:[&>ul]:pl-6 [&>ul]:mb-5 sm:[&>ul]:mb-6 [&>ul>li]:mb-1.5 sm:[&>ul>li]:mb-2
                       [&>ol]:list-decimal [&>ol]:pl-5 sm:[&>ol]:pl-6 [&>ol]:mb-5 sm:[&>ol]:mb-6 [&>ol>li]:mb-1.5 sm:[&>ol>li]:mb-2
                       [&>hr]:border-slate-800/50 [&>hr]:my-8 sm:[&>hr]:my-12
                       [&>strong]:text-white [&>em]:text-slate-400
                       [&>img]:rounded-xl sm:[&>img]:rounded-2xl [&>img]:my-6 sm:[&>img]:my-8 [&>img]:border [&>img]:border-slate-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* 🚀 Read Next Section */}
      {recentBlogs.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-slate-800/60">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-8 sm:mb-10">
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 shadow-inner">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Read Next</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {recentBlogs.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}