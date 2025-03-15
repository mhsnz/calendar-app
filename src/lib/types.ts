// Define basic types
export type CalendarViewMode = 'daily' | 'weekly' | 'monthly';
export type TaskEventType = 'task' | 'event';

// Base item interface
export interface CalendarItem {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  background: string;
  type: TaskEventType;
  completed: boolean;
  emails: string[];
}

// Type for day data
export interface DayData {
  date: string;
  tasks: CalendarItem[];
  events: CalendarItem[];
}