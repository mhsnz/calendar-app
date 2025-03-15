import { writable } from 'svelte/store';
import type { Item } from '$lib/types';

// Store for tasks
export const tasks = writable<Item[]>([]);

// Store for events
export const events = writable<Item[]>([]);

// Store for deleted tasks and events
export const deletedTasks = writable<Item[]>([]);
export const deletedEvents = writable<Item[]>([]);

// Store for completed tasks and events
export const completedTasks = writable<Item[]>([]);
export const completedEvents = writable<Item[]>([]);

// Dark mode toggle
export const darkMode = writable<boolean>(false);

// Initialize from localStorage if available
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  try {
    // Load tasks
    const savedTasks = localStorage.getItem('calendar_tasks');
    if (savedTasks) {
      tasks.set(JSON.parse(savedTasks));
    }
    
    // Load events
    const savedEvents = localStorage.getItem('calendar_events');
    if (savedEvents) {
      events.set(JSON.parse(savedEvents));
    }
    
    // Load deleted tasks
    const savedDeletedTasks = localStorage.getItem('calendar_deleted_tasks');
    if (savedDeletedTasks) {
      deletedTasks.set(JSON.parse(savedDeletedTasks));
    }
    
    // Load deleted events
    const savedDeletedEvents = localStorage.getItem('calendar_deleted_events');
    if (savedDeletedEvents) {
      deletedEvents.set(JSON.parse(savedDeletedEvents));
    }
    
    // Load completed tasks
    const savedCompletedTasks = localStorage.getItem('calendar_completed_tasks');
    if (savedCompletedTasks) {
      completedTasks.set(JSON.parse(savedCompletedTasks));
    }
    
    // Load completed events
    const savedCompletedEvents = localStorage.getItem('calendar_completed_events');
    if (savedCompletedEvents) {
      completedEvents.set(JSON.parse(savedCompletedEvents));
    }
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('calendar_dark_mode');
    if (savedDarkMode) {
      const isDarkMode = savedDarkMode === 'true';
      darkMode.set(isDarkMode);
      
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
}

// Save to localStorage when stores change
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

darkMode.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('calendar_dark_mode', String(value));
    
    if (typeof document !== 'undefined') {
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
});