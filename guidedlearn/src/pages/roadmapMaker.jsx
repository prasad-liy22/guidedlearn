import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { httpsCallable } from 'firebase/functions'; 
import { db, functions } from '../firebase';
import { Search, Sparkles, ArrowRight, BookOpen, ExternalLink, Award, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RoadmapMaker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [popularTopics, setPopularTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null); 
  const [isGenerating, setIsGenerating] = useState(false); 

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'popular_topics'));
        const topics = querySnapshot.docs.map(doc => doc.data().title);
        setPopularTopics(topics);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedRoadmap(null); 
    if (value.trim() === '') {
      setFilteredTopics([]);
    } else {
      const filtered = popularTopics.filter(topic =>
        topic.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTopics(filtered);
    }
  };

  const handleSelectTopic = (topic) => {
    setSearchTerm(topic);
    setFilteredTopics([]); 
    setSelectedRoadmap(null); 
  };

  const handleGenerate = async () => {
    if (!searchTerm.trim()) return toast.error("Please enter a topic!");
    
    setIsGenerating(true);
    setSelectedRoadmap(null);
    const loadingToastId = toast.loading(`Checking database...`, { style: { background: '#1e293b', color: '#fff' } });
    
    try {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      const q = query(collection(db, 'popular_topics'), where('searchId', '==', normalizedSearchTerm));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const roadmapData = querySnapshot.docs[0].data();
        setSelectedRoadmap(roadmapData);
        toast.success("Loaded from Database!", { id: loadingToastId, icon: '⚡' });
        setIsGenerating(false);
        return; 
      }

      toast.loading(`AI is generating your roadmap...`, { id: loadingToastId });
      
      const generateRoadmapFn = httpsCallable(functions, 'generateRoadmap');
      const result = await generateRoadmapFn({ searchTerm: searchTerm });
      const parsedRoadmap = result.data;

      const finalTitle = parsedRoadmap.officialTitle || searchTerm;

      await addDoc(collection(db, 'popular_topics'), {
        title: finalTitle,
        searchId: finalTitle.toLowerCase().trim(),
        levels: parsedRoadmap.levels
      });

      setSelectedRoadmap({ title: finalTitle, levels: parsedRoadmap.levels });
      setSearchTerm(finalTitle); 
      toast.success("AI Roadmap Ready!", { id: loadingToastId, icon: '🤖' });

    } catch (error) {
      console.error("Roadmap Generation Error:", error);
      toast.error("Generation failed. Please try again.", { id: loadingToastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartPathway = async () => {
    if (!user) {
      toast.error("Please Sign In to start!");
      navigate('/signin');
      return;
    }
    const toastId = toast.loading("Adding to Dashboard...");
    try {
      const myPathwaysRef = collection(db, 'users', user.uid, 'my_pathways');
      await addDoc(myPathwaysRef, {
        title: selectedRoadmap.title,
        levels: selectedRoadmap.levels,
        progress: 0,
        enrolledAt: serverTimestamp()
      });
      toast.success("Pathway started!", { id: toastId, icon: '🚀' });
      setTimeout(() => navigate('/dashboard'), 1500); 
    } catch (error) {
      toast.error("Failed to start.", { id: toastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12 md:py-20 relative font-sans min-h-screen">
      <div className="absolute top-10 left-1/4 w-60 h-60 sm:w-72 sm:h-72 bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[100px] -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-[100px] sm:blur-[120px] -z-10"></div>
      <div className="h-24 sm:h-32"></div>
      {/* 🌟 1. Header Section */}
      {!selectedRoadmap && !isGenerating && (
         <div className="text-center mb-10 sm:mb-12 animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> AI-Powered Learning Paths
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3 sm:mb-4 leading-tight">
                What do you want to <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">learn today?</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto px-2">
                Enter any subject or skill. Our AI will map out a professional pathway just for you.
            </p>
         </div>
      )}

      {/* 🌟 2. Search Area */}
      <div className={`max-w-3xl mx-auto relative z-20 transition-all duration-500 ${selectedRoadmap || isGenerating ? 'mb-8 sm:mb-12' : 'mb-8'}`}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="e.g. Become a Cyber Security Expert..."
            className="w-full pl-11 sm:pl-14 pr-28 sm:pr-36 py-4 sm:py-5 bg-slate-900/60 backdrop-blur-xl border-2 border-slate-800 focus:border-cyan-500 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg focus:outline-none transition-all shadow-2xl"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="absolute inset-y-1.5 sm:inset-y-2 right-1.5 sm:right-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all active:scale-95 disabled:opacity-50 text-xs sm:text-sm"
          >
            {isGenerating ? "Mapping..." : "Generate"}
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {filteredTopics.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl">
            {filteredTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleSelectTopic(topic)}
                className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center gap-3 border-b border-slate-700/50 last:border-0 text-sm sm:text-base active:bg-slate-700"
              >
                <Search className="w-4 h-4 text-slate-500" /> {topic}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 🌟 3. Popular Suggestions */}
      {!selectedRoadmap && !isGenerating && (
          <div className="max-w-3xl mx-auto mb-10 sm:mb-12 animate-in fade-in duration-500 delay-100">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 ml-1">
                <BookOpen className="w-3 h-3" /> Popular Topics
            </div>
            
            {isLoading ? (
                <div className="flex gap-2.5 sm:gap-3 flex-wrap animate-pulse">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-9 w-20 bg-slate-800/50 rounded-lg sm:rounded-xl"></div>)}
                </div>
            ) : (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {popularTopics.slice(0, 8).map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectTopic(topic)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900/40 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-lg sm:rounded-xl text-slate-400 hover:text-cyan-400 text-xs sm:text-sm font-bold transition-all active:scale-95"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
            )}
          </div>
      )}

      {/* 🌟 4. Loading State */}
      {isGenerating && (
          <div className="max-w-5xl mx-auto text-center py-16 sm:py-20 animate-pulse">
            <div className="flex justify-center mb-6">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-500 animate-bounce" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">AI is mapping your future...</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium tracking-wide">Building modules, resources, and certifications.</p>
          </div>
      )}

      {/* 🌟 5. Roadmap Display Area */}
      {selectedRoadmap && (
         <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white pb-4 sm:pb-6 border-b border-slate-800 leading-tight"> 
               Roadmap: <span className="text-cyan-400">{selectedRoadmap.title}</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
               {['beginner', 'intermediate', 'advanced'].map(levelKey => {
                  const level = selectedRoadmap.levels?.[levelKey];
                  if (!level) return null;
                  const iconColor = levelKey === 'beginner' ? 'text-emerald-400' : levelKey === 'intermediate' ? 'text-amber-400' : 'text-rose-400';

                  return (
                     <div key={levelKey} className="bg-slate-900/40 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col hover:border-slate-700 transition-all shadow-xl group">
                      <div className="h-24 sm:h-32"></div>
                        <div className={`flex items-center gap-2 font-black text-xl sm:text-2xl ${iconColor} mb-3 sm:mb-4`}>
                           <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> {level.title}
                        </div>
                        <p className="text-slate-400 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed font-medium line-clamp-4 sm:line-clamp-none">{level.description}</p>
                        
                        <div className="flex-grow space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                           <h4 className="text-white text-[9px] sm:text-[10px] font-black flex items-center gap-2 uppercase tracking-widest opacity-50"> <FileText className="w-3.5 h-3.5 text-cyan-400"/> Key Topics</h4>
                           <ul className="space-y-2">
                              {level.topics?.map((topic, i) => (
                                 <li key={i} className="text-slate-300 text-xs sm:text-sm bg-slate-800/40 p-3 sm:p-4 rounded-xl border border-slate-700/30 font-bold"> {topic}</li>
                              ))}
                           </ul>
                        </div>

                        <div className="space-y-3 pt-5 sm:pt-6 border-t border-slate-800/50">
                           {level.certs?.map((cert, i) => (
                              <a key={i} href={cert.link} target="_blank" rel="noopener noreferrer" className="text-amber-400 text-[10px] sm:text-xs flex items-center gap-2 hover:underline font-bold"> <Award className="w-4 h-4 shrink-0"/> {cert.name}</a>
                           ))}
                           {level.resources?.map((res, i) => (
                              <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-[10px] sm:text-xs flex items-center gap-2 hover:underline font-bold"> <BookOpen className="w-4 h-4 shrink-0"/> {res.name}</a>
                           ))}
                        </div>
                     </div>
                  );
               })}
            </div>

            <div className="pt-8 sm:pt-12 text-center pb-10">
               <button 
                 onClick={handleStartPathway} 
                 className="w-full sm:w-auto bg-white text-slate-950 font-black px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 text-sm sm:text-base"
               >
                  Start This Pathway Now
               </button>
            </div>
         </div>
      )}
    </div>
  );
}