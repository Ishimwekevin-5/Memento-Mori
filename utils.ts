
import { YearStats, DayData } from './types';

export const getYearStats = (year: number): YearStats => {
  const now = new Date();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  
  // Total days in the year
  const totalDays = isLeapYear(year) ? 366 : 365;
  
  // Calculate days passed
  let daysPassed = 0;
  if (now.getFullYear() > year) {
    daysPassed = totalDays;
  } else if (now.getFullYear() === year) {
    const diff = now.getTime() - startOfYear.getTime();
    daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  } else {
    daysPassed = 0;
  }
  
  daysPassed = Math.min(totalDays, Math.max(0, daysPassed));
  
  return {
    year,
    totalDays,
    daysPassed,
    daysLeft: totalDays - daysPassed,
    percentComplete: (daysPassed / totalDays) * 100
  };
};

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

export const generateDayGrid = (year: number): DayData[] => {
  const days: DayData[] = [];
  const totalDays = isLeapYear(year) ? 366 : 365;
  const now = new Date();
  const todayDateStr = now.toDateString();

  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, 0, i);
    const dateStr = date.toDateString();
    
    // Determine if past based on current date
    const isToday = dateStr === todayDateStr;
    const isPast = date < now && !isToday;

    days.push({
      dayNumber: i,
      date,
      isPast,
      isToday
    });
  }
  return days;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};
