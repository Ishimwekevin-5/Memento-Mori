
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DayGrid from './components/DayGrid';
import TimeDisplay from './components/TimeDisplay';
import { DayData, YearStats } from './types';
import { getYearStats, generateDayGrid, formatDate } from './utils';
import { getReflection } from './services/geminiService';

const App: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState<YearStats>(getYearStats(year));
  const [days, setDays] = useState<DayData[]>(generateDayGrid(year));
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [reflection, setReflection] = useState<string>("Loading reflection...");
  const [isReflectionLoading, setIsReflectionLoading] = useState(false);

  useEffect(() => {
    setStats(getYearStats(year));
    setDays(generateDayGrid(year));
  }, [year]);

  const fetchReflection = useCallback(async () => {
    setIsReflectionLoading(true);
    const text = await getReflection(stats.daysPassed, stats.totalDays, stats.year);
    setReflection(text);
    setIsReflectionLoading(false);
  }, [stats.daysPassed, stats.totalDays, stats.year]);

  useEffect(() => {
    fetchReflection();
  }, [fetchReflection]);

  const handleYearChange = (newYear: number) => {
    if (newYear >= 1900 && newYear <= 2100) {
      setYear(newYear);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 select-none overflow-x-hidden">
      <div className="w-full max-w-6xl animate-in fade-in duration-1000">
        
        <Header stats={stats} onYearChange={handleYearChange} />
        
        <div className="mb-12">
          <TimeDisplay />
          <div className="mt-4 text-center text-2xl md:text-3xl font-serif tracking-wide text-white/90">
            "It's not a lot of time, is it?"
          </div>
        </div>

        <DayGrid 
          days={days} 
          onSelectDay={(day) => setSelectedDay(day)} 
        />

        {/* AI Reflection Section */}
        <div className="mt-24 max-w-2xl mx-auto text-center px-6">
          <div className="w-12 h-[1px] bg-white/20 mx-auto mb-8"></div>
          <p className={`font-serif text-xl md:text-2xl leading-relaxed italic transition-all duration-700 ${isReflectionLoading ? 'opacity-30 blur-sm' : 'opacity-80'}`}>
            {reflection}
          </p>
          <button 
            onClick={fetchReflection}
            className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
          >
            Refresh Reflection
          </button>
        </div>

        {/* Modal for Day Detail */}
        {selectedDay && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300"
            onClick={() => setSelectedDay(null)}
          >
            <div 
              className="bg-[#0a0a0a] border border-white/10 p-10 max-w-md w-full rounded-2xl shadow-2xl space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-2">
                <h3 className="text-white/40 uppercase tracking-widest text-xs">Day {selectedDay.dayNumber} of {year}</h3>
                <h2 className="text-3xl font-serif font-bold">{formatDate(selectedDay.date)}</h2>
              </div>
              
              <div className="py-4 border-t border-b border-white/5 text-center text-white/60 font-serif italic">
                {selectedDay.isPast 
                  ? "This day has returned to the void of time." 
                  : selectedDay.isToday 
                  ? "This is the only moment you truly possess." 
                  : "A shadow in the future, waiting to be lived."}
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all active:scale-95"
                >
                  Return to Year
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-32 text-[10px] text-white/20 uppercase tracking-[0.5em] text-center w-full pb-8">
        Memento Mori &bull; Powered by Gemini &bull; Created By IshimweKevin
      </footer>
    </div>
  );
};

export default App;
