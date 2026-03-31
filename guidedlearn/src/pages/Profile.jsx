import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Edit3, LogOut, Globe, Link as LinkIcon, MessageSquare, 
  BookOpen, Timer, Award, Check, X, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [blogCount, setBlogCount] = useState(0);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '', bio: '', github: '', linkedin: '', twitter: ''
  });

  // Images State
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  // 1. Data Load කිරීම
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        bio: userData.bio || '',
        github: userData.github || '',
        linkedin: userData.linkedin || '',
        twitter: userData.twitter || ''
      });
      setProfilePreview(userData.profilePic || 'https://via.placeholder.com/150');
      setCoverPreview(userData.coverPic || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200');
    }

    // බ්ලොග් ගාණ හොයනවා (Creator කෙනෙක් නම්)
    const fetchStats = async () => {
      if (user) {
        const q = query(collection(db, 'blogs'), where("authorId", "==", user.uid));
        const snap = await getDocs(q);
        setBlogCount(snap.size);
      }
    };
    fetchStats();
  }, [userData, user]);

  // 2. Image Handlers
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profile') {
        setProfileImage(file);
        setProfilePreview(URL.createObjectURL(file));
      } else {
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
      }
    }
  };

  // 3. Save Function එක
  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving profile...");

    try {
      let newProfileUrl = profilePreview;
      let newCoverUrl = coverPreview;

      // Profile Picture අප්ලෝඩ් කරනවා
      if (profileImage) {
        toast.loading("Uploading profile picture...", { id: toastId });
        const pRef = ref(storage, `profiles/${user.uid}_${Date.now()}`);
        await uploadBytes(pRef, profileImage);
        newProfileUrl = await getDownloadURL(pRef);
      }

      // Cover Picture අප්ලෝඩ් කරනවා
      if (coverImage) {
        toast.loading("Uploading cover photo...", { id: toastId });
        const cRef = ref(storage, `covers/${user.uid}_${Date.now()}`);
        await uploadBytes(cRef, coverImage);
        newCoverUrl = await getDownloadURL(cRef);
      }

      // Firestore Update කරනවා
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        profilePic: newProfileUrl,
        coverPic: newCoverUrl
      });

      toast.success("Profile updated successfully! ✨", { id: toastId });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!userData) return <div className="min-h-screen bg-[#020617] flex justify-center items-center"><Loader2 className="animate-spin text-cyan-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#020617] pb-20 overflow-x-hidden">
      
      {/* --- Cover Photo Section --- */}
      <div className="relative w-full h-64 md:h-80 bg-slate-900 group">
        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover opacity-80" />
        {isEditing && (
          <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-10 h-10 text-white mb-2" />
            <span className="text-white font-bold text-sm">Change Cover</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'cover')} />
          </label>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        
        {/* --- Header & Profile Pic --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-20 md:-mt-24 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            
            {/* Profile Picture */}
            <div className="relative group w-40 h-40 rounded-full border-4 border-[#020617] bg-slate-800 overflow-hidden shadow-2xl">
              <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-white text-xs font-bold">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'profile')} />
                </label>
              )}
            </div>

            {/* Name & Badge */}
            <div className="text-center md:text-left mb-2 md:mb-4">
              {isEditing ? (
                <input 
                  type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="bg-slate-900/80 border border-slate-700 text-3xl font-black text-white px-4 py-2 rounded-xl outline-none focus:border-cyan-500 mb-3 w-full max-w-sm text-center md:text-left"
                />
              ) : (
                <h1 className="text-4xl font-black text-white mb-2">{userData.fullName}</h1>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/20">
                <Award size={14} /> {userData.role || 'Student'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors flex items-center gap-2">
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-cyan-600/20">
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <><Check size={16} /> Save</>}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors flex items-center gap-2">
                  <Edit3 size={16} /> Edit Profile
                </button>
                <button onClick={handleLogout} className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm transition-colors flex items-center gap-2 border border-red-500/20">
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column: Bio & Socials --- */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-black text-white mb-4">About Me</h3>
              {isEditing ? (
                <textarea 
                  value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Write a short bio about yourself..."
                  className="w-full h-32 bg-slate-950/50 border border-slate-700 p-4 rounded-2xl text-slate-300 text-sm outline-none focus:border-cyan-500/50 resize-none"
                />
              ) : (
                <p className="text-slate-400 leading-relaxed text-sm">
                  {userData.bio || "This user prefers to keep an air of mystery about them. No bio has been added yet!"}
                </p>
              )}
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-black text-white mb-6">Social Connections</h3>
              <div className="space-y-4">
                {[
                        { icon: Globe, key: 'github', label: 'GitHub Profile', placeholder: 'https://github.com/username' },
                        { icon: LinkIcon, key: 'linkedin', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/username' },
                        { icon: MessageSquare, key: 'twitter', label: 'Twitter Profile', placeholder: 'https://twitter.com/username' }
                    ].map((social) => (
                  <div key={social.key} className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl"><social.icon className="w-5 h-5 text-slate-400" /></div>
                    {isEditing ? (
                      <input 
                        type="text" value={formData[social.key]} onChange={(e) => setFormData({...formData, [social.key]: e.target.value})}
                        placeholder={social.placeholder}
                        className="flex-1 bg-slate-950/50 border border-slate-700 px-4 py-2.5 rounded-xl text-slate-300 text-sm outline-none focus:border-cyan-500/50"
                      />
                    ) : (
                      <a href={formData[social.key] || '#'} target="_blank" rel="noreferrer" className={`text-sm font-bold ${formData[social.key] ? 'text-cyan-400 hover:underline' : 'text-slate-600 cursor-not-allowed'}`}>
                        {formData[social.key] ? 'View Profile' : 'Not Connected'}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- Right Column: Stats --- */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/20 rounded-3xl p-6 flex items-center gap-6">
              <div className="p-4 bg-purple-500/20 rounded-2xl"><BookOpen className="w-8 h-8 text-purple-400" /></div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Published</p>
                <h4 className="text-3xl font-black text-white">{blogCount} <span className="text-lg text-slate-500 font-medium">Articles</span></h4>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/40 to-slate-900/40 border border-orange-500/20 rounded-3xl p-6 flex items-center gap-6">
              <div className="p-4 bg-orange-500/20 rounded-2xl"><Timer className="w-8 h-8 text-orange-400" /></div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Focus Time</p>
                <h4 className="text-3xl font-black text-white">12 <span className="text-lg text-slate-500 font-medium">Hours</span></h4>
              </div>
            </div>
            
            <p className="text-center text-slate-600 text-xs font-bold uppercase mt-8 tracking-widest">
              Member since {userData.createdAt?.toDate ? userData.createdAt.toDate().getFullYear() : '2026'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}