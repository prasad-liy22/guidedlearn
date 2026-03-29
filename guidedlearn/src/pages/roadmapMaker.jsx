import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; // 💡 doc, getDoc එකතු කළා
import { db } from '../firebase';
import { Search, Sparkles, ArrowRight, BookOpen, ExternalLink, Award, FileText, CheckCircle2 } from 'lucide-react'; // 🔔 Icons අලුතින් ගත්තා
import toast from 'react-hot-toast';

// --- 💡 Dummy Data structure (අපි Firestore එකෙන් පස්සේ මේ වගේ structure එකක් ගන්නේ) ---
const mockRoadmap = {
  "title": "Java Programming",
  "levels": {
    "beginner": {
      "title": "Level 1: Beginner (Core Java)",
      "iconColor": "text-green-400",
      "description": "Mastering the foundational concepts of Java, syntax, and basic Object-Oriented logic.",
      "topics": [
        "Java Setup & Environment (JDK, IDE)",
        "Variables, Data Types & Operators",
        "Control Flow (If/Else, Switch, For/While Loops)",
        "Arrays & Strings Management",
        "Basic OOP (Classes, Objects, Methods)"
      ],
      "certs": [
        { 
          "name": "HackerRank Java Basic Certificate", 
          "link": "https://www.hackerrank.com/skills-verification/java_basic" 
        },
        { 
          "name": "SoloLearn Java Course", 
          "link": "https://www.sololearn.com/learning/1068" 
        }
      ],
      "resources": [
        { 
          "name": "Java Tutorial for Beginners (Programming with Mosh)", 
          "link": "https://www.youtube.com/watch?v=eIrMbAQSU34" 
        },
        { 
          "name": "W3Schools Java Tutorial", 
          "link": "https://www.w3schools.com/java/" 
        }
      ]
    },
    "intermediate": {
      "title": "Level 2: Intermediate (Advanced OOP)",
      "iconColor": "text-yellow-400",
      "description": "Deep dive into the Java Collections framework, functional programming, and data handling.",
      "topics": [
        "Advanced OOP (Inheritance, Polymorphism, Abstraction)",
        "Exception Handling & Debugging",
        "Java Collections Framework (List, Set, Map, Queue)",
        "Generics & Wrapper Classes",
        "Java 8 Features (Lambda Expressions, Streams API)",
        "File I/O & Serialization"
      ],
      "certs": [
        { 
          "name": "Oracle Certified Associate, Java SE 8 (OCA)", 
          "link": "https://education.oracle.com/java-se-8-programmer-i/pexam_1Z0-808" 
        },
        { 
          "name": "Coursera: Object Oriented Programming in Java", 
          "link": "https://www.coursera.org/learn/object-oriented-java" 
        }
      ],
      "resources": [
        { 
          "name": "Java Collections Framework (Amigoscode)", 
          "link": "https://www.youtube.com/watch?v=Vi91qyjukRQ" 
        },
        { 
          "name": "Baeldung - Java Collections", 
          "link": "https://www.baeldung.com/java-collections" 
        }
      ]
    },
    "advanced": {
      "title": "Level 3: Advanced (Enterprise & Web)",
      "iconColor": "text-red-400",
      "description": "Mastering multithreading, enterprise frameworks like Spring Boot, and building APIs.",
      "topics": [
        "Multithreading & Concurrency",
        "JDBC & Database Connectivity",
        "Java Persistence API (JPA) & Hibernate",
        "Spring Core & Dependency Injection",
        "Building RESTful APIs with Spring Boot",
        "Microservices Architecture Basics",
        "Testing (JUnit & Mockito)"
      ],
      "certs": [
        { 
          "name": "Spring Professional Certification", 
          "link": "https://spring.academy/learning-path" 
        },
        { 
          "name": "Udemy: Java Spring Boot Microservices", 
          "link": "https://www.udemy.com/course/microservices-with-spring-boot-and-spring-cloud/" 
        }
      ],
      "resources": [
        { 
          "name": "Spring Boot Full Course (Amigoscode)", 
          "link": "https://www.youtube.com/watch?v=9SGDpanrc8U" 
        },
        { 
          "name": "Spring Official Guides", 
          "link": "https://spring.io/guides" 
        },
        { 
          "name": "Java Concurrency / Multithreading Guide", 
          "link": "https://www.baeldung.com/java-concurrency" 
        }
      ]
    }
  }
}

export default function RoadmapMaker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [popularTopics, setPopularTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- 💡 අලුත් States ---
  const [selectedRoadmap, setSelectedRoadmap] = useState(null); // තේරූ Roadmap data තියාගන්න
  const [isGenerating, setIsGenerating] = useState(false); // Loading animation එකට

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
    setSelectedRoadmap(null); // අලුතින් search කරනකොට පරණ එක වහනවා

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
    setSelectedRoadmap(null); // reset old view
  };

  // --- 💡 Generate Button Logic (දැනට Dummy Data පෙන්වනවා) ---
  const handleGenerate = () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a topic!");
      return;
    }
    
    setIsGenerating(true);
    setSelectedRoadmap(null);
    toast.success(`Looking for data: ${searchTerm}...`, { icon: '🔍', style: { background: '#1e293b', color: '#fff' } });
    
    // Simulate AI or DB fetch time (තත්පර 1.5ක්)
    setTimeout(() => {
      // අපි Java Programming කියලා සෙව්වොත් විතරක් Mock data පෙන්වමු
      if (searchTerm.toLowerCase().includes("java programm")) {
         setSelectedRoadmap(mockRoadmap);
         toast.success("Roadmap loaded from our Database!", { icon: '✅', style: { background: '#1e293b', color: '#fff' } });
      } else {
         toast.error("AI Generation isn't connected yet! Try searching 'Java Programming' to see a demo.");
      }
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

      {/* --- Header Section (Only show if roadmap is not generated) --- */}
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

      {/* --- Search Box Area --- */}
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

        {/* --- Autocomplete Dropdown --- */}
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

      {/* --- 💡 Roadmap Display Area --- */}
      {isGenerating && (
         <div className="max-w-5xl mx-auto text-center py-10 animate-pulse">
            <h2 className="text-xl font-bold text-slate-400">Our AI is mapping your future...</h2>
            <p className="text-sm text-slate-500 mt-2">Checking our database or calling the AI engine.</p>
         </div>
      )}

      {selectedRoadmap && (
         <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700/50">
               <h2 className="text-3xl md:text-4xl font-black text-white"> <span className="text-cyan-400">AI</span> Roadmap for: <span className="underline decoration-blue-500">{selectedRoadmap.title}</span></h2>
            </div>

            {/* Beginner, Intermediate, Advanced Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
               {/* Background Line for flow */}
               <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-linear-to-r from-green-500/20 via-yellow-500/20 to-red-500/20 -translate-y-1/2 -z-10 rounded-full"></div>
               
               {Object.keys(selectedRoadmap.levels).map(levelKey => {
                  const level = selectedRoadmap.levels[levelKey];
                  return (
                     <div key={levelKey} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col hover:border-cyan-500/30 transition-all hover:-translate-y-1 hover:shadow-cyan-500/5">
                        
                        {/* Header */}
                        <div className={`inline-flex items-center gap-2 font-black text-2xl ${level.iconColor} mb-3`}>
                           <CheckCircle2 className="w-7 h-7" />
                           {level.title}
                        </div>
                        <p className="text-slate-400 text-sm mb-6 pb-5 border-b border-slate-700/50">{level.description}</p>
                        
                        {/* Topics Section */}
                        <div className="flex-grow space-y-3 mb-8">
                           <h4 className="text-slate-200 text-base font-bold flex items-center gap-2"> <FileText className="w-4 h-4 text-cyan-400"/> Key Topics</h4>
                           <ul className="space-y-2.5">
                              {level.topics.map((topic, i) => (
                                 <li key={i} className="text-slate-300 text-sm flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg"> <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span> {topic}</li>
                              ))}
                           </ul>
                        </div>

                        {/* Resources Section */}
                        <div className="space-y-4 pt-5 border-t border-slate-700/50 mt-auto">
                           {level.certs && (
                              <div>
                                 <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2"> <Award className="w-4 h-4 text-yellow-400"/> Certifications</h4>
                                 {level.certs.map((cert, i) => (
                                    <a key={i} href={cert.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs flex items-center gap-1.5 hover:text-cyan-300 transition-colors"> <ExternalLink className="w-3 h-3"/> {cert.name}</a>
                                 ))}
                              </div>
                           )}
                           {level.resources && (
                              <div>
                                 <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2 mb-2"> <BookOpen className="w-4 h-4 text-blue-400"/> Free Resources</h4>
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
         </div>
      )}

      {/* --- Popular Suggestions (Only show if roadmap is not generated) --- */}
      {!selectedRoadmap && !isGenerating && (
         <div className="max-w-3xl mx-auto mt-12 animate-in fade-in duration-500 delay-100">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold mb-4 ml-1">
               <BookOpen className="w-4 h-4" />
               Popular Topics (Demo: 'Java Programming')
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