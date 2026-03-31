import { Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BlogCard({ blog }) {
  const navigate = useNavigate();
  
  return (
    <div
      onClick={() => navigate(`/blog/${blog.id}`)} 
      className="group flex flex-col bg-slate-900/30 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden hover:bg-slate-900/50 hover:border-purple-500/30 transition-all duration-300 shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/blog/${blog.id}`) }}
    >
      <div className="h-40 sm:h-48 overflow-hidden shrink-0">
        <img 
          src={blog.coverImage} 
          alt={blog.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-[10px] sm:text-xs font-black uppercase text-purple-400 tracking-widest px-2 sm:px-2.5 py-1 bg-purple-500/10 rounded-md border border-purple-500/20">
            {blog.category}
          </span>
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] sm:text-xs font-bold">
            <Clock size={12} className="sm:w-3.5 sm:h-3.5" /> 
            {blog.readTime}
          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 leading-snug group-hover:text-purple-400 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        
        <p className="text-slate-400 sm:text-slate-500 text-xs sm:text-sm font-medium mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>
        
        <div className="mt-auto pt-4 sm:pt-5 border-t border-slate-800/50 flex items-center justify-between">
          <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-tighter sm:tracking-normal">
            {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : "Just Now"}
          </p>
          
          <button 
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 text-white group-hover:bg-purple-600 transition-all group-hover:scale-110"
            aria-label="Read Post"
          >
            <ChevronRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}