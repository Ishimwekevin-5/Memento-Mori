
import React, { useEffect, useRef } from 'react';
import { DayData } from '../types';
import { formatDate } from '../utils';

interface DayGridProps {
  days: DayData[];
  onSelectDay: (day: DayData) => void;
  isFullscreen?: boolean;
}

const DayGrid: React.FC<DayGridProps> = ({ days, onSelectDay, isFullscreen }) => {
  const todayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isFullscreen && todayRef.current) {
      // Use a small timeout to allow the layout transition to start
      const timer = setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen]);

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-0 font-saira" aria-label="Year progression grid">
      <div 
        className="grid grid-cols-[repeat(auto-fill,minmax(14px,1fr))] md:grid-cols-[repeat(31,1fr)] gap-2 md:gap-3 justify-items-center"
        role="grid"
      >
        {days.map((day) => (
          <button
            key={day.dayNumber}
            ref={day.isToday ? todayRef : null}
            onClick={() => onSelectDay(day)}
            aria-label={`Day ${day.dayNumber}: ${formatDate(day.date)}. ${day.isPast ? 'Passed' : day.isToday ? 'Today' : 'Future'}`}
            title={formatDate(day.date)}
            role="gridcell"
            className={`
              w-3.5 h-3.5 md:w-4.5 md:h-4.5 rounded-sm cursor-pointer transition-all duration-300 transform hover:scale-150 relative group focus:outline-none focus:ring-2 focus:ring-white/50
              ${day.isPast 
                ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.3)]' 
                : day.isToday
                ? 'bg-yellow-400 ring-2 ring-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse'
                : 'border border-white/30 bg-white/5 hover:border-white/80 hover:bg-white/10'
              }
            `}
          >
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-white text-black text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 font-bold uppercase tracking-widest">
              {formatDate(day.date)}
            </div>
          </button>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-16 flex flex-wrap justify-center gap-10 text-[10px] text-white/50 uppercase tracking-[0.4em] font-medium">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-sm bg-white shadow-[0_0_5px_rgba(255,255,255,0.4)]" aria-hidden="true"></div>
          <span>The Past</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-sm bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.6)]" aria-hidden="true"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-sm border border-white/30 bg-white/5" aria-hidden="true"></div>
          <span>The Future</span>
        </div>
      </div>
    </section>
  );
};

export default DayGrid;
