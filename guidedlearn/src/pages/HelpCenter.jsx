import { HelpCircle, Sparkles, Map, BookOpen, PenTool, ShieldCheck, Mail } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

export default function HelpCenter() {
  return (
    <LegalLayout title="Help Center" icon={HelpCircle}>
      
      {/* 🚀 1. Getting Started */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-cyan-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Getting Started</h2>
        </div>
        <p>Welcome to G-Learn! Our mission is to simplify self-learning through AI. To begin, sign up for a free account. Once you verify your email, you will gain access to your personalized Learning Dashboard where you can manage your active pathways and track your study stats.</p>
        
        <h3 className="text-white font-bold mt-6">Account Verification</h3>
        <p>If you haven't received your verification email, please check your <strong>Spam</strong> or <strong>Updates</strong> folder. Account verification is mandatory to save progress and use AI tools.</p>
      </section>

      {/* 🗺️ 2. AI Roadmap Maker */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Map className="text-cyan-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">AI Learning Roadmaps</h2>
        </div>
        <p>G-Learn uses advanced AI to generate structured learning paths for any skill. Simply enter a topic in the "Roadmap Maker" (e.g., <em>"Cyber Security"</em> or <em>"Cooking Italian Cuisine"</em>), and our AI will instantly build a 3-level guide (Beginner, Intermediate, and Advanced).</p>
        
        <h3 className="text-white font-bold mt-6">Importing to Dashboard</h3>
        <p>When you see a roadmap you like, click <strong>"Start This Pathway Now"</strong>. This imports the entire curriculum into your personal database, allowing you to mark topics as complete and track your overall percentage.</p>
      </section>

      {/* 🤖 3. AI Tutor (Nimna) */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="text-cyan-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Meet Nimna: Your AI Tutor</h2>
        </div>
        <p>Nimna is our custom AI assistant integrated directly into your workspace. Unlike general chatbots, Nimna is context-aware—it knows exactly which lesson you are currently studying.</p>
        <ul>
          <li><strong>How to use:</strong> Open any active pathway and click the "AI Tutor" widget.</li>
          <li><strong>Ask Questions:</strong> You can ask "Can you explain this with an example?" or "Debug this code for me."</li>
          <li><strong>24/7 Availability:</strong> Your tutor is always ready, no matter what time zone you're in.</li>
        </ul>
      </section>

      {/* 🛠️ 4. The Learning Bench Tools */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-cyan-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Productivity Suite</h2>
        </div>
        <p>Inside the Learning Bench, we provide three essential tools to keep you organized:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
            <h4 className="text-cyan-400 font-bold mb-2">Focus Timer</h4>
            <p className="text-sm !m-0">A built-in Pomodoro timer to manage deep work sessions and prevents burnout.</p>
          </div>
          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
            <h4 className="text-cyan-400 font-bold mb-2">Personal Notes</h4>
            <p className="text-sm !m-0">A rich-text editor that saves your notes to the cloud. Access them from any device.</p>
          </div>
        </div>
      </section>

      {/* ✍️ 5. Creator Hub & Blogs */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <PenTool className="text-cyan-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Creator Hub</h2>
        </div>
        <p>G-Learn is also a community. If you are an expert in a field, you can register as a <strong>Creator</strong>. Once approved, you can write articles, share insights, and build your profile in our Knowledge Hub.</p>
      </section>

      {/* 📩 6. Support */}
      <section className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl text-center">
        <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="text-cyan-400 w-6 h-6" />
        </div>
        <h2 className="text-white text-xl font-bold !m-0 mb-2">Still need help?</h2>
        <p className="!m-0 text-slate-400">Our support team is available 24/7. Reach out to us at:</p>
        <a href="mailto:support@glearn.com" className="text-cyan-400 font-black text-lg hover:underline transition-all">support@glearn.academy</a>
      </section>

    </LegalLayout>
  );
}