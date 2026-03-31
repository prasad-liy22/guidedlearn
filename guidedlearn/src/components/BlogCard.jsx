import { Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BlogCard({ blog }) {
  const navigate = useNavigate();
  return (
    <div
    onClick={() => navigate(`/blog/${blog.id}`)} 
    className="group flex flex-col bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden hover:bg-slate-900/50 hover:border-purple-500/30 transition-all duration-300 shadow-xl">
      <div className="h-48 overflow-hidden">
        <img 
          src={blog.coverImage} 
          alt={blog.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest px-2 py-1 bg-purple-500/10 rounded-md border border-purple-500/20">
            {blog.category}
          </span>
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
            <Clock size={12} /> {blog.readTime}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-purple-400 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-slate-500 text-xs font-medium mb-6 line-clamp-2 leading-relaxed">
          {blog.excerpt}
        </p>
        <div className="mt-auto pt-5 border-t border-slate-800/50 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
            {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : "Just Now"}
          </p>
          <button className="p-2 rounded-xl bg-slate-800 text-white hover:bg-purple-600 transition-all hover:scale-110">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}