<script>
    // Import stores but avoid TypeScript type declarations
    import { onMount } from 'svelte';
    import { tasks, events, deletedTasks, deletedEvents, completedTasks, completedEvents, darkMode } from '$lib/stores';
    import EventCard from './EventCard.svelte';
    
    // Basic data
    const hoursArray = [];
    for (let i = 0; i < 24; i++) {
      hoursArray.push(i.toString().padStart(2, '0') + ':00');
    }
    
    const daysArray = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Props
    export let viewMode = 'daily';
    
    // States
    let isAddModalOpen = false;
    let isEditModalOpen = false;
    let activeHour = '';
    let activeItem = null;
    let editableTitle = '';
    let editableStartTime = '';
    let editableEndTime = '';
    
    // Handle hour click
    function onHourClick(hour) {
      activeHour = hour;
      isAddModalOpen = true;
    }
    
    // Handle item click
    function onItemClick(item, itemType) {
      activeItem = { ...item, itemType };
      editableTitle = item.title || '';
      editableStartTime = item.startTime || '';
      editableEndTime = item.endTime || '';
      isEditModalOpen = true;
    }
    
    // Close all modals
    function closeAllModals() {
      isAddModalOpen = false;
      isEditModalOpen = false;
    }
    
    // Filter tasks by hour
    function getTasksByHour(hour) {
      if (!$tasks) return [];
      const hourPart = hour.split(':')[0];
      return $tasks.filter(task => {
        if (!task || !task.startTime) return false;
        return task.startTime.includes(hourPart);
      });
    }
    
    // Filter events by hour
    function getEventsByHour(hour) {
      if (!$events) return [];
      const hourPart = hour.split(':')[0];
      return $events.filter(event => {
        if (!event || !event.startTime) return false;
        return event.startTime.includes(hourPart);
      });
    }
    
    // Create task
    function createTask() {
      if (!activeHour) return;
      
      const hourValue = parseInt(activeHour);
      const today = new Date();
      today.setHours(hourValue, 0, 0, 0);
      
      const endTime = new Date(today);
      endTime.setHours(hourValue + 1, 0, 0, 0);
      
      const newTask = {
        id: Math.random().toString(36).substring(2, 9),
        title: 'New Task',
        description: '',
        startTime: today.toISOString(),
        endTime: endTime.toISOString(),
        background: '#4f46e5'
      };
      
      tasks.update(existingTasks => {
        return [...existingTasks, newTask];
      });
      
      closeAllModals();
    }
    
    // Create event
    function createEvent() {
      if (!activeHour) return;
      
      const hourValue = parseInt(activeHour);
      const today = new Date();
      today.setHours(hourValue, 0, 0, 0);
      
      const endTime = new Date(today);
      endTime.setHours(hourValue + 1, 0, 0, 0);
      
      const newEvent = {
        id: Math.random().toString(36).substring(2, 9),
        title: 'New Event',
        description: '',
        startTime: today.toISOString(),
        endTime: endTime.toISOString(),
        background: '#8b5cf6'
      };
      
      events.update(existingEvents => {
        return [...existingEvents, newEvent];
      });
      
      closeAllModals();
    }
    
    // Update item
    function updateItem() {
      if (!activeItem) return;
      
      const updatedItem = {
        ...activeItem,
        title: editableTitle,
        startTime: editableStartTime,
        endTime: editableEndTime
      };
      
      if (activeItem.itemType === 'task') {
        tasks.update(existingTasks => {
          return existingTasks.map(task => {
            return task.id === activeItem.id ? updatedItem : task;
          });
        });
      } else {
        events.update(existingEvents => {
          return existingEvents.map(event => {
            return event.id === activeItem.id ? updatedItem : event;
          });
        });
      }
      
      closeAllModals();
    }
    
    // Complete item
    function completeItem() {
      if (!activeItem) return;
      
      if (activeItem.itemType === 'task') {
        tasks.update(existingTasks => {
          return existingTasks.filter(task => task.id !== activeItem.id);
        });
        
        completedTasks.update(existingCompletedTasks => {
          return [...existingCompletedTasks, {...activeItem, completed: true}];
        });
      } else {
        events.update(existingEvents => {
          return existingEvents.filter(event => event.id !== activeItem.id);
        });
        
        completedEvents.update(existingCompletedEvents => {
          return [...existingCompletedEvents, {...activeItem, completed: true}];
        });
      }
      
      closeAllModals();
    }
    
    // Delete item
    function deleteItem() {
      if (!activeItem) return;
      
      if (activeItem.itemType === 'task') {
        tasks.update(existingTasks => {
          return existingTasks.filter(task => task.id !== activeItem.id);
        });
        
        deletedTasks.update(existingDeletedTasks => {
          return [...existingDeletedTasks, activeItem];
        });
      } else {
        events.update(existingEvents => {
          return existingEvents.filter(event => event.id !== activeItem.id);
        });
        
        deletedEvents.update(existingDeletedEvents => {
          return [...existingDeletedEvents, activeItem];
        });
      }
      
      closeAllModals();
    }
  </script>
  
  <div class="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800">
    <!-- Daily View -->
    {#if viewMode === 'daily'}
      <div class="grid grid-cols-[100px_1fr] gap-2">
        {#each hoursArray as hour}
          <div
            class="text-right p-2 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            on:click={() => onHourClick(hour)}
          >
            {hour}
          </div>
          <div class="border-b border-gray-200 dark:border-gray-700 p-2">
            {#each getTasksByHour(hour) as task}
              <div class="mb-2" on:click={() => onItemClick(task, 'task')}>
                <EventCard item={task} type="task" />
              </div>
            {/each}
            
            {#each getEventsByHour(hour) as event}
              <div class="mb-2" on:click={() => onItemClick(event, 'event')}>
                <EventCard item={event} type="event" />
              </div>
            {/each}
          </div>
        {/each}
      </div>
    
    <!-- Weekly View -->
    {:else if viewMode === 'weekly'}
      <div class="grid grid-cols-[100px_repeat(7,1fr)] gap-2">
        <div></div>
        {#each daysArray as day}
          <div class="text-center p-2 font-semibold text-gray-700 dark:text-gray-300">{day}</div>
        {/each}
        
        {#each hoursArray as hour}
          <div class="text-right p-2 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium">
            {hour}
          </div>
          
          {#each daysArray as day, i}
            <div class="border-b border-gray-200 dark:border-gray-700 p-2">
              <!-- Weekly events would go here -->
            </div>
          {/each}
        {/each}
      </div>
    
    <!-- Monthly View -->
    {:else}
      <div class="grid grid-cols-7 gap-1">
        {#each daysArray as day}
          <div class="text-center p-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">{day}</div>
        {/each}
        
        {#each Array(35) as _, i}
          <div class="min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="text-right text-sm text-gray-500 dark:text-gray-400 mb-2">{(i % 31) + 1}</div>
            <!-- Monthly events would go here -->
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Add Modal -->
  {#if isAddModalOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add Item for {activeHour}</h3>
        
        <div class="grid grid-cols-2 gap-4">
          <button 
            class="p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 flex flex-col items-center"
            on:click={createTask}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="font-medium">Add Task</span>
          </button>
          
          <button 
            class="p-4 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 flex flex-col items-center"
            on:click={createEvent}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-medium">Add Event</span>
          </button>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button 
            class="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
            on:click={closeAllModals}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Edit Modal -->
  {#if isEditModalOpen && activeItem}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Edit {activeItem.itemType === 'task' ? 'Task' : 'Event'}</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input 
            type="text" 
            bind:value={editableTitle} 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white dark:bg-gray-700"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
            <input 
              type="datetime-local" 
              bind:value={editableStartTime} 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
            <input 
              type="datetime-local" 
              bind:value={editableEndTime} 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white dark:bg-gray-700"
            />
          </div>
        </div>
        
        <div class="flex justify-between">
          <div>
            <button 
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              on:click={deleteItem}
            >
              Delete
            </button>
            <button 
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-2"
              on:click={completeItem}
            >
              Complete
            </button>
          </div>
          <div>
            <button 
              class="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 mr-2"
              on:click={closeAllModals}
            >
              Cancel
            </button>
            <button 
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              on:click={updateItem}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}