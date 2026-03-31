import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Bot } from 'lucide-react';
// 💡 Firebase Functions වලට අදාළ දේවල් Import කළා
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export default function AiTutor({ topic, pathwayTitle }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi! I'm your AI Tutor Nimna. I see you're learning about "${topic}". How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // 🚀 පරණ Fetch Call එක වෙනුවට Firebase Cloud Function එකට කතා කරනවා
      const askAiTutor = httpsCallable(functions, 'askAiTutor');
      
      const result = await askAiTutor({ 
        userMessage: userMessage, 
        topic: topic, 
        pathwayTitle: pathwayTitle 
      });

      // 💡 Cloud Function එකෙන් එන දත්ත තියෙන්නේ result.data ඇතුළේ
      const botResponse = result.data;
      
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to Nimna. Please try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[450px] w-full bg-slate-900/20 rounded-2xl overflow-hidden border border-slate-800/50">
      
      {/* 💬 Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/30">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-cyan-500 shadow-cyan-500/20' : 'bg-purple-600 shadow-purple-600/20'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-cyan-500 text-slate-900 font-bold rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50 shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            </div>
            Nimna is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ⌨️ Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-800/40 border-t border-slate-700/30 flex gap-2 backdrop-blur-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Nimna anything..."
          className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

    </div>
  );
}