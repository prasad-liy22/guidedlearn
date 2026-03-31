import { Users, Heart, ShieldAlert, MessageSquare, BookCheck, Ban } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

export default function CommunityGuidelines() {
  return (
    <LegalLayout title="Community Guidelines" icon={Users}>
      
      <p className="lead">
        G-Learn is built to be a safe, supportive, and highly effective environment for students and lifelong learners. To maintain this atmosphere, we expect every member to follow these core principles.
      </p>

      {/* 🤝 1. Respect & Inclusivity */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-pink-500 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Respect & Inclusivity</h2>
        </div>
        <p>Treat every member of the community with kindness. We are all here to learn, and everyone starts somewhere. Harassment, bullying, or discrimination based on race, gender, religion, or technical ability will not be tolerated.</p>
        <ul>
          <li>Be constructive when giving feedback on others' blogs or projects.</li>
          <li>Avoid aggressive language or personal attacks.</li>
        </ul>
      </section>

      {/* 📚 2. Content Integrity & Quality */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <BookCheck className="text-cyan-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Content Integrity</h2>
        </div>
        <p>If you are a registered Creator, you have a responsibility to keep our Knowledge Hub clean and accurate.</p>
        <ul>
          <li><strong>No Plagiarism:</strong> Always credit your sources. Don't copy-paste articles from other sites.</li>
          <li><strong>Accuracy Matters:</strong> Ensure the educational content you share is well-researched and factually correct.</li>
          <li><strong>No Clickbait:</strong> Your blog titles should accurately reflect the content inside.</li>
        </ul>
      </section>

      {/* 🚫 3. Prohibited Activities */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Ban className="text-rose-500 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Prohibited Actions</h2>
        </div>
        <p>To keep the platform running smoothly for everyone, the following actions are strictly banned:</p>
        <ul>
          <li><strong>Spamming:</strong> Posting repetitive comments, ads, or unsolicited promotional links.</li>
          <li><strong>Malicious Use:</strong> Attempting to scrape data, bypass security features, or distribute malware.</li>
          <li><strong>AI Misuse:</strong> Using the AI Tutor or Roadmap Maker to generate harmful or illegal content.</li>
        </ul>
      </section>

      {/* 🤖 4. Responsible AI Interaction */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-purple-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">AI Interaction</h2>
        </div>
        <p>Our AI tools like Nimna are designed for learning. We encourage users to push the boundaries of their curiosity but ask that you maintain a level of professionalism when interacting with AI services.</p>
      </section>

      {/* ⚖️ 5. Enforcement & Reporting */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="text-amber-500 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Enforcement</h2>
        </div>
        <p>Failure to comply with these guidelines may result in the following actions:</p>
        <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
          <ul className="!mb-0">
            <li><strong>Warning:</strong> For minor or first-time offenses.</li>
            <li><strong>Content Removal:</strong> Deletion of blogs or comments that violate our rules.</li>
            <li><strong>Account Suspension:</strong> Temporary or permanent ban for serious or repeat violations.</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 p-6 border-t border-slate-800 text-center">
        <p className="italic text-slate-500">
          See something that violates these rules? Report it to us at <span className="text-cyan-400 font-bold">report@glearn.academy</span>. Help us keep G-Learn a place for growth!
        </p>
      </section>

    </LegalLayout>
  );
}