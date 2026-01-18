
import React, { useState, useRef, useEffect } from 'react';
import { YearStats } from '../types';

interface HeaderProps {
  stats: YearStats;
  onYearChange: (year: number) => void;
}

const Header: React.FC<HeaderProps> = ({ stats, onYearChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(stats.year.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: 201 }, (_, i) => 1900 + i);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Focus trap logic for the year input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing) return;
      if (e.key === 'Escape') setIsEditing(false);
      if (e.key === 'Enter') handleInputSubmit(e as any);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, inputValue]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newYear = parseInt(inputValue);
    if (!isNaN(newYear) && newYear >= 1900 && newYear <= 2100) {
      onYearChange(newYear);
      setIsEditing(false);
    } else {
      setInputValue(stats.year.toString());
      setIsEditing(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    onYearChange(newYear);
    setIsEditing(false);
  };

  return (
    <div className="text-center mb-10 space-y-4 relative" ref={containerRef}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center">
          <button 
            onClick={() => onYearChange(stats.year - 1)}
            className="text-white/20 hover:text-white transition-colors px-4 text-4xl align-middle"
            aria-label="Previous Year"
          >
            &larr;
          </button>

          <div className="relative group flex items-center">
            {isEditing ? (
              <form onSubmit={handleInputSubmit} className="inline-block relative">
                <input
                  ref={inputRef}
                  type="number"
                  min="1900"
                  max="2100"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleInputSubmit}
                  className="bg-transparent border-b-2 border-white text-6xl md:text-7xl font-serif font-black tracking-tight text-center w-48 focus:outline-none appearance-none ring-4 ring-white/10 rounded-lg py-2"
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-white/40">
                  Editing Year
                </div>
              </form>
            ) : (
              <div 
                className="relative cursor-pointer transition-transform active:scale-95" 
                onClick={() => setIsEditing(true)}
              >
                <h1 className="text-6xl md:text-7xl font-serif font-black tracking-tight hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all inline-block px-2">
                  {stats.year}
                </h1>
                <span className="block text-[10px] absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity uppercase tracking-widest whitespace-nowrap">
                  Tap to Edit
                </span>
                
                {/* Mobile Native Spinner Trigger */}
                <select 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full md:hidden"
                  value={stats.year}
                  onChange={handleSelectChange}
                  aria-label="Select Year"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}
            
            <span className="text-6xl md:text-7xl font-serif font-black tracking-tight ml-4 pointer-events-none">
              In Days
            </span>

            {/* Desktop-only dropdown indicator */}
            {!isEditing && (
              <div className="hidden md:flex ml-4 opacity-20 group-hover:opacity-100 transition-opacity items-center">
                 <select 
                  className="bg-[#0f0f0f] text-white/60 border border-white/10 rounded px-2 py-1 cursor-pointer focus:outline-none hover:border-white/40 text-sm font-medium"
                  value={stats.year}
                  onChange={handleSelectChange}
                >
                  {years.map(y => (
                    <option key={y} value={y} className="bg-[#050505] text-white">{y}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button 
            onClick={() => onYearChange(stats.year + 1)}
            className="text-white/20 hover:text-white transition-colors px-4 text-4xl align-middle"
            aria-label="Next Year"
          >
            &rarr;
          </button>
        </div>

        <p className="text-xl md:text-2xl font-serif text-white/70 italic">
          {stats.daysLeft} Days Left
        </p>
      </div>
    </div>
  );
};

export default Header;
