import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'; 
import { ArrowLeft, AlertTriangle } from 'lucide-react'; 
import toast from 'react-hot-toast';

// Components
import PathwayHero from '../components/PathwayHero';
import LearningWorkspace from '../components/LearningWorkspace';
import SidebarWidgets from '../components/SidebarWidgets';
import PathwayNavigation from '../components/PathwayNavigation';

export default function LearningBench() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 1. States (Always at the top)
  const [pathway, setPathway] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // 2. useMemo for flattening topics
  const flatSteps = useMemo(() => {
    if (!pathway) return [];
    const steps = [];
    const orderedLevels = ['beginner', 'intermediate', 'advanced'];
    
    orderedLevels.forEach(levelKey => {
      if (pathway.levels && pathway.levels[levelKey]) {
        const levelData = pathway.levels[levelKey];
        levelData.topics?.forEach(topic => {
          steps.push({
            levelKey: levelKey,
            levelTitle: levelData.title,
            topic: topic
          });
        });
      }
    });
    return steps;
  }, [pathway]);

  // 3. useEffects
  useEffect(() => {
    const fetchPathwayDetails = async () => {
      if (!user) return; 
      if (!id) {
        navigate('/dashboard');
        return;
      }
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
        updateDoc(docRef, { timeSpent: newTotalSeconds }).catch(err => console.error("Timer save error:", err));
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
      console.error("Error deleting pathway:", error);
      toast.error("Failed to delete pathway.", { id: toastId });
    }
  };

  // --- 🚀 Backend: Mark Topic as Completed ---
  const handleMarkComplete = async (levelKey, topicName) => {
    // 1. Topic එක අඳුරගන්න Unique ID එකක් හදනවා (උදා: beginner-Variables)
    const topicId = `${levelKey}::${topicName}`;
    const currentCompleted = pathway.completedTopics || [];

    // දැනටමත් ඉවර කරලා නම් මුකුත් කරන්නේ නෑ
    if (currentCompleted.includes(topicId)) return;

    const newCompleted = [...currentCompleted, topicId];
    
    // 2. අලුත් Progress Percentage එක හදනවා
    const totalStepsCount = flatSteps.length;
    const newProgress = Math.round((newCompleted.length / totalStepsCount) * 100);

    // 3. ළමයාට ඉක්මනට පේන්න UI එක එවේලේම අප්ඩේට් කරනවා (Optimistic Update)
    setPathway(prev => ({
      ...prev,
      completedTopics: newCompleted,
      progress: newProgress
    }));

    // 4. Background එකෙන් Database එක Update කරනවා!
    try {
      const docRef = doc(db, 'users', user.uid, 'my_pathways', id);
      await updateDoc(docRef, {
        completedTopics: newCompleted,
        progress: newProgress
      });
      // ලස්සන කොළ පාට Alert එකක් දෙනවා
      toast.success("Awesome! Progress saved.", { style: { background: '#10b981', color: '#fff' } });
    } catch (error) {
      console.error("Error updating progress:", error);
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
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <PathwayHero 
          pathway={pathway} 
          totalLevels={totalLevels} 
          totalTopics={totalTopics} 
          totalResources={totalResources} 
        />

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8 relative items-start">
          
          <div className="xl:col-span-2">
            {/* 💡 අලුතින් Props ටික යැව්වා */}
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
            
            {/* Pathway Navigation Widget */}
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

          <div className="xl:col-span-1 sticky top-8">
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
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  Yes, Delete it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}