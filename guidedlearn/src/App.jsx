import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navBar';
import Home from './pages/home';
import CoursesPage from './pages/course';
import RoadmapMaker from './pages/roadmapMaker';
import Blogs from './pages/Blogs';
import Tools from './pages/Tools';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EmailVerification from './pages/EmailVerification';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import LearningBench from './pages/LearningBench';

// --- ප්‍රධාන App Component එක ---
function App() {
  const location = useLocation(); // දැනට ඉන්න පිටුව හොයාගන්නවා
  
  // Navbar එක හැංගිය යුතු පිටු ලැයිස්තුව
  const hideNavbarRoutes = ['/signin', '/signup', '/verify-email'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 font-sans text-slate-100">
      
      {/* 🔔 මේක දැම්මම මුළු App එකේම ඕනේ තැනක ඉඳන් Notifications පෙන්වන්න පුළුවන් */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* shouldHideNavbar එක බොරු (false) නම් විතරක් Navbar එක පෙන්වන්න */}
      {!shouldHideNavbar && <Navbar />}
      
      <div className={shouldHideNavbar ? "" : "pb-12"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          {/* 🔒 ලොග් වුණු අයට විතරක් පේන පිටු (Protected Routes) */}
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
  path="/pathway/:id" 
  element=
  {<LearningBench />} />


              </Routes>
      </div>
      
    </div>
  );
} 

export default App;