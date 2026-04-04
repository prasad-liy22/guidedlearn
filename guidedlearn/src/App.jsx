import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CoursesPage from './pages/course';
import RoadmapMaker from './pages/RoadmapMaker';
import Blogs from './pages/Blogs';
import Tools from './pages/Tools';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EmailVerification from './pages/EmailVerification';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import LearningBench from './pages/LearningBench';
import CreatorRegistration from './pages/CreatorRegistration';
import CreateBlog from './pages/CreateBlog';
import BlogEditor from './pages/BlogEditor';
import BlogView from './pages/BlogView';
import Profile from './pages/Profile';
import TermsOfService from './pages/TermsOfService';
import HelpCenter from './pages/HelpCenter';
import CommunityGuidelines from './pages/CommunityGuidelines';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ['/signin', '/signup', '/verify-email'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  console.log("3. App.jsx එක Render වෙනවා");

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 font-sans text-slate-100">

      <Toaster position="top-right" reverseOrder={false} />
      
      {!shouldHideNavbar && <Navbar />}

          <ScrollToTop />
      <div className={shouldHideNavbar ? "" : "pb-12"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/community-guide-lines" element={<CommunityGuidelines />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapMaker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools"
            element={
              <ProtectedRoute>
                <Tools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator-registration"
            element={
              <ProtectedRoute>
                <CreatorRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-blog"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pathway/:id"
            element=
            {<LearningBench />} />

          <Route path="/blog-editor" element={<BlogEditor />} />
          <Route path="/edit-blog/:id" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogView />} />
          <Route path="/profile" element={<Profile />} /> 

        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;