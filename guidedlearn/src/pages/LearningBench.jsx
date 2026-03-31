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
import PersonalNotes from '../components/PersonalNotes'; 
import TodoList from '../components/Todolist';
import AiTutor from '../components/AiTutor';

export default function LearningBench() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [pathway, setPathway] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasResumed, setHasResumed] = useState(false);

  const [toolsState, setToolsState] = useState({
    pomodoro: { isOpen: false, isMinimized: false, closeRequested: false },
    notes: { isOpen: false, isMinimized: false, closeRequested: false },
    todo: { isOpen: false, isMinimized: false, closeRequested: false },
    tutor: { isOpen: false, isMinimized: false, closeRequested: false }
  });

  const handleToolToggle = (toolId) => {
    setToolsState(prev => {
      const tool = prev[toolId];
      if (!tool.isOpen) {
        return { ...prev, [toolId]: { isOpen: true, isMinimized: false, closeRequested: false } };
      } else {
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

  useEffect(() => {
    if (pathway && flatSteps.length > 0 && !hasResumed) {
      const completed = pathway.completedTopics || [];
      const firstIncompleteIndex = flatSteps.findIndex(
        step => !completed.includes(`${step.levelKey}::${step.topic}`)
      );

      if (firstIncompleteIndex !== -1) {
        setCurrentStepIndex(firstIncompleteIndex);
      } else {
        setCurrentStepIndex(flatSteps.length - 1);
      }
      setHasResumed(true);
    }
  }, [pathway, flatSteps, hasResumed]);

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

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-[#020617] text-cyan-400 animate-pulse font-bold text-lg sm:text-xl">Loading your Learning Bench...</div>;
  }
  if (!pathway) return null;

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

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 font-sans relative min-h-screen">
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none -z-10"></div>
        
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group text-sm font-bold active:scale-95 w-fit">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <PathwayHero pathway={pathway} totalLevels={totalLevels} totalTopics={totalTopics} totalResources={totalResources} />

        {/* 💡 Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 relative items-start">
          
          {/* Left Column: Learning Area */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {currentStepData ? (
              <LearningWorkspace 
                pathwayTitle={pathway.title}
                levelTitle={currentStepData.levelTitle}
                topic={currentStepData.topic}
                isCompleted={(pathway.completedTopics || []).includes(`${currentStepData.levelKey}::${currentStepData.topic}`)}
                onMarkComplete={() => handleMarkComplete(currentStepData.levelKey, currentStepData.topic)}
              />
            ) : (
              <div className="text-center text-slate-500 py-10 bg-slate-900/20 rounded-3xl border border-slate-800">Loading workspace...</div>
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

          <div className="xl:col-span-1 flex flex-col gap-6 xl:sticky xl:top-28">
            
            {/* Learning Tools Box */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl">
              <h3 className="text-white font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> Learning Tools
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button 
                  onClick={() => handleToolToggle('pomodoro')} 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 active:scale-95 ${
                    toolsState.pomodoro.isOpen 
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <Timer className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                  <span className="font-bold text-xs sm:text-sm">Timer</span>
                </button>

                <button 
                  onClick={() => handleToolToggle('notes')} 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 active:scale-95 ${
                    toolsState.notes.isOpen 
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <NotebookPen className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                  <span className="font-bold text-xs sm:text-sm">Notes</span>
                </button>

                <button 
                  onClick={() => handleToolToggle('todo')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 active:scale-95 ${
                    toolsState.todo.isOpen 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <ListTodo className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                  <span className="font-bold text-xs sm:text-sm">To-Do</span>
                </button>

                <button 
                  onClick={() => handleToolToggle('tutor')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 active:scale-95 ${
                    toolsState.tutor.isOpen 
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <MessageCircleCode className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                  <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-tighter">AI Tutor</span>
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
      {/* Timer */}
      <FloatingWidget
        title="Focus Timer" icon={Timer}
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
        <div className="p-4"><PomodoroTimer /></div>
      </FloatingWidget>

      {/* Notes */}
      <FloatingWidget
        title="Personal Notes" icon={NotebookPen}
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

      {/* To-Do */}
      <FloatingWidget
        title="Tasks & To-Do" icon={ListTodo}
        isOpen={toolsState.todo.isOpen}
        isMinimized={toolsState.todo.isMinimized}
        closeRequested={toolsState.todo.closeRequested}
        onRequestClose={() => requestToolClose('todo')}
        onConfirmClose={() => confirmToolClose('todo')}
        onCancelClose={() => cancelToolClose('todo')}
        onMinimize={() => setToolMinimized('todo', true)}
        onRestore={() => setToolMinimized('todo', false)}
        defaultWidth={340}
      >
        <div className="h-[380px] p-4"><TodoList /></div>
      </FloatingWidget>

      {/* AI Tutor */}
      <FloatingWidget
        title="AI Tutor - Nimna" icon={Sparkles}
        isOpen={toolsState.tutor.isOpen}
        isMinimized={toolsState.tutor.isMinimized}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2">Delete Pathway?</h2>
              <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
                Are you sure? Abandoning <strong className="text-slate-200">"{pathway.title}"</strong> will reset all progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button onClick={() => setShowDeleteModal(false)} className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 sm:py-3 rounded-xl transition-colors active:scale-95 border border-slate-700">Cancel</button>
                <button onClick={confirmDelete} className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 sm:py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-95">Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}