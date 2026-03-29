import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Database, Plus, Trash2, Save, RefreshCw, Tag, Link as LinkIcon, Award, Layers, X } from 'lucide-react';
import toast from 'react-hot-toast';

// හිස් Roadmap Template එකක්
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
  
  // Visual Editor States
  const [activeItem, setActiveItem] = useState(null); // දැනට Edit කරන එක සම්පූර්ණයෙන්ම මෙතන තියෙනවා
  const [isNew, setIsNew] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState({ beginner: '', intermediate: '', advanced: '' });

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

  // --- Editor Functions ---
  const handleSelect = (item) => {
    // Database එකෙන් එන Data ටික Copy කරගන්නවා
    const parsedItem = JSON.parse(JSON.stringify(item));
    
    // 💡 1. 'levels' කියන කොටසම නැත්නම්, ඒක අලුතින් හදනවා
    if (!parsedItem.levels) {
      parsedItem.levels = JSON.parse(JSON.stringify(emptyTemplate.levels));
    } else {
      // 💡 2. 'levels' තිබ්බට beginner, intermediate, advanced කියන 3නම නැත්නම් ඒකත් හදනවා
      ['beginner', 'intermediate', 'advanced'].forEach(key => {
        if (!parsedItem.levels[key]) {
          parsedItem.levels[key] = JSON.parse(JSON.stringify(emptyTemplate.levels[key]));
        }
        // 💡 3. ඒවයේ ඇතුළේ arrays (topics, certs, resources) නැත්නම් ඒවා හිස් arrays කරනවා (map() crash වෙන එක නවත්තන්න)
        if (!parsedItem.levels[key].topics) parsedItem.levels[key].topics = [];
        if (!parsedItem.levels[key].certs) parsedItem.levels[key].certs = [];
        if (!parsedItem.levels[key].resources) parsedItem.levels[key].resources = [];
      });
    }

    setActiveItem(parsedItem);
    setIsNew(false);
  };

  const handleAddNew = () => {
    setActiveItem(JSON.parse(JSON.stringify(emptyTemplate)));
    setIsNew(true);
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
    } catch (error) {
      toast.error("Failed to save!", { id: toastId });
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'popular_topics', id));
        toast.success("Deleted successfully!");
        if (activeItem?.id === id) setActiveItem(null);
        fetchRoadmaps();
      } catch (error) {
        toast.error("Failed to delete!");
      }
    }
  };

  // --- Deep State Updaters for the Visual Builder ---
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
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans h-[calc(100vh-80px)] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-cyan-500" />
            Visual Roadmap Builder
          </h1>
          <p className="text-slate-400 mt-1">Visually construct and manage learning paths.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" /> Create New
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* --- Left Sidebar: List --- */}
        <div className="w-80 flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shrink-0 overflow-hidden">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="font-bold text-white text-lg">Roadmaps</h2>
            <button onClick={fetchRoadmaps} className="text-slate-400 hover:text-cyan-400"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {roadmaps.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleSelect(item)}
                className={`p-4 rounded-xl cursor-pointer border transition-all group flex justify-between items-center ${activeItem?.id === item.id ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-500'}`}
              >
                <div className="truncate pr-2">
                  <p className={`font-bold truncate ${activeItem?.id === item.id ? 'text-cyan-400' : 'text-slate-200'}`}>{item.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{Object.keys(item.levels || {}).length} Levels</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.title); }} 
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- Right Canvas: Visual Editor --- */}
        <div className="flex-1 bg-slate-900/30 border border-slate-700/50 rounded-2xl flex flex-col min-w-0 overflow-hidden relative">
          
          {!activeItem ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Layers className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a roadmap from the left or create a new one.</p>
            </div>
          ) : (
            <>
              {/* Canvas Header (Sticky) */}
              <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 p-6 flex items-center justify-between shrink-0 z-10">
                <input 
                  type="text" 
                  value={activeItem.title}
                  onChange={(e) => setActiveItem({...activeItem, title: e.target.value})}
                  placeholder="e.g. Full Stack Web Development"
                  className="bg-transparent text-3xl font-black text-white placeholder-slate-600 focus:outline-none w-full mr-4"
                />
                <button 
                  onClick={handleSave}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shrink-0 transition-colors"
                >
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>

              {/* Canvas Body (Scrollable Levels) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {['beginner', 'intermediate', 'advanced'].map((levelKey) => {
                  const level = activeItem.levels?.[levelKey];
                  if(!level) return null;
                  
                  const colors = { beginner: 'border-green-500/30', intermediate: 'border-yellow-500/30', advanced: 'border-red-500/30' };
                  const textColors = { beginner: 'text-green-400', intermediate: 'text-yellow-400', advanced: 'text-red-400' };

                  return (
                    <div key={levelKey} className={`bg-slate-800/40 border ${colors[levelKey]} rounded-2xl p-6 relative`}>
                      
                      {/* Level Title & Desc */}
                      <div className="mb-6">
                        <input 
                          type="text" value={level.title} onChange={(e) => updateLevel(levelKey, 'title', e.target.value)}
                          className={`bg-transparent text-xl font-bold ${textColors[levelKey]} focus:outline-none focus:border-b border-slate-600 w-full mb-2`}
                        />
                        <textarea 
                          value={level.description} onChange={(e) => updateLevel(levelKey, 'description', e.target.value)}
                          placeholder="Describe this level..." rows="2"
                          className="bg-transparent text-slate-400 text-sm w-full focus:outline-none resize-none border border-transparent focus:border-slate-700 rounded-lg p-2 -ml-2 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        
                        {/* Topics (Tags Builder) */}
                        <div>
                          <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-3"><Tag className="w-4 h-4 text-cyan-400"/> Topics to Cover</h4>
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
                              placeholder="Add a topic..." 
                              className="bg-slate-900/50 border border-slate-700 text-sm text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 flex-1"
                            />
                            <button onClick={() => addTopic(levelKey)} className="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg"><Plus className="w-4 h-4"/></button>
                          </div>
                        </div>

                        {/* Resources & Certs Builder */}
                        <div className="space-y-6">
                          {/* Certifications */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-white text-sm font-bold flex items-center gap-2"><Award className="w-4 h-4 text-yellow-400"/> Certifications</h4>
                              <button onClick={() => addLinkItem(levelKey, 'certs')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
                            </div>
                            <div className="space-y-2">
                              {level.certs?.map((cert, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                  <input type="text" value={cert.name} onChange={(e) => updateLinkItem(levelKey, 'certs', i, 'name', e.target.value)} placeholder="Cert Name" className="bg-slate-900/50 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 flex-1 focus:border-yellow-500 outline-none" />
                                  <input type="text" value={cert.link} onChange={(e) => updateLinkItem(levelKey, 'certs', i, 'link', e.target.value)} placeholder="URL" className="bg-slate-900/50 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 flex-1 focus:border-yellow-500 outline-none" />
                                  <button onClick={() => removeLinkItem(levelKey, 'certs', i)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Free Resources */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-white text-sm font-bold flex items-center gap-2"><LinkIcon className="w-4 h-4 text-blue-400"/> Free Resources</h4>
                              <button onClick={() => addLinkItem(levelKey, 'resources')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
                            </div>
                            <div className="space-y-2">
                              {level.resources?.map((res, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                  <input type="text" value={res.name} onChange={(e) => updateLinkItem(levelKey, 'resources', i, 'name', e.target.value)} placeholder="Resource Name" className="bg-slate-900/50 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 flex-1 focus:border-blue-500 outline-none" />
                                  <input type="text" value={res.link} onChange={(e) => updateLinkItem(levelKey, 'resources', i, 'link', e.target.value)} placeholder="URL" className="bg-slate-900/50 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 flex-1 focus:border-blue-500 outline-none" />
                                  <button onClick={() => removeLinkItem(levelKey, 'resources', i)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}