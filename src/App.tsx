import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import OnboardingWizard from './components/OnboardingWizard';
import CourseSelection from './components/CourseSelection';
import Dashboard from './components/Dashboard';
import PublicPortfolio from './components/PublicPortfolio';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col h-screen overflow-hidden bg-background">
          <Navbar />
          <div className="flex-1 overflow-hidden relative">
            <Routes>
              <Route path="/" element={<div className="h-full overflow-y-auto"><LandingPage /></div>} />
              
              {/* Protected Routes */}
              <Route path="/onboarding" element={<ProtectedRoute><div className="h-full overflow-y-auto"><OnboardingWizard /></div></ProtectedRoute>} />
              <Route path="/select-course" element={<ProtectedRoute><div className="h-full overflow-y-auto"><CourseSelection /></div></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* Public Views */}
              <Route path="/u/:username" element={<div className="h-full overflow-y-auto"><PublicPortfolio /></div>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
