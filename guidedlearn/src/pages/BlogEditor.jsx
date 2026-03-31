import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, ArrowLeft, Loader2, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where("authorId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setMyBlogs(docs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      await deleteDoc(doc(db, 'blogs', id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete blog.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-12">
          
          <div className="w-full sm:w-auto">
            <button onClick={() => navigate('/blogs')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 sm:mb-6 transition-colors font-bold text-xs sm:text-sm active:scale-95 w-fit">
              <ArrowLeft size={16} /> Back to Hub
            </button>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-purple-500/10 rounded-xl sm:rounded-2xl border border-purple-500/20 shadow-inner">
                <LayoutDashboard className="text-purple-400 w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">Creator Studio</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Manage your published articles</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/create-blog')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-6 py-3.5 sm:py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95 text-sm sm:text-base shrink-0"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" /> Write New Blog
          </button>
        </div>

        {/* Blogs List */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-purple-500 animate-spin" /></div>
        ) : myBlogs.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl sm:rounded-3xl p-10 sm:p-16 text-center shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2">No blogs found</h3>
            <p className="text-slate-500 mb-6 text-sm sm:text-base">You haven't published any articles yet.</p>
            <button onClick={() => navigate('/create-blog')} className="text-purple-400 font-bold hover:text-purple-300 transition-colors active:scale-95 text-sm sm:text-base">Start writing now &rarr;</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {myBlogs.map(blog => (
              <div key={blog.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-colors shadow-lg flex flex-col h-full">
                <img src={blog.coverImage} alt={blog.title} className="w-full h-32 sm:h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <span className="text-[10px] uppercase text-purple-400 font-bold tracking-wider px-2 py-1 bg-purple-500/10 rounded border border-purple-500/20 w-fit">{blog.category}</span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-3 mb-4 line-clamp-2 leading-snug group-hover:text-purple-400 transition-colors">{blog.title}</h3>
                  
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-auto">
                    <span className="text-xs text-slate-500 font-bold">{blog.readTime}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/edit-blog/${blog.id}`)} 
                        className="p-2 sm:p-2.5 bg-slate-800/80 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-colors active:scale-95"
                        title="Edit Blog"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 sm:p-2.5 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors active:scale-95"
                        title="Delete Blog"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}