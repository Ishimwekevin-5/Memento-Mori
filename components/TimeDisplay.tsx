
import React, { useState, useEffect } from 'react';

const FlipDigit: React.FC<{ value: string }> = ({ value }) => {
  const [current, setCurrent] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== current) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setCurrent(value);
        setIsAnimating(false);
      }, 200); // Trigger swap mid-animation
      return () => clearTimeout(timer);
    }
  }, [value, current]);

  return (
    <span className={`inline-block min-w-[0.6em] text-center ${isAnimating ? 'animate-flip' : ''}`}>
      {current}
    </span>
  );
};

const TimeDisplay: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [driftSeconds, setDriftSeconds] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => {
        syncWithNetworkTime();
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationError("GPS location denied. Using local time.");
        setIsLoading(false);
      }
    );

    const syncWithNetworkTime = async () => {
      try {
        const startFetch = Date.now();
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        const endFetch = Date.now();
        
        const latency = (endFetch - startFetch) / 2;
        const networkTime = new Date(data.datetime).getTime() + latency;
        const deviceTime = Date.now();
        
        const drift = Math.round((deviceTime - networkTime) / 1000);
        setDriftSeconds(drift);
        setIsLoading(false);
      } catch (e) {
        console.error("Time sync error:", e);
        setIsLoading(false);
      }
    };

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formatDrift = (totalSeconds: number) => {
    const isAhead = totalSeconds > 0;
    const absoluteSeconds = Math.abs(totalSeconds);
    const minutes = Math.floor(absoluteSeconds / 60);
    const seconds = absoluteSeconds % 60;

    let driftStr = "";
    if (minutes > 0) driftStr += `${minutes}m `;
    driftStr += `${seconds}s`;

    return `Clock is ${driftStr} ${isAhead ? "ahead" : "behind"}`;
  };

  if (isLoading) return (
    <div className="text-[10px] text-white/20 uppercase tracking-[0.5em] animate-pulse h-20 flex items-center justify-center font-saira">
      Syncing Temporal Coordinates...
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="text-5xl md:text-7xl font-saira font-thin tracking-widest text-white/95 flex" aria-label={`Current time: ${timeString}`}>
        {timeString.split('').map((char, index) => (
          char === ':' ? <span key={index} className="opacity-30 mx-1">:</span> : <FlipDigit key={index} value={char} />
        ))}
      </div>
      
      <div className="text-[11px] uppercase tracking-[0.4em] font-medium flex flex-col items-center gap-1 min-h-[20px] font-saira">
        {driftSeconds !== null && Math.abs(driftSeconds) > 1 ? (
          <span className={`${driftSeconds > 0 ? "text-red-500/80" : "text-amber-500/80"} transition-colors duration-500`}>
            {formatDrift(driftSeconds)}
          </span>
        ) : (
          <span className="text-white/20">Synchronization optimal</span>
        )}
        {locationError && <span className="text-white/10 italic text-[9px]">{locationError}</span>}
      </div>
    </div>
  );
};

export default TimeDisplay;
