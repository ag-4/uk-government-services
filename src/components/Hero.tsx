import React, { useRef, useEffect } from 'react';
import { ArrowRight, Users, FileText, Vote, ChevronDown } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('council-search');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Add focus management for accessibility
    if (heroRef.current) {
      heroRef.current.focus();
    }
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white"
      role="banner"
      aria-label="UK Government Services Platform Hero Section"
      tabIndex={-1}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-black/20">
        <img 
          src="/images/parliament-house.jpg" 
          alt="UK Parliament Building - Houses of Parliament in Westminster, London" 
          className="w-full h-full object-cover mix-blend-overlay"
          loading="eager"
          decoding="async"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-accent px-3 py-1 rounded-full text-sm font-medium">
                <span>🇬🇧</span>
                <span>GOVWHIZ Portal</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="sr-only">GOVWHIZ - </span>
                Your Voice in
                <span className="text-accent block">British Democracy</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                Connect with your representatives, stay informed about legislation, 
                and participate actively in British democratic processes.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('council-search')}
                className="uk-gov-accent inline-flex items-center justify-center space-x-2 text-lg focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
                aria-label="Navigate to council search section"
              >
                <Users className="w-5 h-5" aria-hidden="true" />
                <span>Find Your Council</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              
              <button 
                onClick={() => scrollToSection('news')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 transition-colors inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-medium text-lg focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label="Navigate to latest news section"
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
                <span>Latest News</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">20K+</div>
                <div className="text-sm text-white/80">Council Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">67M</div>
                <div className="text-sm text-white/80">UK Citizens</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-white/80">Democratic Access</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Find Your Representative"
              description="Search for your local council members by postcode and get their contact information"
          onClick={() => scrollToSection('council-search')}
            />
            
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Stay Informed"
              description="AI-powered summaries of parliamentary sessions, new laws, and proposed legislation"
              onClick={() => scrollToSection('news')}
            />
            
            <FeatureCard
              icon={<Vote className="w-6 h-6" />}
              title="Learn to Vote"
              description="Complete guide to voter registration and participating in UK elections"
              onClick={() => scrollToSection('voting')}
            />
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={scrollToNextSection}
            className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
            aria-label="Scroll to next section"
          >
            <ChevronDown className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function FeatureCard({ icon, title, description, onClick }: FeatureCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all cursor-pointer group"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 p-2 bg-accent rounded-lg text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-white/80 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}