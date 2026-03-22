import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import OnboardingWizard from './components/OnboardingWizard';
import CourseSelection from './components/CourseSelection';
import Dashboard from './components/Dashboard';
import PublicPortfolio from './components/PublicPortfolio';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes */}
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />
          <Route path="/select-course" element={<ProtectedRoute><CourseSelection /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Public Views */}
          <Route path="/u/:username" element={<PublicPortfolio />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
