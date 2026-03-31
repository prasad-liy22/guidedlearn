import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ArrowLeft, Clock, Calendar, Loader2, Sparkles } from 'lucide-react';
import BlogCard from '../components/BlogCard'; // 💡 අපේ Card එක Import කරගත්තා

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]); // 💡 යටින් පෙන්නන බ්ලොග් ටික
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      try {
        // 1. දැනට Click කරපු බ්ලොග් එක ගන්නවා
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        } else {
          setBlog(null);
        }

        // 2. යටින් පෙන්නන්න අලුත්ම බ්ලොග් ටික ගන්නවා
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('createdAt', 'desc'), limit(5)); // 5ක් ගන්නවා
        const querySnapshot = await getDocs(q);
        
        const fetchedBlogs = [];
        querySnapshot.forEach((doc) => {
          // දැන් කියවන එක හැර අනිත් ඒවා ගන්නවා
          if (doc.id !== id) {
            fetchedBlogs.push({ id: doc.id, ...doc.data() });
          }
        });
        
        // හරියටම 4ක් විතරක් තියාගන්නවා
        setRecentBlogs(fetchedBlogs.slice(0, 4));

      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
    
    // 💡 අලුත් බ්ලොග් එකකට ගියාම ඉබේම උඩටම Scroll වෙනවා
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  }, [id]); // ID එක වෙනස් වෙන හැම වෙලාවෙම මේක ආයෙත් වැඩ කරනවා

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex justify-center items-center">
        <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold mb-4">Blog not found!</h2>
        <button onClick={() => navigate('/blogs')} className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
          <ArrowLeft size={16} /> Go back to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6 text-white overflow-x-hidden">
      
      {/* 📖 Main Article Section (Center Aligned) */}
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/blogs')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} /> Back to Articles
        </button>

        <div className="mb-10">
          <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-500/20 mb-6">
            {blog.category}
          </span>
          <h1 className="text-4xl md:text-5xl md:leading-tight font-black mb-6 tracking-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-medium border-y border-slate-800/60 py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                {blog.author ? blog.author.charAt(0).toUpperCase() : 'C'}
              </div>
              <span className="text-white">{blog.author || 'Creator'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : "Just Now"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>

        {blog.coverImage && (
          <div className="w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-12 border border-slate-800 shadow-2xl">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div 
          className="text-slate-300 text-lg leading-relaxed 
                     [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:tracking-tight
                     [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-10 [&>h3]:mb-4
                     [&>p]:mb-6
                     [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
                     [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
                     [&>hr]:border-slate-800/50 [&>hr]:my-12
                     [&>strong]:text-white [&>em]:text-slate-400"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* 🚀 Read Next Section (Wider Grid) */}
      {recentBlogs.length > 0 && (
        <div className="max-w-6xl mx-auto mt-24 pt-16 border-t border-slate-800/60">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Read Next</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBlogs.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}