import { ShieldCheck } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" icon={ShieldCheck}>
      <section>
        <h2>🚀 Getting Started</h2>
        <p>Welcome to G-Learn! Our platform is designed to help you navigate your educational journey using advanced AI tools. To begin, create an account using your email or social logins. Once verified, you can access your personalized dashboard.</p>
        
        <h3>How do I verify my account?</h3>
        <p>After signing up, check your email inbox for a verification link. Clicking this link activates your account. If you don't see it, please check your <strong>Spam</strong> or <strong>Promotions</strong> folder.</p>
      </section>

      <section>
        <h2>🗺️ AI Learning Roadmaps</h2>
        <p>This is the heart of G-Learn. Our AI analyzes your learning goals to create a structured path.</p>
        
        <h3>How to generate a Roadmap?</h3>
        <p>Go to the <strong>Roadmap Maker</strong>, type in a subject (e.g., "Quantum Physics" or "React Development"), and click <strong>Generate</strong>. The AI will build three levels: Beginner, Intermediate, and Advanced.</p>
        
        <h3>Can I save my roadmaps?</h3>
        <p>Yes! Click the <strong>"Start This Pathway Now"</strong> button to import any generated roadmap directly into your Dashboard. You can then track your progress step-by-step.</p>
      </section>

      <section>
        <h2>🤖 Interacting with AI Tutor (Nimna)</h2>
        <p>Nimna is your 24/7 personal tutor powered by Gemini. You can find the AI Tutor widget inside your <strong>Learning Bench</strong>.</p>
        <ul>
          <li><strong>Contextual Learning:</strong> Nimna knows exactly which topic you are currently studying.</li>
          <li><strong>Ask Anything:</strong> If a lesson is unclear, just ask "Can you explain this in simpler terms?" or "Give me a real-world example."</li>
          <li><strong>Code Help:</strong> Nimna can help debug or explain complex code snippets instantly.</li>
        </ul>
      </section>

      <section>
        <h2>🛠️ Productivity Tools</h2>
        <p>We provide built-in tools to keep you focused and organized:</p>
        <ul>
          <li><strong>Focus Timer:</strong> Uses the Pomodoro technique to break your work into manageable sessions.</li>
          <li><strong>Personal Notes:</strong> A rich-text editor to document your learnings. All notes are saved to your cloud profile.</li>
          <li><strong>Smart To-Do:</strong> Keep a checklist of tasks related to your current study session.</li>
        </ul>
      </section>

      <section>
        <h2>✍️ Creator Studio</h2>
        <p>Want to share your knowledge? Register as a <strong>Creator</strong> to write blog posts in our Knowledge Hub.</p>
        <p>Once approved, you can use the Creator Studio to format articles, upload cover images, and reach thousands of learners on the platform.</p>
      </section>

      <section>
        <h2>📩 Still need help?</h2>
        <p>If your question isn't answered here, our support team is ready to assist you. Contact us at <strong>support@glearn.com</strong> and we'll get back to you within 24 hours.</p>
      </section>
    </LegalLayout>
  );
}