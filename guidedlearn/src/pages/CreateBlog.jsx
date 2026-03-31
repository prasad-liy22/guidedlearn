import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Save, ArrowLeft, Loader2, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateBlog() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [formData, setFormData] = useState({
    title: '', excerpt: '', category: 'Productivity', coverImage: '', content: '', readTime: '5 min read'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(id ? true : false); 

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'blogs', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData(data);
            if (data.coverImage) setImagePreview(data.coverImage); 
          }
        } catch (error) {
          toast.error("Failed to load blog data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return toast.error("Title and Content are required!");
    if (!imageFile && !formData.coverImage) return toast.error("Please upload a cover image!");
    
    setIsSaving(true);
    const toastId = toast.loading(id ? "Updating your blog..." : "Publishing your blog...");

    try {
      let uploadedImageUrl = formData.coverImage;

      if (imageFile) {
        toast.loading("Uploading cover image...", { id: toastId });
        const storageRef = ref(storage, `blog_covers/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(snapshot.ref); 
      }

      const finalData = {
        ...formData,
        coverImage: uploadedImageUrl, 
      };

      if (id) {
        await updateDoc(doc(db, 'blogs', id), {
          ...finalData,
          updatedAt: serverTimestamp() 
        });
        toast.success("Blog Updated Successfully! ✨", { id: toastId });
      } else {
        await addDoc(collection(db, 'blogs'), {
          ...finalData,
          createdAt: serverTimestamp(),
          featured: false,
          authorId: user.uid, 
          author: userData?.fullName || "Creator" 
        });
        toast.success("Blog Published Successfully! ✨", { id: toastId });
      }
      navigate('/blog-editor'); 
    } catch (e) { 
      toast.error("Operation Failed! " + e.message, { id: toastId }); 
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#020617] flex justify-center items-center"><Loader2 className="animate-spin text-purple-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#020617] pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/blog-editor')} className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 sm:mb-8 transition-colors font-bold text-xs sm:text-sm active:scale-95 w-fit">
          <ArrowLeft size={16} /> Back to Studio
        </button>
        
        <form onSubmit={handlePublish} className="space-y-4 sm:space-y-6">
          <input 
            type="text" placeholder="Your Blog Title..."
            value={formData.title}
            className="w-full bg-transparent text-3xl sm:text-4xl md:text-5xl font-black text-white border-none outline-none placeholder-slate-800 leading-tight"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          
          <input 
            type="text" placeholder="Short Excerpt (Shows on the card)..."
            value={formData.excerpt}
            className="w-full bg-slate-900/50 border border-slate-800 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-base sm:text-sm outline-none focus:border-purple-500/50 text-white transition-colors"
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="relative bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-xl sm:rounded-2xl h-[100px] sm:h-[120px] transition-all overflow-hidden group cursor-pointer active:scale-[0.98]">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 group-hover:text-purple-400 transition-colors">
                  <ImagePlus className="w-6 h-6 sm:w-7 sm:h-7 mb-2" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Upload Cover</span>
                </div>
              )}
            </div>

            <select 
              value={formData.category}
              className="bg-slate-900/50 border border-slate-800 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-sm text-slate-400 outline-none focus:border-purple-500/50 h-[100px] sm:h-[120px] transition-colors"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Productivity</option>
              <option>Technology</option>
              <option>Learning Science</option>
              <option>Lifestyle</option>
            </select>
          </div>

          <textarea 
            placeholder="Write your content here... (HTML tags allowed)"
            value={formData.content}
            className="w-full h-80 sm:h-96 bg-slate-900/30 border border-slate-800 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] text-base sm:text-sm text-slate-300 font-medium outline-none focus:border-purple-500/50 custom-scrollbar transition-colors"
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          />

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full py-3.5 sm:py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save size={20} className="sm:w-[22px] sm:h-[22px]" /> {id ? "Update Article" : "Publish Article"}</>}
          </button>
        </form>
      </div>
    </div>
  );
}