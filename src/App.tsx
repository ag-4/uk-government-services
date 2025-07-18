import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Crown, Users, FileText, MessageSquare, Vote, Phone, AlertCircle, Mail, Building2, MapPin, Bot } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import { MPSearch } from './components/MPSearch';
import MessageTemplates from './components/MessageTemplates';
import { NewsletterSubscription } from './components/NewsletterSubscription';
import { Footer } from './components/Footer';
import CitizenRights from './components/CitizenRights';
import VotingInfo from './components/VotingInfo';
import CallToAction from './components/CallToAction';
import LocalCouncilLookup from './components/LocalCouncilLookup';
import BillTracker from './components/BillTracker';
import ConstituencyMapView from './components/ConstituencyMapView';
import AIExplainBill from './components/AIExplainBill';
import ErrorBoundaryNew from './components/EnhancedErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundaryNew>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <Routes>
            <Route path="/" element={<AppContent />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ErrorBoundaryNew>
  );
}

function AppContent() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="pt-16">
      {/* Navigation Pills */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-3 overflow-x-auto">
            <NavPill onClick={() => scrollToSection('home')} active={activeSection === 'home'} icon={Crown}>
              Home
            </NavPill>
            <NavPill onClick={() => scrollToSection('news')} active={activeSection === 'news'} icon={FileText}>
              News & Updates
            </NavPill>
            <NavPill onClick={() => scrollToSection('mp-search')} active={activeSection === 'mp-search'} icon={Users}>
              Find Your MP
            </NavPill>
            <NavPill onClick={() => scrollToSection('council-lookup')} active={activeSection === 'council-lookup'} icon={Building2}>
              Local Council
            </NavPill>
            <NavPill onClick={() => scrollToSection('bill-tracker')} active={activeSection === 'bill-tracker'} icon={FileText}>
              Bill Tracker
            </NavPill>
            <NavPill onClick={() => scrollToSection('constituency-map')} active={activeSection === 'constituency-map'} icon={MapPin}>
              Constituency Map
            </NavPill>
            <NavPill onClick={() => scrollToSection('ai-explain')} active={activeSection === 'ai-explain'} icon={Bot}>
              AI Bill Explainer
            </NavPill>
            <NavPill onClick={() => scrollToSection('templates')} active={activeSection === 'templates'} icon={MessageSquare}>
              Contact Templates
            </NavPill>
            <NavPill onClick={() => scrollToSection('newsletter')} active={activeSection === 'newsletter'} icon={Mail}>
              Newsletter
            </NavPill>
            <NavPill onClick={() => scrollToSection('rights')} active={activeSection === 'rights'} icon={AlertCircle}>
              Your Rights
            </NavPill>
            <NavPill onClick={() => scrollToSection('voting')} active={activeSection === 'voting'} icon={Vote}>
              Voting Guide
            </NavPill>
            <NavPill onClick={() => scrollToSection('action')} active={activeSection === 'action'} icon={Phone}>
              Get Involved
            </NavPill>
          </nav>
        </div>
      </div>

      {/* Page Sections */}
      <div id="home">
        <Hero />
      </div>
      
      <div id="news" className="scroll-mt-32">
        <NewsSection />
      </div>
      
      <div id="mp-search" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <MPSearch />
        </ErrorBoundaryNew>
      </div>
      
      <div id="council-lookup" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <LocalCouncilLookup />
        </ErrorBoundaryNew>
      </div>
      
      <div id="bill-tracker" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <BillTracker />
        </ErrorBoundaryNew>
      </div>
      
      <div id="constituency-map" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <ConstituencyMapView />
        </ErrorBoundaryNew>
      </div>
      
      <div id="ai-explain" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <AIExplainBill />
        </ErrorBoundaryNew>
      </div>
      
      <div id="templates" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <MessageTemplates />
        </ErrorBoundaryNew>
      </div>
      
      <div id="newsletter" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <NewsletterSubscription />
            </div>
          </section>
        </ErrorBoundaryNew>
      </div>
      
      <div id="rights" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <CitizenRights />
        </ErrorBoundaryNew>
      </div>
      
      <div id="voting" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <VotingInfo />
        </ErrorBoundaryNew>
      </div>
      
      <div id="action" className="scroll-mt-32">
        <ErrorBoundaryNew>
          <CallToAction />
        </ErrorBoundaryNew>
      </div>
    </main>
  );
}

interface NavPillProps {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

function NavPill({ children, onClick, active, icon: Icon }: NavPillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'text-gray-600 hover:text-primary hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </button>
  );
}

export default App;