import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'; 
import { ArrowLeft, AlertTriangle, Sparkles, Timer, NotebookPen, ListTodo, MessageCircleCode} from 'lucide-react'; 
import toast from 'react-hot-toast';

// Components
import PathwayHero from '../components/PathwayHero';
import LearningWorkspace from '../components/LearningWorkspace';
import SidebarWidgets from '../components/SidebarWidgets';
import PathwayNavigation from '../components/PathwayNavigation';
import PomodoroTimer from '../components/PomodoroTimer';
import FloatingWidget from '../components/FloatingWidget'; 
import PersonalNotes from '../components/PersonalNotes'; // 💡 අලුතින් ගත්තා
import TodoList from '../components/Todolist';
import AiTutor from '../components/AiTutor';

export default function LearningBench() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 1. States
  const [pathway, setPathway] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasResumed, setHasResumed] = useState(false);

  // --- 🚀 Tool Management State ---
  const [toolsState, setToolsState] = useState({
    pomodoro: { isOpen: false, isMinimized: false, closeRequested: false },
    notes: { isOpen: false, isMinimized: false, closeRequested: false },
    todo: { isOpen: false, isMinimized: false, closeRequested: false },
    tutor: { isOpen: false, isMinimized: false, closeRequested: false }
  });

  // 💡 Sidebar එකේ බට්න් එක එබුවම වෙන දේ පාලනය කරන ප්‍රධාන Function එක
  const handleToolToggle = (toolId) => {
    setToolsState(prev => {
      const tool = prev[toolId];
      if (!tool.isOpen) {
        // Open කරලා නැත්නම් සාමාන්‍ය විදිහට Open කරනවා
        return { ...prev, [toolId]: { isOpen: true, isMinimized: false, closeRequested: false } };
      } else {
        // Open කරලා නම් තියෙන්නේ, කෙලින්ම වහන්නේ නෑ. Close Popup එක පෙන්වනවා.
        return { ...prev, [toolId]: { ...tool, isMinimized: false, closeRequested: true } };
      }
    });
  };

  const requestToolClose = (toolId) => setToolsState(prev => ({ ...prev, [toolId]: { ...prev[toolId], closeRequested: true, isMinimized: false } }));
  const cancelToolClose = (toolId) => setToolsState(prev => ({ ...prev, [toolId]: { ...prev[toolId], closeRequested: false } }));
  const confirmToolClose = (toolId) => setToolsState(prev => ({ ...prev, [toolId]: { isOpen: false, isMinimized: false, closeRequested: false } }));

  const setToolMinimized = (toolId, minimized) => {
    setToolsState(prev => ({ ...prev, [toolId]: { ...prev[toolId], isMinimized: minimized } }));
  };

  // 2. useMemo for flattening topics
  const flatSteps = useMemo(() => {
    if (!pathway) return [];
    const steps = [];
    const orderedLevels = ['beginner', 'intermediate', 'advanced'];
    
    orderedLevels.forEach(levelKey => {
      if (pathway.levels && pathway.levels[levelKey]) {
        const levelData = pathway.levels[levelKey];
        levelData.topics?.forEach(topic => {
          steps.push({ levelKey, levelTitle: levelData.title, topic });
        });
      }
    });
    return steps;
  }, [pathway]);

  // --- 🚀 අලුත් කෑල්ල: Auto-Resume Logic ---
  useEffect(() => {
    // Pathway එකයි Steps ටිකයි ලෝඩ් වුණාට පස්සේ, සහ තවම Resume කරලා නැත්නම් විතරක් මේක වැඩ කරනවා
    if (pathway && flatSteps.length > 0 && !hasResumed) {
      const completed = pathway.completedTopics || [];

      // ඉවර කරලා නැති පළවෙනි පාඩමේ අංකය (Index) හොයනවා
      const firstIncompleteIndex = flatSteps.findIndex(
        step => !completed.includes(`${step.levelKey}::${step.topic}`)
      );

      if (firstIncompleteIndex !== -1) {
        // ඉවර කරලා නැති පාඩමක් හම්බුණොත් කෙලින්ම එතනට පනිනවා
        setCurrentStepIndex(firstIncompleteIndex);
      } else {
        // ඔක්කොම පාඩම් ඉවර කරලා නම්, අන්තිම පාඩමට යනවා
        setCurrentStepIndex(flatSteps.length - 1);
      }

      // ආයෙත් මේක රන් වෙන එක නවත්තන්න State එක 'true' කරනවා
      setHasResumed(true);
    }
  }, [pathway, flatSteps, hasResumed]);

  // 3. useEffects
  useEffect(() => {
    const fetchPathwayDetails = async () => {
      if (!user) return; 
      if (!id) return navigate('/dashboard');
      try {
        const docRef = doc(db, 'users', user.uid, 'my_pathways', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPathway({ id: docSnap.id, ...data });
          setTimeSpentSeconds(data.timeSpent || 0); 
        } else {
          navigate('/dashboard'); 
        }
      } catch (error) {
        console.error("Error fetching pathway:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPathwayDetails();
  }, [user, id, navigate]);

  useEffect(() => {
    if (!pathway || !user) return;
    const timerInterval = setInterval(() => {
      setTimeSpentSeconds((prevSeconds) => {
        const newTotalSeconds = prevSeconds + 60;
        const docRef = doc(db, 'users', user.uid, 'my_pathways', id);
        updateDoc(docRef, { timeSpent: newTotalSeconds }).catch(e => console.error(e));
        return newTotalSeconds;
      });
    }, 60000); 
    return () => clearInterval(timerInterval);
  }, [pathway, user, id]);

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    const toastId = toast.loading("Deleting pathway...", { style: { background: '#1e293b', color: '#fff' } });
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'my_pathways', id));
      toast.success("Pathway deleted successfully!", { id: toastId });
      navigate('/dashboard'); 
    } catch (error) {
      toast.error("Failed to delete pathway.", { id: toastId });
    }
  };

  // --- Backend: Mark Topic as Completed ---
  const handleMarkComplete = async (levelKey, topicName) => {
    const topicId = `${levelKey}::${topicName}`;
    const currentCompleted = pathway.completedTopics || [];
    if (currentCompleted.includes(topicId)) return;

    const newCompleted = [...currentCompleted, topicId];
    const totalStepsCount = flatSteps.length;
    const newProgress = Math.round((newCompleted.length / totalStepsCount) * 100);

    setPathway(prev => ({ ...prev, completedTopics: newCompleted, progress: newProgress }));

    try {
      const docRef = doc(db, 'users', user.uid, 'my_pathways', id);
      await updateDoc(docRef, { completedTopics: newCompleted, progress: newProgress });
      toast.success("Awesome! Progress saved.", { style: { background: '#10b981', color: '#fff' } });
    } catch (error) {
      toast.error("Failed to save progress. Please check your connection.");
    }
  };

  // 4. Early Returns
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-cyan-400 animate-pulse font-bold text-xl">Loading your Learning Bench...</div>;
  }
  if (!pathway) return null;

  // 5. Derived Data & Calculations
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours === 0 && minutes === 0) return "00h 01m";
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  };

  const totalLevels = Object.keys(pathway.levels || {}).length;
  let totalTopics = 0;
  let totalResources = 0;
  Object.values(pathway.levels || {}).forEach(level => {
    totalTopics += (level.topics?.length || 0);
    totalResources += (level.resources?.length || 0) + (level.certs?.length || 0);
  });

  const funFact = pathway.title.toLowerCase().includes('java') 
    ? "Java was originally called 'Oak' after a tree outside the creator's office!"
    : pathway.title.toLowerCase().includes('python')
    ? "Python was named after the comedy group Monty Python, not the snake!"
    : "Learning a new skill physically changes the structure of your brain in just 7 days!";

  const currentStepData = flatSteps[currentStepIndex];

  // 6. JSX Render
  return (
    <>
      <div className="pt-35 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <PathwayHero pathway={pathway} totalLevels={totalLevels} totalTopics={totalTopics} totalResources={totalResources} />

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8 relative items-start">
          
          <div className="xl:col-span-2">
            {currentStepData ? (
              <LearningWorkspace 
                pathwayTitle={pathway.title}
                levelTitle={currentStepData.levelTitle}
                topic={currentStepData.topic}
                isCompleted={(pathway.completedTopics || []).includes(`${currentStepData.levelKey}::${currentStepData.topic}`)}
                onMarkComplete={() => handleMarkComplete(currentStepData.levelKey, currentStepData.topic)}
              />
            ) : (
              <div className="text-center text-slate-500 py-10">Loading workspace...</div>
            )}
            
            {flatSteps.length > 0 && currentStepData && (
              <PathwayNavigation 
                currentLevelKey={currentStepData.levelKey}
                currentLevelTitle={currentStepData.levelTitle}
                currentTopic={currentStepData.topic}
                currentStepNum={currentStepIndex + 1}
                totalSteps={flatSteps.length}
                isFirst={currentStepIndex === 0}
                isLast={currentStepIndex === flatSteps.length - 1}
                onNext={() => setCurrentStepIndex(prev => prev + 1)}
                onPrev={() => setCurrentStepIndex(prev => prev - 1)}
              />
            )}
          </div>

          <div className="xl:col-span-1 flex flex-col gap-6 sticky top-8">
            
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" /> Learning Tools
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleToolToggle('pomodoro')} // 💡 මෙතන හරිම ෆන්ක්ෂන් එක දැම්මා
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                    toolsState.pomodoro.isOpen 
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <Timer className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">Timer</span>
                </button>

                <button 
                  onClick={() => handleToolToggle('notes')} // 💡 මෙතනත් හරිම ෆන්ක්ෂන් එක දැම්මා
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                    toolsState.notes.isOpen 
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <NotebookPen className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">Notes</span>
                </button>

                <button 
                  onClick={() => handleToolToggle('todo')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                    toolsState.todo.isOpen 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <ListTodo className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">To-Do</span>
                </button>

                <button 
                  onClick={() => handleToolToggle('tutor')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                    toolsState.tutor.isOpen 
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <MessageCircleCode className="w-8 h-8 mb-2" />
                  <span className="font-bold text-[10px] uppercase tracking-tighter">AI Tutor</span>
                </button>

              </div>
            </div>

            <SidebarWidgets 
              pathwayTitle={pathway.title}
              funFact={funFact} 
              timeSpent={formatTime(timeSpentSeconds)} 
              learners={`${(pathway.title.length * 42) + 120}`} 
              onDeleteClick={() => setShowDeleteModal(true)} 
            />
          </div>

        </div>
      </div>

      {/* --- 🚀 FLOATING TOOLS --- */}
      <FloatingWidget
        title="Focus Timer"
        icon={Timer}
        isOpen={toolsState.pomodoro.isOpen}
        isMinimized={toolsState.pomodoro.isMinimized}
        closeRequested={toolsState.pomodoro.closeRequested} 
        onRequestClose={() => requestToolClose('pomodoro')}         
        onConfirmClose={() => confirmToolClose('pomodoro')}         
        onCancelClose={() => cancelToolClose('pomodoro')}           
        onMinimize={() => setToolMinimized('pomodoro', true)}
        onRestore={() => setToolMinimized('pomodoro', false)}
        defaultWidth={340}
      >
        <PomodoroTimer />
      </FloatingWidget>

      {/* 2. 📝 Notes Widget (මෙන්න මේකයි අලුතින් දාන්නේ!) */}
      <FloatingWidget
        title="Personal Notes"
        icon={NotebookPen}
        isOpen={toolsState.notes.isOpen}
        isMinimized={toolsState.notes.isMinimized}
        closeRequested={toolsState.notes.closeRequested}
        onRequestClose={() => requestToolClose('notes')}
        onConfirmClose={() => confirmToolClose('notes')}
        onCancelClose={() => cancelToolClose('notes')}
        onMinimize={() => setToolMinimized('notes', true)}
        onRestore={() => setToolMinimized('notes', false)}
        defaultWidth={800}
        
      >
        <PersonalNotes />
      </FloatingWidget>

      <FloatingWidget
        title="Tasks & To-Do"
        icon={ListTodo}
        isOpen={toolsState.todo.isOpen}
        isMinimized={toolsState.todo.isMinimized}
        closeRequested={toolsState.todo.closeRequested}
        onRequestClose={() => requestToolClose('todo')}
        onConfirmClose={() => confirmToolClose('todo')}
        onCancelClose={() => cancelToolClose('todo')}
        onMinimize={() => setToolMinimized('todo', true)}
        onRestore={() => setToolMinimized('todo', false)}
        defaultWidth={340} /* 💡 Todo එකට 340px ඇති */
      >
        {/* Widget එක ඇතුළේ Scroll වෙන්න උස හදලා තියෙන්නේ */}
        <div className="h-[350px]">
          <TodoList />
        </div>
      </FloatingWidget>

      {/* 4. 🤖 AI Tutor Widget */}
      <FloatingWidget
        title="AI Tutor - Nimna"
        icon={Sparkles}
        isOpen={toolsState.tutor.isOpen}
        isMinimized={toolsState.tutor.isMinimized} // 💡 මෙන්න මෙතන තිබ්බ වැරැද්ද හැදුවා
        closeRequested={toolsState.tutor.closeRequested}
        onRequestClose={() => requestToolClose('tutor')}
        onConfirmClose={() => confirmToolClose('tutor')}
        onCancelClose={() => cancelToolClose('tutor')}
        onMinimize={() => setToolMinimized('tutor', true)}
        onRestore={() => setToolMinimized('tutor', false)}
        defaultWidth={380}
      >
        <AiTutor topic={currentStepData?.topic} pathwayTitle={pathway.title} />
      </FloatingWidget>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-5">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Delete Pathway?</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Are you absolutely sure you want to abandon <strong className="text-slate-200">"{pathway.title}"</strong>? All your learning progress will be permanently lost.
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]">Yes, Delete it</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}