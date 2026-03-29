import { useState, useEffect } from 'react';
// 💡 අලුතින් query සහ where import කරගත්තා Database එකෙන් හරියටම දත්ත හොයන්න
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'; 
import { db } from '../firebase';
import { Search, Sparkles, ArrowRight, BookOpen, ExternalLink, Award, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { serverTimestamp } from 'firebase/firestore';

export default function RoadmapMaker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [popularTopics, setPopularTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null); 
  const [isGenerating, setIsGenerating] = useState(false); 
  

  // 1. Page එක Load වෙද්දී Topics ටික ගන්නවා (Suggestions වලට)
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'popular_topics'));
        const topics = [];
        querySnapshot.forEach((doc) => {
          topics.push(doc.data().title);
        });
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

  // --- 💡 අලුත් Generate Button Logic එක (Real Database Connection) ---
  const handleGenerate = async () => {
    if (!searchTerm.trim()) {
      return toast.error("Please enter a topic!");
    }
    
    setIsGenerating(true);
    setSelectedRoadmap(null);
    const loadingToastId = toast.loading(`Searching database for: ${searchTerm}...`, { style: { background: '#1e293b', color: '#fff' } });
    
    try {
      // 💡 1. User ගහපු එක Database එකට ගැලපෙන්න සම්පූර්ණයෙන්ම Simple (lowercase) කරනවා.
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();

      // 💡 2. අපි දැන් හොයන්නේ 'title' එකෙන් නෙවෙයි, 'searchId' කියන Simple කරපු Field එකෙන්!
      const q = query(collection(db, 'popular_topics'), where('searchId', '==', normalizedSearchTerm));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const roadmapData = querySnapshot.docs[0].data();
        setSelectedRoadmap(roadmapData);
        toast.success("Roadmap loaded instantly from Database!", { id: loadingToastId, icon: '⚡' });
        setIsGenerating(false);
        return; 
      }

      // Database එකේ නැත්නම් AI එකෙන් හදනවා
      toast.loading(`Generating new roadmap for "${searchTerm}"...`, { id: loadingToastId });
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API Key is missing!");

      // 💡 3. Prompt එක වෙනස් කළා! 'officialTitle' කියලා අලුත් කෑල්ලක් ඉල්ලනවා Typo එක හදලා එවන්න.
      const prompt = `
        You are an expert educational roadmap creator. Create a comprehensive learning roadmap for the topic: "${searchTerm}".
        Fix any spelling mistakes or typos in the topic name and provide the correct, professional title.
        You MUST respond strictly with a valid JSON object and nothing else. Do not include markdown tags.
        
        CRITICAL RULES:
        1. EXACT KEYS: Use EXACTLY "beginner", "intermediate", and "advanced".
        2. WORD LIMIT: "description" MUST be strictly LESS THAN 20 words.
        3. TOPICS LIMIT: MAXIMUM 5 topics per level.
        4. MINIMUMS: At LEAST 2 certs and 2 resources per level. Use real, high-quality links.

        Use this EXACT JSON structure:
        {
          "officialTitle": "Corrected and Capitalized Title (e.g., Machine Learning)",
          "levels": {
            "beginner": {
              "title": "Level 1: Beginner",
              "description": "Short description strictly under 20 words.",
              "topics": ["Topic 1", "Topic 2"],
              "certs": [{"name": "Cert", "link": "https://..."}],
              "resources": [{"name": "Resource", "link": "https://..."}]
            },
            "intermediate": {
              "title": "Level 2: Intermediate",
              "description": "...",
              "topics": ["..."],
              "certs": [],
              "resources": []
            },
            "advanced": {
              "title": "Level 3: Advanced",
              "description": "...",
              "topics": ["..."],
              "certs": [],
              "resources": []
            }
          }
        }
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2 }
        })
      });

      const aiData = await response.json();
      if (!response.ok) throw new Error("AI Generation Failed");

      let responseText = aiData.candidates[0].content.parts[0].text;
      responseText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsedRoadmap = JSON.parse(responseText);

      // 💡 4. AI එක හදපු ලස්සන නම (officialTitle) පාවිච්චි කරනවා
      const finalTitle = parsedRoadmap.officialTitle || searchTerm;

      // 💡 5. Database එකට Save කරද්දී, 'searchId' කියලත් අලුතින් Field එකක් දානවා! (ඊළඟ කෙනාට ලේසි වෙන්න)
      await addDoc(collection(db, 'popular_topics'), {
        title: finalTitle,
        searchId: finalTitle.toLowerCase().trim(), // "Machine Learning" -> "machine learning"
        levels: parsedRoadmap.levels
      });

      // UI එකට දෙනවා
      setSelectedRoadmap({ title: finalTitle, levels: parsedRoadmap.levels });
      // Search Bar එකේ නමත් අර නිවැරදි කරපු නමට ඉබේම මාරු කරනවා
      setSearchTerm(finalTitle); 
      
      toast.success("AI Roadmap Generated & Saved!", { id: loadingToastId, icon: '🤖' });

    } catch (error) {
      console.error("Roadmap Generation Error:", error);
      toast.error("Failed to generate roadmap. Please try a different topic.", { id: loadingToastId });
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 🚀 Start Pathway Logic ---
  const handleStartPathway = async () => {
    if (!user) {
      toast.error("Please Sign In to start this pathway!");
      navigate('/signin');
      return;
    }

    const toastId = toast.loading("Adding to your Dashboard...", { style: { background: '#1e293b', color: '#fff' } });
    
    try {
      // 💡 User ගේ Document එක ඇතුළේ 'my_pathways' කියලා collection එකකට Save කරනවා
      const myPathwaysRef = collection(db, 'users', user.uid, 'my_pathways');
      await addDoc(myPathwaysRef, {
        title: selectedRoadmap.title,
        levels: selectedRoadmap.levels,
        progress: 0, // ආරම්භක Progress එක 0%
        enrolledAt: serverTimestamp()
      });

      toast.success("Pathway started successfully!", { id: toastId, icon: '🚀' });
      // තත්පර 1.5කින් Dashboard එකට ඉබේම යවනවා
      setTimeout(() => navigate('/dashboard'), 1500); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to start pathway.", { id: toastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

      {/* Header Section */}
      {!selectedRoadmap && !isGenerating && (
         <div className="text-center mb-12 animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold mb-6">
               <Sparkles className="w-4 h-4" />
               AI-Powered Learning Paths
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
               What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">learn today?</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
               Enter any subject, career goal, or skill. Our AI will generate a step-by-step roadmap tailored just for you.
            </p>
         </div>
      )}

      {/* Search Box Area */}
      <div className={`max-w-3xl mx-auto relative z-20 transition-all duration-500 ${selectedRoadmap || isGenerating ? 'mb-12' : 'mb-12'}`}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="e.g. Become a Machine Learning Engineer..."
            className="w-full pl-14 pr-36 py-5 bg-slate-900/60 backdrop-blur-xl border-2 border-slate-700/50 rounded-2xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          />

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`absolute inset-y-2 right-2 ${isGenerating ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'} text-white font-bold px-6 rounded-xl flex items-center gap-2 transition-all`}
          >
            {isGenerating ? (
               <span className="flex items-center gap-2"> <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> Loading... </span>
            ) : (
               <span className="flex items-center gap-2"> Generate <ArrowRight className="w-5 h-5 hidden sm:block" /></span>
            )}
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {filteredTopics.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in fade-in slide-in-from-top-2">
            {filteredTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleSelectTopic(topic)}
                className="w-full text-left px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-3 transition-colors border-b border-slate-700/50 last:border-0"
              >
                <Search className="w-4 h-4 text-slate-500" />
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isGenerating && (
         <div className="max-w-5xl mx-auto text-center py-10 animate-pulse">
            <h2 className="text-xl font-bold text-slate-400">Our AI is mapping your future...</h2>
            <p className="text-sm text-slate-500 mt-2">Checking our database or calling the AI engine.</p>
         </div>
      )}

      {/* Roadmap Display Area */}
      {selectedRoadmap && (
         <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700/50">
               <h2 className="text-3xl md:text-4xl font-black text-white"> <span className="text-cyan-400">AI</span> Roadmap for: <span className="underline decoration-blue-500">{selectedRoadmap.title}</span></h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
               <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-500/20 via-yellow-500/20 to-red-500/20 -translate-y-1/2 -z-10 rounded-full"></div>
               
               {['beginner', 'intermediate', 'advanced'].map(levelKey => {
                  const level = selectedRoadmap.levels?.[levelKey];
                  if (!level) return null; // Error Handling
                  
                  // Color Mapping Based on Level
                  const iconColor = levelKey === 'beginner' ? 'text-green-400' : levelKey === 'intermediate' ? 'text-yellow-400' : 'text-red-400';

                  return (
                     <div key={levelKey} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col hover:border-cyan-500/30 transition-all hover:-translate-y-1 hover:shadow-cyan-500/5">
                        
                        {/* Header */}
                        <div className={`inline-flex items-center gap-2 font-black text-2xl ${iconColor} mb-3`}>
                           <CheckCircle2 className="w-7 h-7" />
                           {level.title || `Level: ${levelKey}`}
                        </div>
                        <p className="text-slate-400 text-sm mb-6 pb-5 border-b border-slate-700/50">{level.description}</p>
                        
                        {/* Topics */}
                        <div className="flex-grow space-y-3 mb-8">
                           <h4 className="text-slate-200 text-base font-bold flex items-center gap-2"> <FileText className="w-4 h-4 text-cyan-400"/> Key Topics</h4>
                           <ul className="space-y-2.5">
                              {level.topics?.map((topic, i) => (
                                 <li key={i} className="text-slate-300 text-sm flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg"> <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span> {topic}</li>
                              ))}
                           </ul>
                        </div>

                        {/* Resources & Certs */}
                        <div className="space-y-4 pt-5 border-t border-slate-700/50 mt-auto">
                           {level.certs && level.certs.length > 0 && (
                              <div>
                                 <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2"> <Award className="w-4 h-4 text-yellow-400"/> Certifications</h4>
                                 {level.certs.map((cert, i) => (
                                    <a key={i} href={cert.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs flex items-center gap-1.5 hover:text-cyan-300 transition-colors"> <ExternalLink className="w-3 h-3"/> {cert.name}</a>
                                 ))}
                              </div>
                           )}
                           {level.resources && level.resources.length > 0 && (
                              <div>
                                 <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2"> <BookOpen className="w-4 h-4 text-blue-400"/> Free Resources</h4>
                                 {level.resources.map((res, i) => (
                                    <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs flex items-center gap-1.5 hover:text-blue-300 transition-colors"> <ExternalLink className="w-3 h-3"/> {res.name}</a>
                                 ))}
                              </div>
                           )}
                        </div>

                     </div>
                  );
               })}
            </div>

            <div className="mt-12 text-center animate-in slide-in-from-bottom-5 duration-700 delay-300">
               <button 
                  onClick={handleStartPathway}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105 transition-all flex items-center gap-3 mx-auto mouse-pointer"
               >
                  <Sparkles className="w-6 h-6" />
                  Start This Pathway Now
               </button>
               <p className="text-slate-400 text-sm mt-4 font-medium">This will be permanently added to your Dashboard.</p>
            </div>
         </div>
      )}

      {/* Popular Suggestions */}
      {!selectedRoadmap && !isGenerating && (
         <div className="max-w-3xl mx-auto mt-12 animate-in fade-in duration-500 delay-100">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold mb-4 ml-1">
               <BookOpen className="w-4 h-4" />
               Popular Topics
            </div>
            
            {isLoading ? (
               <div className="flex gap-3 flex-wrap animate-pulse">
               {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-10 w-32 bg-slate-800 rounded-xl"></div>)}
               </div>
            ) : (
               <div className="flex flex-wrap gap-3">
               {popularTopics.slice(0, 8).map((topic, index) => (
                  <button
                     key={index}
                     onClick={() => handleSelectTopic(topic)}
                     className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-cyan-400 text-sm font-medium transition-all hover:-translate-y-0.5"
                  >
                     {topic}
                  </button>
               ))}
               </div>
            )}
         </div>
         
      )}

      

    </div>
  );
}