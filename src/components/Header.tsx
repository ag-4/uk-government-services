import React from 'react';
import { Crown, Menu, X } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 uk-gov-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-accent" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">Unofficial Gov Services</h1>
                <p className="text-sm opacity-90">United Kingdom</p>
              </div>
            </div>
          </div>

          {/* Government Badge */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/images/union-jack.jpg" 
                alt="Union Jack" 
                className="w-8 h-6 rounded border border-white/20"
              />
              <span className="text-sm font-medium">Unofficial Government Service</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md hover:bg-primary/10 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Government Notice Bar */}
      <div className="bg-accent text-accent-foreground py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium">
            This is an unofficial UK Government service for citizen engagement and information
          </p>
        </div>
      </div>
    </header>
  );
}