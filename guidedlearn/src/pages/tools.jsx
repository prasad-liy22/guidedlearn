import { useState } from 'react';
import { Sparkles, Timer, NotebookPen, ListTodo, MessageCircleCode, Zap, Rocket, ChevronRight, ExternalLink } from 'lucide-react';

export default function Tools() {
  // 💡 ක්ලික් කරපු කාඩ් එකේ ID එක මතක තියාගන්න State එක
  const [activeOverlay, setActiveOverlay] = useState(null);

  const mainTools = [
    {
      id: "tutor",
      title: "AI Tutor - Nimna",
      icon: MessageCircleCode,
      color: "from-blue-500 to-cyan-400",
      description: "Powered by Gemini 2.5 Flash, Nimna acts as your personal tutor. Ask questions, clarify doubts, and get deep explanations in real-time.",
      demo: "Ask me anything about your current lesson...",
      focus: "Personal Guidance" // 💡 අලුත් Focus Tag එක
    },
    {
      id: "notes",
      title: "Professional Notes",
      icon: NotebookPen,
      color: "from-purple-600 to-pink-500",
      description: "A VS Code inspired rich text editor with a built-in file directory. Save your study materials directly to the cloud.",
      demo: "# My Study Note\n- Key points saved to Firestore...",
      focus: "Knowledge Base" // 💡 අලුත් Focus Tag එක
    },
    {
      id: "timer",
      title: "Focus Timer",
      icon: Timer,
      color: "from-orange-500 to-yellow-400",
      description: "Custom Pomodoro timer built for deep work sessions. Track your study time and boost productivity without distractions.",
      demo: "25:00 - Focus Session Active",
      focus: "Deep Work" // 💡 අලුත් Focus Tag එක
    },
    {
      id: "todo",
      title: "Smart To-Do List",
      icon: ListTodo,
      color: "from-emerald-500 to-teal-400",
      description: "Keep track of your learning goals. Organized tasks with real-time sync across all your devices.",
      demo: "✅ Complete React Hooks lesson",
      focus: "Goal Tracking" // 💡 අලුත් Focus Tag එක
    }
  ];

  const handleCardClick = (id) => {
    setActiveOverlay(id);
    // තත්පර 3කට පස්සේ මැසේජ් එක ඉබේම අයින් කරනවා
    setTimeout(() => setActiveOverlay(null), 3000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Study Kit</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Four powerful tools, one seamless experience. Click on any tool to see where the magic happens.
          </p>
        </div>

        {/* Main Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {mainTools.map((tool) => (
            <div 
              key={tool.id} 
              onClick={() => handleCardClick(tool.id)}
              className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-8 hover:border-cyan-500/50 transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer active:scale-[0.98]"
            >
              {/* 💡 අලුත්: Click කළාම එන Overlay එක */}
              {activeOverlay === tool.id && (
                <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 border border-cyan-500/20">
                    <ExternalLink className="w-8 h-8 text-cyan-400 animate-bounce" />
                  </div>
                  <h4 className="text-white font-black text-xl mb-2">Check it on Learning Bench!</h4>
                  <p className="text-slate-400 text-sm">Open any learning pathway to start using this tool.</p>
                </div>
              )}

              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-5 blur-[60px] group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} shadow-lg shadow-black/20`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                {/* 💡 Focus Tag එක මෙතන තියෙනවා */}
                <span className="px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  {tool.focus}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">{tool.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {tool.description}
              </p>

              {/* Live Preview Area */}
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 font-mono text-[11px] relative">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500/30"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/30"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/30"></div>
                </div>
                <div className="text-cyan-400/60 leading-relaxed italic">
                  {tool.demo}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="relative pt-20 border-t border-slate-800/50">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black text-white">Future Updates</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-6 p-6 bg-slate-900/20 border border-slate-800 rounded-3xl grayscale opacity-60">
              <div className="p-3 bg-slate-800 rounded-2xl">
                <Zap className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">AI Mind Mapper</h4>
                <p className="text-slate-500 text-sm">Visualize your knowledge automatically.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-slate-900/20 border border-slate-800 rounded-3xl grayscale opacity-60">
              <div className="p-3 bg-slate-800 rounded-2xl">
                <Rocket className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Collaborative Study</h4>
                <p className="text-slate-500 text-sm">Learn together in real-time rooms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}