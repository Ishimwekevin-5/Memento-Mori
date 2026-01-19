
import React from 'react';
import { YearStats } from '../types';

interface HeaderProps {
  stats: YearStats;
  onYearChange: (year: number) => void;
  isFullscreen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ stats, onYearChange, isFullscreen }) => {
  return (
    <header className="text-center mb-10 space-y-4 relative font-saira zen-transition">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center">
          {!isFullscreen && (
            <button 
              onClick={() => onYearChange(stats.year - 1)}
              className="text-white/10 hover:text-white transition-all px-8 text-5xl align-middle active:scale-75 focus:outline-none focus:text-white"
              aria-label={`Go to previous year: ${stats.year - 1}`}
            >
              &larr;
            </button>
          )}

          <div className="flex flex-col items-center">
            <div className="flex items-baseline">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white inline-block">
                {stats.year}
              </h1>
              {/* "Days" label previously here has been removed per user request */}
            </div>
          </div>

          {!isFullscreen && (
            <button 
              onClick={() => onYearChange(stats.year + 1)}
              className="text-white/10 hover:text-white transition-all px-8 text-5xl align-middle active:scale-75 focus:outline-none focus:text-white"
              aria-label={`Go to next year: ${stats.year + 1}`}
            >
              &rarr;
            </button>
          )}
        </div>

        <p className="text-2xl md:text-3xl font-light text-white/60 tracking-widest uppercase flex items-center gap-3">
          <span className="opacity-40">(</span> {stats.daysLeft} <span className="opacity-40">)</span> 
          <span className="text-white/20 ml-1">Days Remains</span>
        </p>
      </div>
    </header>
  );
};

export default Header;
