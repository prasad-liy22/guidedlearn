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

  // 1. තමන්ගේ Blogs විතරක් Load කරනවා
  useEffect(() => {
    if (!user) return;
    
    const blogsRef = collection(db, 'blogs');
    // 💡 authorId එක user.uid එකට සමාන ඒවා විතරයි ගන්නේ
    const q = query(blogsRef, where("authorId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // කාලය අනුව පෙළගස්වනවා
      docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setMyBlogs(docs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Delete කිරීමේ Function එක
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
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button onClick={() => navigate('/blogs')} className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-colors font-bold text-sm">
              <ArrowLeft size={16} /> Back to Hub
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                <LayoutDashboard className="text-purple-400 w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Creator Studio</h1>
                <p className="text-slate-400 text-sm">Manage your published articles</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/create-blog')}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20"
          >
            <Plus size={20} /> Write New Blog
          </button>
        </div>

        {/* Blogs List */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-purple-500 animate-spin" /></div>
        ) : myBlogs.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-16 text-center">
            <h3 className="text-xl font-bold text-white mb-2">No blogs found</h3>
            <p className="text-slate-500 mb-6">You haven't published any articles yet.</p>
            <button onClick={() => navigate('/create-blog')} className="text-purple-400 font-bold hover:text-purple-300">Start writing now &rarr;</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBlogs.map(blog => (
              <div key={blog.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden group">
                <img src={blog.coverImage} alt={blog.title} className="w-full h-32 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="p-5">
                  <span className="text-[10px] uppercase text-purple-400 font-bold tracking-wider">{blog.category}</span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-4 line-clamp-2">{blog.title}</h3>
                  
                  <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
                    <span className="text-xs text-slate-500 font-bold">{blog.readTime}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/edit-blog/${blog.id}`)} // 💡 Edit පේජ් එකට යනවා
                        className="p-2 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-colors"
                        title="Edit Blog"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
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