import { useState, useEffect } from 'react';
import { Sparkles, X, Trophy, AlertCircle, Loader2 } from 'lucide-react';
// 💡 Firebase Functions වලට අදාළ දේවල් Import කළා
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export default function AiQuickQuiz({ isOpen, onClose, topic, pathwayTitle }) {
  const [quizState, setQuizState] = useState('idle');
  const [quizData, setQuizData] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (isOpen) {
      generateQuiz();
    } else {
      setQuizState('idle');
      setQuizData([]);
      setCurrentQIndex(0);
      setUserAnswers({});
      setQuizScore(0);
    }
  }, [isOpen, topic, pathwayTitle]);

  const generateQuiz = async () => {
    setQuizState('loading');
    try {
      // 🚀 පරණ Fetch Call එක වෙනුවට Firebase Cloud Function එකට කතා කරනවා
      const generateQuizFn = httpsCallable(functions, 'generateQuiz');
      
      const result = await generateQuizFn({ 
        topic: topic, 
        pathwayTitle: pathwayTitle 
      });

      // 💡 Cloud Function එකෙන් කෙලින්ම එන්නේ JSON එක (අපි Backend එකේ Parse කරන නිසා)
      const parsedQuiz = result.data;
      
      setQuizData(parsedQuiz);
      setQuizState('playing');

    } catch (error) {
      console.error("Quiz Generation Error:", error);
      setQuizState('error');
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < quizData.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      let finalScore = 0;
      quizData.forEach((q, index) => {
        if (userAnswers[index] === q.correctIndex) finalScore++;
      });
      setQuizScore(finalScore);
      setQuizState('review');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl md:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[95dvh] md:max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-800/50 border-b border-slate-700/50 p-3.5 sm:p-4 px-4 sm:px-6 flex justify-between items-center shrink-0">
          <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" /> AI Knowledge Check
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-[300px]">
          
          {quizState === 'loading' && (
            <div className="flex flex-col items-center text-center gap-4 text-purple-400 my-auto">
              <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin" />
              <p className="font-bold text-base md:text-lg animate-pulse uppercase tracking-widest">Generating your custom quiz...</p>
            </div>
          )}

          {quizState === 'error' && (
            <div className="text-center my-auto">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-red-400 mx-auto mb-4" />
              <h4 className="text-white font-bold text-lg md:text-xl mb-2">Oops! Something went wrong.</h4>
              <p className="text-slate-400 text-sm md:text-base mb-6">We couldn't generate the quiz right now. Try again in a moment.</p>
              <button onClick={onClose} className="w-full sm:w-auto bg-slate-800 text-white px-6 py-3 rounded-xl">Close</button>
            </div>
          )}

          {quizState === 'playing' && quizData.length > 0 && (
            <div className="w-full my-auto">
              
              <div className="mb-6 md:mb-8 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-center">
                  <span className="text-purple-300 font-black text-xs sm:text-sm md:text-base leading-snug uppercase tracking-wide">
                    {topic}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                      style={{ width: `${((currentQIndex + 1) / quizData.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] md:text-xs font-black text-slate-500 whitespace-nowrap uppercase tracking-widest">
                    Q {currentQIndex + 1} / {quizData.length}
                  </span>
                </div>
              </div>
              
              <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-6 md:mb-8 leading-tight">
                {quizData[currentQIndex].question}
              </h4>

              <div className="space-y-2.5 md:space-y-3">
                {quizData[currentQIndex].options.map((option, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all font-bold text-sm md:text-base ${
                      userAnswers[currentQIndex] === idx 
                        ? 'border-purple-500 bg-purple-500/10 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)] transform scale-[1.01]' 
                        : 'border-slate-800 hover:border-slate-600 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <span className={`inline-block w-6 md:w-8 font-black ${userAnswers[currentQIndex] === idx ? 'text-purple-400' : 'text-slate-600'}`}>{['A', 'B', 'C', 'D'][idx]}</span> 
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-6 md:mt-8 flex justify-end">
                <button 
                  onClick={handleNextQuestion}
                  disabled={userAnswers[currentQIndex] === undefined}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black px-6 md:px-10 py-3.5 rounded-xl transition-all text-sm md:text-base shadow-lg shadow-purple-600/20"
                >
                  {currentQIndex === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </div>
          )}

          {quizState === 'review' && (
            <div className="w-full">
              <div className="text-center mb-6 md:mb-8 mt-2 md:mt-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <Trophy className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">Score: {quizScore} / {quizData.length}</h2>
                <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
                  {quizScore === quizData.length ? "Masterpiece! You're unstoppable. 🌟" : "Good work! Learning is a journey. 💪"}
                </p>
              </div>

              <div className="space-y-4 md:space-y-6">
                {quizData.map((q, idx) => {
                  const isCorrect = userAnswers[idx] === q.correctIndex;
                  return (
                    <div key={idx} className={`p-4 md:p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <h4 className="text-white font-bold mb-2 md:mb-3 text-sm md:text-base leading-snug"><span className="text-slate-600 mr-2">Q{idx + 1}.</span> {q.question}</h4>
                      <div className="text-xs md:text-sm mb-3 font-bold">
                        <p className="text-slate-500">Your Answer: <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>{q.options[userAnswers[idx]]}</span></p>
                        {!isCorrect && <p className="text-emerald-400 mt-1">Correct: {q.options[q.correctIndex]}</p>}
                      </div>
                      <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed"><span className="text-purple-400 font-black uppercase text-[10px] tracking-widest mr-2">AI Explanation</span> {q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 mb-2 flex justify-center">
                <button onClick={onClose} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-black px-8 py-3.5 rounded-xl transition-all text-sm md:text-base border border-slate-700">
                  Back to Learning
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
} 