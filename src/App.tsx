import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { Footer } from './components/Footer';
import ErrorBoundaryNew from './components/EnhancedErrorBoundary';

// Page Components
import HomePage from './pages/HomePage';
import ParliamentPage from './pages/ParliamentPage';
import PetitionsPage from './pages/PetitionsPage';
import ServicesPage from './pages/ServicesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SecurityPage from './pages/SecurityPage';
import LocalServicesPage from './pages/LocalServicesPage';
import NewsPage from './pages/NewsPage';
import CouncilLookupPage from './pages/CouncilLookupPage';
import MPSearchPage from './pages/MPSearchPage';
import BillTrackerPage from './pages/BillTrackerPage';
import AIExplainPage from './pages/AIExplainPage';
import TemplatesPage from './pages/TemplatesPage';
import NewsletterPage from './pages/NewsletterPage';
import RightsPage from './pages/RightsPage';
import VotingPage from './pages/VotingPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AccessibilityPage from './pages/AccessibilityPage';
import AboutPage from './pages/AboutPage';

import './App.css';

function App() {
  return (
    <ErrorBoundaryNew>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16 min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/parliament" element={<ParliamentPage />} />
              <Route path="/petitions" element={<PetitionsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/local-services" element={<LocalServicesPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/council-lookup" element={<CouncilLookupPage />} />
              <Route path="/mp-search" element={<MPSearchPage />} />
              <Route path="/bill-tracker" element={<BillTrackerPage />} />
              <Route path="/ai-explain" element={<AIExplainPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="/rights" element={<RightsPage />} />
              <Route path="/voting" element={<VotingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundaryNew>
  );
}

export default App;