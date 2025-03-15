<script lang="ts">
  import { tasks, events } from '$lib/stores';
  import type { CalendarItem, TaskEventType } from '$lib/types';

  const { currentDate = new Date().toISOString().slice(0, 10), onClose } = $props();
  
  // Form state variables with Svelte 5 syntax
  let itemType = $state<TaskEventType>('event');
  let itemTitle = $state('');
  let itemDescription = $state('');
  let startDate = $state(currentDate);
  let startTime = $state('09:00');
  let endDate = $state(currentDate);
  let endTime = $state('10:00');
  let itemColor = $state('#4f46e5');
  let itemEmails = $state<string[]>([]);
  let emailInput = $state('');
  
  const colorOptions = [
    { color: '#4f46e5', name: 'Indigo' },
    { color: '#10b981', name: 'Emerald' },
    { color: '#ef4444', name: 'Red' },
    { color: '#f59e0b', name: 'Amber' },
    { color: '#3b82f6', name: 'Blue' },
    { color: '#ec4899', name: 'Pink' },
    { color: '#8b5cf6', name: 'Violet' },
    { color: '#6366f1', name: 'Light Indigo' }
  ];
  
  // Close the modal and reset form
  function closeModal() {
    resetForm();
    if (onClose) onClose();
  }
  
  // Reset the form to default values
  function resetForm() {
    itemType = 'event';
    itemTitle = '';
    itemDescription = '';
    startDate = currentDate;
    startTime = '09:00';
    endDate = currentDate;
    endTime = '10:00';
    itemColor = '#4f46e5';
    itemEmails = [];
    emailInput = '';
  }
  
  // Handle form submission
  function handleSubmit() {
    if (!itemTitle.trim()) return;
    
    // Create new calendar item
    const newItem: CalendarItem = {
      id: crypto.randomUUID(),
      title: itemTitle,
      description: itemDescription,
      startTime: `${startDate} ${startTime}`,
      endTime: `${endDate} ${endTime}`,
      background: itemColor,
      type: itemType,
      completed: false,
      emails: [...itemEmails]
    };
    
    // Add to the appropriate store
    if (itemType === 'task') {
      tasks.update(items => [...items, newItem]);
    } else {
      events.update(items => [...items, newItem]);
    }
    
    // Close modal and reset form
    closeModal();
  }
  
  // Add an email to the list
  function addEmail() {
    if (emailInput && validateEmail(emailInput) && !itemEmails.includes(emailInput)) {
      itemEmails = [...itemEmails, emailInput];
      emailInput = '';
    }
  }
  
  // Remove an email from the list
  function removeEmail(email: string) {
    itemEmails = itemEmails.filter(e => e !== email);
  }
  
  // Validate email format
  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // Update dates when currentDate prop changes
  $effect(() => {
    startDate = currentDate;
    endDate = currentDate;
  });
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
    <!-- Header -->
    <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h3 class="text-xl font-medium text-gray-800 dark:text-white">Add New {itemType === 'task' ? 'Task' : 'Event'}</h3>
      <button 
        type="button"
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
        on:click={closeModal}
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Body -->
    <div class="p-4">
      <form on:submit|preventDefault={handleSubmit}>
        <!-- Type Selector -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
          <div class="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button 
              type="button" 
              class="flex-1 py-2 text-sm font-medium {itemType === 'task' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'}"
              on:click={() => itemType = 'task'}
            >
              Task
            </button>
            <button 
              type="button" 
              class="flex-1 py-2 text-sm font-medium {itemType === 'event' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'}"
              on:click={() => itemType = 'event'}
            >
              Event
            </button>
          </div>
        </div>
        
        <!-- Title -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title*</label>
          <input 
            type="text" 
            id="title" 
            bind:value={itemTitle} 
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter a title"
          />
        </div>
        
        <!-- Description -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea 
            id="description" 
            bind:value={itemDescription} 
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter a description"
          ></textarea>
        </div>
        
        <!-- Time Range -->
        <div class="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input 
              type="date" 
              id="startDate" 
              bind:value={startDate} 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label for="startTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
            <input 
              type="time" 
              id="startTime" 
              bind:value={startTime} 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div class="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input 
              type="date" 
              id="endDate" 
              bind:value={endDate} 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label for="endTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
            <input 
              type="time" 
              id="endTime" 
              bind:value={endTime} 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <!-- Color -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
          <div class="flex flex-wrap gap-2">
            {#each colorOptions as option}
              <button 
                type="button" 
                style="background-color: {option.color}" 
                class="w-8 h-8 rounded-full {itemColor === option.color ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-800' : ''}"
                on:click={() => itemColor = option.color}
                title={option.name}
                aria-label={`Select ${option.name} color`}
              ></button>
            {/each}
          </div>
        </div>
        
        <!-- Emails -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Participants (Optional)</label>
          <div class="flex gap-2 mb-2">
            <input 
              type="email" 
              placeholder="Add email address" 
              bind:value={emailInput}
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <button 
              type="button" 
              class="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              on:click={addEmail}
            >
              Add
            </button>
          </div>
          
          {#if itemEmails.length > 0}
            <div class="flex flex-wrap gap-2 mt-2">
              {#each itemEmails as email}
                <div class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <span>{email}</span>
                  <button 
                    type="button" 
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    on:click={() => removeEmail(email)}
                    aria-label={`Remove ${email}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
        
        <!-- Footer -->
        <div class="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700 mt-4">
          <button 
            type="button" 
            class="mr-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            on:click={closeModal}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600"
          >
            Create {itemType === 'task' ? 'Task' : 'Event'}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>