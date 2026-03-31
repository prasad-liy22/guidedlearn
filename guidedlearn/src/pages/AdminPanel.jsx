import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Database, Plus, Trash2, Save, RefreshCw, Tag, Link as LinkIcon, Award, Layers, X, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyTemplate = {
  title: "",
  levels: {
    beginner: { title: "Level 1: Beginner", description: "", topics: [], certs: [], resources: [] },
    intermediate: { title: "Level 2: Intermediate", description: "", topics: [], certs: [], resources: [] },
    advanced: { title: "Level 3: Advanced", description: "", topics: [], certs: [], resources: [] }
  }
};

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeItem, setActiveItem] = useState(null); 
  const [isNew, setIsNew] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState({ beginner: '', intermediate: '', advanced: '' });

  // 💡 Mobile Toggle State
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard');
  }, [user, navigate]);

  const fetchRoadmaps = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'popular_topics'));
      const fetchedData = [];
      querySnapshot.forEach((doc) => fetchedData.push({ id: doc.id, ...doc.data() }));
      setRoadmaps(fetchedData);
    } catch (error) {
      toast.error("Failed to load roadmaps!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchRoadmaps();
  }, [user]);

  const handleSelect = (item) => {
    const parsedItem = JSON.parse(JSON.stringify(item));
    
    if (!parsedItem.levels) {
      parsedItem.levels = JSON.parse(JSON.stringify(emptyTemplate.levels));
    } else {
      ['beginner', 'intermediate', 'advanced'].forEach(key => {
        if (!parsedItem.levels[key]) {
          parsedItem.levels[key] = JSON.parse(JSON.stringify(emptyTemplate.levels[key]));
        }
        if (!parsedItem.levels[key].topics) parsedItem.levels[key].topics = [];
        if (!parsedItem.levels[key].certs) parsedItem.levels[key].certs = [];
        if (!parsedItem.levels[key].resources) parsedItem.levels[key].resources = [];
      });
    }

    setActiveItem(parsedItem);
    setIsNew(false);
    setShowMobileSidebar(false);
  };

  const handleAddNew = () => {
    setActiveItem(JSON.parse(JSON.stringify(emptyTemplate)));
    setIsNew(true);
    setShowMobileSidebar(false);
  };

  const handleSave = async () => {
    if (!activeItem.title.trim()) return toast.error("Roadmap Title is required!");
    const toastId = toast.loading("Saving Roadmap...");
    
    try {
      if (isNew) {
        await addDoc(collection(db, 'popular_topics'), { title: activeItem.title, levels: activeItem.levels });
        toast.success("New roadmap created!", { id: toastId });
      } else {
        await updateDoc(doc(db, 'popular_topics', activeItem.id), { title: activeItem.title, levels: activeItem.levels });
        toast.success("Roadmap updated!", { id: toastId });
      }
      setActiveItem(null);
      fetchRoadmaps();
      setShowMobileSidebar(true);
    } catch (error) {
      toast.error("Failed to save!", { id: toastId });
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'popular_topics', id));
        toast.success("Deleted successfully!");
        if (activeItem?.id === id) {
          setActiveItem(null);
          setShowMobileSidebar(true);
        }
        fetchRoadmaps();
      } catch (error) {
        toast.error("Failed to delete!");
      }
    }
  };

  const updateLevel = (levelKey, field, value) => {
    setActiveItem(prev => ({
      ...prev,
      levels: { ...prev.levels, [levelKey]: { ...prev.levels[levelKey], [field]: value } }
    }));
  };

  const addTopic = (levelKey) => {
    const topic = newTopicInput[levelKey].trim();
    if (!topic) return;
    setActiveItem(prev => ({
      ...prev,
      levels: { ...prev.levels, [levelKey]: { ...prev.levels[levelKey], topics: [...prev.levels[levelKey].topics, topic] } }
    }));
    setNewTopicInput(prev => ({ ...prev, [levelKey]: '' }));
  };

  const removeTopic = (levelKey, index) => {
    setActiveItem(prev => ({
      ...prev,
      levels: { ...prev.levels, [levelKey]: { ...prev.levels[levelKey], topics: prev.levels[levelKey].topics.filter((_, i) => i !== index) } }
    }));
  };

  const addLinkItem = (levelKey, type) => {
    setActiveItem(prev => ({
      ...prev,
      levels: { ...prev.levels, [levelKey]: { ...prev.levels[levelKey], [type]: [...(prev.levels[levelKey][type] || []), { name: '', link: '' }] } }
    }));
  };

  const updateLinkItem = (levelKey, type, index, field, value) => {
    setActiveItem(prev => {
      const newItems = [...prev.levels[levelKey][type]];
      newItems[index][field] = value;
      return { ...prev, levels: { ...prev.levels, [levelKey]: { ...prev.levels[levelKey], [type]: newItems } } };
    });
  };

  const removeLinkItem = (levelKey, type, index) => {
    setActiveItem(prev => ({
      ...prev,
      levels: { ...prev.levels, [levelKey]: { ...prev.levels[levelKey], [type]: prev.levels[levelKey][type].filter((_, i) => i !== index) } }
    }));
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans h-[calc(100vh-80px)] flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 shrink-0 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 sm:gap-3">
            <Database className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500" />
            Visual Builder
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">Construct and manage learning paths.</p>
        </div>
        {showMobileSidebar && (
          <button 
            onClick={handleAddNew}
            className="bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 transition-all w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" /> Create New
          </button>
        )}
      </div>

      <div className="flex gap-6 flex-1 min-h-0 relative">
        
        {/* --- Left Sidebar: List --- */}
        <div className={`w-full lg:w-80 flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shrink-0 overflow-hidden transition-all ${showMobileSidebar ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="font-bold text-white text-lg">Roadmaps</h2>
            <button onClick={fetchRoadmaps} className="text-slate-400 hover:text-cyan-400"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {roadmaps.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleSelect(item)}
                className={`p-4 rounded-xl cursor-pointer border transition-all group flex justify-between items-center active:scale-[0.98] ${activeItem?.id === item.id ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-500'}`}
              >
                <div className="truncate pr-2">
                  <p className={`font-bold text-sm sm:text-base truncate ${activeItem?.id === item.id ? 'text-cyan-400' : 'text-slate-200'}`}>{item.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{Object.keys(item.levels || {}).length} Levels</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.title); }} 
                  className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-slate-400 hover:text-red-400 bg-slate-700/50 lg:bg-transparent p-2 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- Right Canvas: Visual Editor --- */}
        <div className={`flex-1 bg-slate-900/30 border border-slate-700/50 rounded-2xl flex flex-col min-w-0 overflow-hidden relative ${!showMobileSidebar ? 'flex' : 'hidden lg:flex'}`}>
          
          {!activeItem ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
              <Layers className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a roadmap from the left or create a new one.</p>
            </div>
          ) : (
            <>
              {/* Canvas Header (Sticky) */}
              <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 z-10 gap-4">
                
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                  <button 
                    onClick={() => setShowMobileSidebar(true)} 
                    className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    value={activeItem.title}
                    onChange={(e) => setActiveItem({...activeItem, title: e.target.value})}
                    placeholder="Roadmap Title..."
                    className="bg-transparent text-xl sm:text-2xl md:text-3xl font-black text-white placeholder-slate-600 focus:outline-none w-full"
                  />
                </div>

                <button 
                  onClick={handleSave}
                  className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shrink-0 transition-colors active:scale-95"
                >
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>

              {/* Canvas Body (Scrollable Levels) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar pb-20">
                
                {['beginner', 'intermediate', 'advanced'].map((levelKey) => {
                  const level = activeItem.levels?.[levelKey];
                  if(!level) return null;
                  
                  const colors = { beginner: 'border-green-500/30', intermediate: 'border-yellow-500/30', advanced: 'border-red-500/30' };
                  const textColors = { beginner: 'text-green-400', intermediate: 'text-yellow-400', advanced: 'text-red-400' };

                  return (
                    <div key={levelKey} className={`bg-slate-800/40 border ${colors[levelKey]} rounded-xl sm:rounded-2xl p-4 sm:p-6 relative`}>
                      
                      {/* Level Title & Desc */}
                      <div className="mb-6">
                        <input 
                          type="text" value={level.title} onChange={(e) => updateLevel(levelKey, 'title', e.target.value)}
                          className={`bg-transparent text-lg sm:text-xl font-bold ${textColors[levelKey]} focus:outline-none focus:border-b border-slate-600 w-full mb-2`}
                        />
                        <textarea 
                          value={level.description} onChange={(e) => updateLevel(levelKey, 'description', e.target.value)}
                          placeholder="Describe this level..." rows="2"
                          className="bg-transparent text-slate-400 text-xs sm:text-sm w-full focus:outline-none resize-none border border-transparent focus:border-slate-700 rounded-lg p-2 -ml-2 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        
                        {/* Topics (Tags Builder) */}
                        <div>
                          <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-3"><Tag className="w-4 h-4 text-cyan-400"/> Topics</h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {level.topics?.map((topic, i) => (
                              <div key={i} className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 group">
                                {topic}
                                <button onClick={() => removeTopic(levelKey, i)} className="text-slate-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" value={newTopicInput[levelKey]} 
                              onChange={(e) => setNewTopicInput(prev => ({...prev, [levelKey]: e.target.value}))}
                              onKeyDown={(e) => e.key === 'Enter' && addTopic(levelKey)}
                              placeholder="Add topic..." 
                              className="bg-slate-900/50 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 flex-1"
                            />
                            <button onClick={() => addTopic(levelKey)} className="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg"><Plus className="w-5 h-5"/></button>
                          </div>
                        </div>

                        {/* Resources & Certs Builder */}
                        <div className="space-y-6">
                          
                          {/* Certifications */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-white text-sm font-bold flex items-center gap-2"><Award className="w-4 h-4 text-yellow-400"/> Certifications</h4>
                              <button onClick={() => addLinkItem(levelKey, 'certs')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-1 rounded-md"><Plus className="w-3 h-3"/> Add</button>
                            </div>
                            <div className="space-y-3">
                              {level.certs?.map((cert, i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-slate-900/30 p-2 sm:p-0 rounded-lg border border-slate-800 sm:border-none">
                                  <input type="text" value={cert.name} onChange={(e) => updateLinkItem(levelKey, 'certs', i, 'name', e.target.value)} placeholder="Cert Name" className="bg-slate-900/50 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 w-full sm:flex-1 focus:border-yellow-500 outline-none" />
                                  <div className="flex gap-2 w-full sm:w-auto sm:flex-1">
                                    <input type="text" value={cert.link} onChange={(e) => updateLinkItem(levelKey, 'certs', i, 'link', e.target.value)} placeholder="URL" className="bg-slate-900/50 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 w-full focus:border-yellow-500 outline-none" />
                                    <button onClick={() => removeLinkItem(levelKey, 'certs', i)} className="text-slate-400 hover:text-red-400 bg-slate-800 p-2 rounded-lg shrink-0"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Free Resources */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-white text-sm font-bold flex items-center gap-2"><LinkIcon className="w-4 h-4 text-blue-400"/> Free Resources</h4>
                              <button onClick={() => addLinkItem(levelKey, 'resources')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-1 rounded-md"><Plus className="w-3 h-3"/> Add</button>
                            </div>
                            <div className="space-y-3">
                              {level.resources?.map((res, i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-slate-900/30 p-2 sm:p-0 rounded-lg border border-slate-800 sm:border-none">
                                  <input type="text" value={res.name} onChange={(e) => updateLinkItem(levelKey, 'resources', i, 'name', e.target.value)} placeholder="Resource Name" className="bg-slate-900/50 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 w-full sm:flex-1 focus:border-blue-500 outline-none" />
                                  <div className="flex gap-2 w-full sm:w-auto sm:flex-1">
                                    <input type="text" value={res.link} onChange={(e) => updateLinkItem(levelKey, 'resources', i, 'link', e.target.value)} placeholder="URL" className="bg-slate-900/50 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 w-full focus:border-blue-500 outline-none" />
                                    <button onClick={() => removeLinkItem(levelKey, 'resources', i)} className="text-slate-400 hover:text-red-400 bg-slate-800 p-2 rounded-lg shrink-0"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* 💡 Mobile Save Button (Bottom) */}
                <div className="sm:hidden pt-4 pb-8">
                   <button 
                     onClick={handleSave}
                     className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95"
                   >
                     <Save className="w-5 h-5" /> Save Changes
                   </button>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}