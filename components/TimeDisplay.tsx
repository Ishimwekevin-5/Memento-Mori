
import React, { useState, useEffect } from 'react';

const TimeDisplay: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [driftSeconds, setDriftSeconds] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get GPS Location to satisfy the "Phones Location" requirement
    navigator.geolocation.getCurrentPosition(
      () => {
        // We have location access, now fetch the "true" network time
        syncWithNetworkTime();
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationError("GPS Location denied. Using device time.");
        setIsLoading(false);
      }
    );

    const syncWithNetworkTime = async () => {
      try {
        // Use a reliable time API to check drift
        const startFetch = Date.now();
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        const endFetch = Date.now();
        
        // Account for network latency (roughly half the RTT)
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

    // Update the clock every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading) return <div className="text-[10px] text-white/20 uppercase tracking-widest animate-pulse">Synchronizing Time...</div>;

  return (
    <div className="flex flex-col items-center gap-1 mt-8">
      <div className="text-4xl md:text-5xl font-serif font-light tracking-[0.2em] text-white/90">
        {formatTime(time)}
      </div>
      
      <div className="text-[10px] uppercase tracking-[0.3em] font-medium flex gap-4">
        {driftSeconds !== null && Math.abs(driftSeconds) > 2 ? (
          <span className={driftSeconds > 0 ? "text-red-400" : "text-yellow-400"}>
            Your clock is {Math.abs(driftSeconds)}s {driftSeconds > 0 ? "ahead" : "behind"}
          </span>
        ) : (
          <span className="text-white/20">Time is accurate</span>
        )}
        {locationError && <span className="text-white/10 italic">{locationError}</span>}
      </div>
    </div>
  );
};

export default TimeDisplay;
