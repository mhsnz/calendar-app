<script lang="ts">
  import { tasks, events, completedTasks, completedEvents, deletedTasks, deletedEvents, darkMode } from '$lib/stores';
  import type { Item } from '$lib/types';
  
  export let item: Item;
  export let type: 'task' | 'event';
  
  let showMenu = false;
  let showDetails = false;
  
  function formatTime(timeString: string | undefined): string {
    if (!timeString) return '';
    
    try {
      const date = new Date(timeString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch (e) {
      return timeString;
    }
  }
  
  function toggleMenu(e: MouseEvent) {
    e.stopPropagation();
    showMenu = !showMenu;
  }
  
  function toggleDetails(e: MouseEvent) {
    e.stopPropagation();
    showDetails = !showDetails;
  }
  
  function markAsCompleted(e: MouseEvent) {
    e.stopPropagation();
    if (type === 'task') {
      tasks.update(items => items.filter(t => t.id !== item.id));
      completedTasks.update(items => [...items, {...item, completed: true}]);
    } else {
      events.update(items => items.filter(t => t.id !== item.id));
      completedEvents.update(items => [...items, {...item, completed: true}]);
    }
    showMenu = false;
  }
  
  function deleteItem(e: MouseEvent) {
    e.stopPropagation();
    if (type === 'task') {
      tasks.update(items => items.filter(t => t.id !== item.id));
      deletedTasks.update(items => [...items, item]);
    } else {
      events.update(items => items.filter(t => t.id !== item.id));
      deletedEvents.update(items => [...items, item]);
    }
    showMenu = false;
  }
</script>

<div 
  class="relative group p-2 mb-1 rounded-md shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
  style="background-color: {item.background || '#4f46e5'};"
  class:bg-opacity-70={!$darkMode}
  class:bg-opacity-80={$darkMode}
  on:click={toggleDetails}
>
  <div class="flex justify-between items-start">
    <div>
      <h4 class="font-medium text-gray-800 dark:text-white">
        {item.title}
      </h4>
      {#if item.startTime && item.endTime}
        <p class="text-xs text-gray-600 dark:text-gray-300">
          {formatTime(item.startTime)} - {formatTime(item.endTime)}
        </p>
      {/if}
    </div>
    
    <button 
      class="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-white hover:bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity"
      on:click={toggleMenu}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    </button>
    
    {#if showMenu}
      <div class="absolute right-0 top-6 mt-1 w-48 rounded-md shadow-lg z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="py-1">
          <button 
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            on:click={markAsCompleted}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Mark as completed
          </button>
          <button 
            class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            on:click={deleteItem}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    {/if}
  </div>
  
  {#if showDetails}
    <div class="mt-2 pt-2 border-t border-white border-opacity-20">
      {#if item.description}
        <p class="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
      {/if}
      
      {#if item.emails && item.emails.length > 0}
        <div class="mt-2">
          <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Participants:</p>
          <div class="flex flex-wrap gap-1 mt-1">
            {#each item.emails as email}
              <span class="inline-block bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs text-gray-700 dark:text-gray-300">
                {email}
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>