
export interface DayData {
  dayNumber: number;
  date: Date;
  isPast: boolean;
  isToday: boolean;
}

export interface YearStats {
  year: number;
  totalDays: number;
  daysPassed: number;
  daysLeft: number;
  percentComplete: number;
}
