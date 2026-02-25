import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AboutPage from './components/pages/AboutPage';
import ServicesPage from './components/pages/ServicesPage';
import PrivacyPage from './components/pages/PrivacyPage';
import ContactPage from './components/pages/ContactPage';
import TermsPage from './components/pages/TermsPage';
import DisclaimerPage from './components/pages/DisclaimerPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Emergency from './components/Emergency';
import Chat from './components/Chat';
import Community from './components/Community';
import ThoughtOfTheWeek from './components/ThoughtOfTheWeek';
import NotFound from './components/NotFound';

// Exercises
import ExerciseHub from './components/exercises/ExerciseHub';
import BoxBreathing from './components/exercises/BoxBreathing';
import MuscleRelaxation from './components/exercises/MuscleRelaxation';
import GroundingExercise from './components/exercises/GroundingExercise';
import BodyScan from './components/exercises/BodyScan';

import { STORAGE_KEYS } from './utils/storage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [theme, setTheme] = useState('light');
  const [thought, setThought] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <Router>
      <ScrollToTop />
      <div className={`app ${theme}`}>
        <Header
          toggleSidebar={toggleSidebar}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={closeSidebar}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/community" element={<Community />} />

            {/* Exercises */}
            <Route path="/exercises" element={<ExerciseHub />} />
            <Route path="/exercises/box-breathing" element={<BoxBreathing />} />
            <Route path="/exercises/muscle-relaxation" element={<MuscleRelaxation />} />
            <Route path="/exercises/grounding" element={<GroundingExercise />} />
            <Route path="/exercises/body-scan" element={<BodyScan />} />

            {/* Info Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
