import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import OnboardingWizard from './components/OnboardingWizard';
import CourseSelection from './components/CourseSelection';
import Dashboard from './components/Dashboard';
import PublicPortfolio from './components/PublicPortfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/select-course" element={<CourseSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<PublicPortfolio courseType="CS" />} />
        <Route path="/portfolio/education" element={<PublicPortfolio courseType="Education" />} />
        <Route path="/portfolio/business" element={<PublicPortfolio courseType="Business" />} />
      </Routes>
    </Router>
  );
}

export default App;
