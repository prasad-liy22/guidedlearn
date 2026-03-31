import { FileText, Scale, AlertCircle, UserCheck, ShieldAlert, Globe } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

export default function TermsOfService() {
  const lastUpdated = "April 1, 2026";
  return (
    <LegalLayout title="Terms of Service" icon={FileText}>
      
      <p className="text-slate-500 italic mb-8">Last Updated: {lastUpdated}</p>

      <p className="lead">
        Please read these Terms of Service carefully before using G-Learn. By accessing our platform, you agree to be bound by these rules. These terms protect both you as a learner and G-Learn as a provider.
      </p>

      {/* ⚖️ 1. Acceptance of Terms */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="text-cyan-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Acceptance of Terms</h2>
        </div>
        <p>By creating an account or using any feature of G-Learn (including the AI Roadmap Maker, AI Tutor, and Knowledge Hub), you acknowledge that you have read, understood, and agreed to these Terms of Service and our Privacy Policy.</p>
      </section>

      {/* 👤 2. User Accounts */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="text-cyan-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">User Accounts</h2>
        </div>
        <p>To access certain features, you must register for an account. You agree to:</p>
        <ul>
          <li>Provide accurate and complete information during registration.</li>
          <li>Maintain the security of your password and account details.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
          <li>Be responsible for all activities that occur under your account.</li>
        </ul>
      </section>

      {/* 🤖 3. Use of AI Services (Critical for your app) */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-amber-500 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">AI Usage Disclaimer</h2>
        </div>
        <p>G-Learn provides AI-generated content through the Roadmap Maker and Nimna (AI Tutor). While we strive for high accuracy, please note:</p>
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
          <p className="text-sm !m-0 text-amber-200 italic">
            "AI-generated content is for educational guidance only. We do not guarantee the 100% accuracy, completeness, or timeliness of roadmaps or tutor responses. Users should cross-reference important information with official academic sources."
          </p>
        </div>
      </section>

      {/* ✍️ 4. Content Ownership */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="text-cyan-400 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Intellectual Property</h2>
        </div>
        <p><strong>Our Content:</strong> All platform designs, code, and AI algorithms are the property of G-Learn.</p>
        <p><strong>Your Content:</strong> When you publish a blog as a Creator, you retain ownership of your content. However, by publishing on G-Learn, you grant us a non-exclusive license to host, display, and distribute that content to our users.</p>
      </section>

      {/* 🚫 5. Prohibited Conduct */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="text-rose-500 w-5 h-5" />
          <h2 className="text-white text-2xl font-black !m-0">Prohibited Conduct</h2>
        </div>
        <p>You agree not to use the platform to:</p>
        <ul>
          <li>Reverse engineer, scrape, or attempt to extract the source code of G-Learn.</li>
          <li>Use AI tools to generate harmful, illegal, or unethical content.</li>
          <li>Impersonate any person or entity or misrepresent your affiliation.</li>
          <li>Spam the community hub with commercial advertisements.</li>
        </ul>
      </section>

      {/* 🔚 6. Termination */}
      <section className="mb-12">
        <h2 className="text-white text-2xl font-black mb-4">Termination of Service</h2>
        <p>We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or the platform’s integrity.</p>
      </section>

      {/* 📧 Contact */}
      <section className="mt-16 pt-8 border-t border-slate-800 text-center">
        <h2 className="text-white text-xl font-bold mb-2">Questions about our Terms?</h2>
        <p className="text-slate-400">If you have any inquiries regarding these terms, please contact our legal team at:</p>
        <p className="text-cyan-400 font-black">legal@glearn.com</p>
      </section>

    </LegalLayout>
  );
}