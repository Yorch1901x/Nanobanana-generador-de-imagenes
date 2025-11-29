
import React from 'react';
import { ASSETS } from '../utils/assets';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/90 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={ASSETS.logoFull} 
            alt="Luximed Logo" 
            className="h-12 object-contain" // Slightly larger for better visibility
          />
          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
          <span className="text-slate-400 font-medium hidden sm:block">
            Creative Studio
          </span>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-xs font-semibold px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
            AI Powered
          </div>
        </div>
      </div>
    </header>
  );
};
