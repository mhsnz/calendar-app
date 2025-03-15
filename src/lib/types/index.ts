// Define the possible view modes for the calendar
export type CalendarViewMode = 'daily' | 'weekly' | 'monthly';

// Define the types of calendar items
export type CalendarItemType = 'task' | 'event';

// Base interface for calendar items
export interface Item {
  id: string;
  title: string;
  description: string;
  startTime: string; // Format: 'YYYY-MM-DD HH:MM'
  endTime: string;   // Format: 'YYYY-MM-DD HH:MM'
  background: string; // Color for the item
  type?: CalendarItemType;
  completed?: boolean;
  emails?: string[];
}

// For backward compatibility
export type CalendarItem = Item;

// Interface for day data in the calendar
export interface DayData {
  date: string; // 'YYYY-MM-DD' format
  items: Item[];
}