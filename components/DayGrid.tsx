
import React from 'react';
import { DayData } from '../types';
import { formatDate } from '../utils';

interface DayGridProps {
  days: DayData[];
  onSelectDay: (day: DayData) => void;
}

const DayGrid: React.FC<DayGridProps> = ({ days, onSelectDay }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(14px,1fr))] md:grid-cols-[repeat(31,1fr)] gap-2 md:gap-3 justify-items-center">
        {days.map((day) => (
          <div
            key={day.dayNumber}
            onClick={() => onSelectDay(day)}
            title={formatDate(day.date)}
            className={`
              w-3 h-3 md:w-4 md:h-4 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-150 relative group
              ${day.isPast 
                ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
                : day.isToday
                ? 'bg-yellow-400 ring-4 ring-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse'
                : 'border border-white/40 bg-transparent hover:border-white'
              }
            `}
          >
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-black text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity font-bold">
              {formatDate(day.date)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-16 flex flex-wrap justify-center gap-8 text-xs text-white/40 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.4)]"></div>
          <span>The Past</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.6)]"></div>
          <span>The Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border border-white/40"></div>
          <span>The Future</span>
        </div>
      </div>
    </div>
  );
};

export default DayGrid;
