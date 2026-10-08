import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { ScreenState } from '../types';

interface NavbarProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  return (
    <header className="bg-[#0B1220] border-b border-[#1E293B] sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white block">
              ScamShield AI
            </span>
            <span className="text-[11px] text-[#94A3B8] font-normal leading-none hidden sm:block">
              Before You Trust a Message, Check It.
            </span>
          </div>
        </button>

        {/* Navigation Action */}
        <div className="flex items-center gap-3">
          {currentScreen !== 'analyzer' ? (
            <button
              onClick={() => onNavigate('analyzer')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <span>Analyze a Message</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className="text-xs sm:text-sm text-[#94A3B8] hover:text-white font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
