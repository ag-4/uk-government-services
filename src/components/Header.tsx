import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Search, FileText, Mail, Users, Vote, Phone, Eye, Settings, Zap, Building2, Bot, MessageSquare } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/parliament', label: 'Parliament', icon: Eye },
    { path: '/services', label: 'Services', icon: Settings },
    { path: '/templates', label: 'Templates', icon: MessageSquare },
    { path: '/mp-search', label: 'Find MP', icon: Search },
    { path: '/council-lookup', label: 'Find Council', icon: Building2 },
    { path: '/bill-tracker', label: 'Bills', icon: FileText },
    { path: '/ai-assistant', label: 'AI Help', icon: Zap },
    { path: '/rights', label: 'Your Rights', icon: Users },
    { path: '/voting', label: 'Voting', icon: Vote },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
            : 'bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/images/govwhiz-logo.svg" 
                alt="GOVWHIZ Logo" 
                className="h-8 w-auto"
                loading="eager"
                decoding="sync"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
              {navigationItems.slice(0, 9).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <nav
        id="mobile-menu"
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        
        <div className="py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 w-full px-6 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-inset ${
                  isActive 
                    ? 'text-primary bg-primary/10 border-r-2 border-primary' 
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            GOVWHIZ - Connecting Citizens with Government
          </p>
        </div>
      </nav>
    </>
  );
};

export default Header;