import { writable } from 'svelte/store';
import type { CalendarItem } from './types';

// Create stores
export const tasks = writable<CalendarItem[]>([]);
export const events = writable<CalendarItem[]>([]);
export const completedTasks = writable<CalendarItem[]>([]);
export const completedEvents = writable<CalendarItem[]>([]);
export const deletedTasks = writable<CalendarItem[]>([]);
export const deletedEvents = writable<CalendarItem[]>([]);
export const darkMode = writable<boolean>(false);

// Initialize from localStorage
if (typeof localStorage !== 'undefined') {
  // Load tasks
  const storedTasks = localStorage.getItem('calendar_tasks');
  if (storedTasks) {
    try {
      tasks.set(JSON.parse(storedTasks));
    } catch (e) {
      console.error('Error parsing tasks from localStorage');
    }
  }

  // Load events
  const storedEvents = localStorage.getItem('calendar_events');
  if (storedEvents) {
    try {
      events.set(JSON.parse(storedEvents));
    } catch (e) {
      console.error('Error parsing events from localStorage');
    }
  }

  // Load completed tasks
  const storedCompletedTasks = localStorage.getItem('calendar_completed_tasks');
  if (storedCompletedTasks) {
    try {
      completedTasks.set(JSON.parse(storedCompletedTasks));
    } catch (e) {
      console.error('Error parsing completed tasks from localStorage');
    }
  }

  // Load completed events
  const storedCompletedEvents = localStorage.getItem('calendar_completed_events');
  if (storedCompletedEvents) {
    try {
      completedEvents.set(JSON.parse(storedCompletedEvents));
    } catch (e) {
      console.error('Error parsing completed events from localStorage');
    }
  }

  // Load deleted tasks
  const storedDeletedTasks = localStorage.getItem('calendar_deleted_tasks');
  if (storedDeletedTasks) {
    try {
      deletedTasks.set(JSON.parse(storedDeletedTasks));
    } catch (e) {
      console.error('Error parsing deleted tasks from localStorage');
    }
  }

  // Load deleted events
  const storedDeletedEvents = localStorage.getItem('calendar_deleted_events');
  if (storedDeletedEvents) {
    try {
      deletedEvents.set(JSON.parse(storedDeletedEvents));
    } catch (e) {
      console.error('Error parsing deleted events from localStorage');
    }
  }

  // Load dark mode preference
  const storedDarkMode = localStorage.getItem('calendar_dark_mode');
  if (storedDarkMode) {
    darkMode.set(storedDarkMode === 'true');
  }
}

// Subscribe to store changes and update localStorage
tasks.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('calendar_tasks', JSON.stringify(value));
  }
});

events.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('calendar_events', JSON.stringify(value));
  }
});

completedTasks.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('calendar_completed_tasks', JSON.stringify(value));
  }
});

completedEvents.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('calendar_completed_events', JSON.stringify(value));
  }
});

deletedTasks.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('calendar_deleted_tasks', JSON.stringify(value));
  }
});

deletedEvents.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('calendar_deleted_events', JSON.stringify(value));
  }
});

darkMode.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('calendar_dark_mode', String(value));
  }
  
  if (typeof document !== 'undefined') {
    if (value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
});