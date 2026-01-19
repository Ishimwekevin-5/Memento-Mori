
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
  const [reflection, setReflection] = useState<string>("Time is the most valuable thing a man can spend.");
  const [isReflectionLoading, setIsReflectionLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Requirement: Change contemplation after a minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReflection();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchReflection]);

  const handleYearChange = (newYear: number) => {
    if (newYear >= 1900 && newYear <= 2100) {
      setYear(newYear);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-10 md:py-20 px-4 select-none overflow-x-hidden font-saira transition-all duration-700 ${isFullscreen ? 'bg-black' : 'bg-[#050505]'}`}>
      
      {/* Fullscreen Toggle Button */}
      <button 
        onClick={toggleFullscreen}
        className="fixed top-8 right-8 z-50 text-white/10 hover:text-white transition-all p-3 rounded-full hover:bg-white/5 active:scale-90"
        aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6m-1 1l-7 7M9 21H3v-6m1 1l7-7"/></svg>
        )}
      </button>

      <div className={`w-full max-w-6xl animate-in fade-in duration-1000 flex flex-col items-center ${isFullscreen ? 'gap-8' : 'gap-4'}`}>
        
        {/* Requirement: Year and Days Remain appear in fullscreen too */}
        <div className="w-full zen-transition">
          <Header stats={stats} onYearChange={handleYearChange} isFullscreen={isFullscreen} />
        </div>
        
        <div className="w-full flex flex-col items-center">
          <TimeDisplay />
        </div>

        <div className={`w-full zen-transition ${isFullscreen ? 'py-8 scale-105' : 'py-0'}`}>
          <DayGrid 
            days={days} 
            onSelectDay={(day) => setSelectedDay(day)}
            isFullscreen={isFullscreen}
          />
        </div>

        {/* AI Reflection Section - Now always visible to provide quotes on Time and Life */}
        <div className={`mt-12 max-w-3xl mx-auto text-center px-6 zen-transition ${isFullscreen ? 'opacity-90' : 'opacity-70'}`}>
          {!isFullscreen && <div className="w-16 h-[1px] bg-white/10 mx-auto mb-10"></div>}
          <p className={`text-xl md:text-3xl leading-relaxed font-light tracking-wide transition-all duration-700 italic ${isReflectionLoading ? 'opacity-20 blur-md' : 'opacity-100 text-white'}`}>
            "{reflection}"
          </p>
          {!isFullscreen && (
            <button 
              onClick={fetchReflection}
              className="mt-10 text-[10px] uppercase tracking-[0.5em] text-white/20 hover:text-white transition-all py-2 px-4 rounded hover:bg-white/5"
            >
              Refresh Contemplation
            </button>
          )}
        </div>

        {/* Modal for Day Detail */}
        {selectedDay && (
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300"
            onClick={() => setSelectedDay(null)}
          >
            <div 
              className="bg-[#0c0c0c] border border-white/5 p-12 max-w-lg w-full rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <h3 className="text-white/30 uppercase tracking-[0.6em] text-[10px] font-bold">Chronicle Segment {selectedDay.dayNumber}</h3>
                <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white">{formatDate(selectedDay.date)}</h2>
              </div>
              
              <div className="py-8 border-t border-b border-white/5 text-center text-white/50 text-lg font-light italic tracking-wide">
                {selectedDay.isPast 
                  ? "This energy has been dispersed into history." 
                  : selectedDay.isToday 
                  ? "The only coordinate where existence is possible." 
                  : "A potential future waiting to be collapsed."}
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="px-12 py-4 border border-white/10 text-white/40 uppercase tracking-[0.4em] text-xs hover:text-white hover:border-white transition-all active:scale-95"
                >
                  Return to Grid
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isFullscreen && (
        <footer className="mt-32 text-[9px] text-white/10 uppercase tracking-[0.8em] text-center w-full pb-8 zen-transition">
          Memento Mori &bull; AI Reflection &bull; IshimweKevin
        </footer>
      )}
    </div>
  );
};

export default App;
