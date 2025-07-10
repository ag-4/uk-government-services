import React from 'react';
import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img 
              src="/images/govwhiz-logo.svg" 
              alt="GOVWHIZ Logo" 
              className="w-8 h-8"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">GOVWHIZ</h1>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}