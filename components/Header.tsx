
import React from 'react';
import { YearStats } from '../types';

interface HeaderProps {
  stats: YearStats;
  onYearChange: (year: number) => void;
}

const Header: React.FC<HeaderProps> = ({ stats, onYearChange }) => {
  return (
    <div className="text-center mb-16 space-y-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-6xl md:text-7xl font-serif font-black tracking-tight">
          <button 
            onClick={() => onYearChange(stats.year - 1)}
            className="text-white/20 hover:text-white transition-colors px-4 text-4xl align-middle"
          >
            &larr;
          </button>
          {stats.year} In Days
          <button 
            onClick={() => onYearChange(stats.year + 1)}
            className="text-white/20 hover:text-white transition-colors px-4 text-4xl align-middle"
          >
            &rarr;
          </button>
        </h1>
        <p className="text-xl md:text-2xl font-serif text-white/70 italic">
          {stats.daysLeft} Days Left
        </p>
      </div>
      
      <div className="pt-8 text-2xl md:text-3xl font-serif tracking-wide text-white/90">
        "It's not a lot of time, is it?"
      </div>
    </div>
  );
};

export default Header;
