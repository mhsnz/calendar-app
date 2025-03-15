<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Calendar from '$lib/components/Calendar.svelte';
  import AddEventModal from '$lib/components/AddEventModal.svelte';
  
  // State with proper Svelte 5 syntax
  let viewMode = $state('daily');
  let showAddModal = $state(false);
  let currentDate = $state(new Date().toISOString().slice(0, 10));
  let isDarkMode = $state(false);
  
  // Effect for saving view mode
  $effect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('viewMode', viewMode);
    }
  });
  
  function handleViewChange(mode) {
    viewMode = mode;
  }
  
  function openAddModal() {
    showAddModal = true;
  }
  
  function closeAddModal() {
    showAddModal = false;
  }
  
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', isDarkMode);
  }
  
  onMount(() => {
    // Check local storage for saved view mode preference
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode && ['daily', 'weekly', 'monthly'].includes(savedViewMode)) {
      viewMode = savedViewMode;
    }
    
    // Initialize dark mode from system preference
    isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDarkMode);
  });
</script>

<svelte:head>
  <title>Calendar App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
  <Navbar 
    viewMode={viewMode} 
    onViewChange={handleViewChange} 
    onAddClick={openAddModal}
    isDarkMode={isDarkMode}
    onToggleDarkMode={toggleDarkMode} 
  />
  
  <main class="flex-1 container mx-auto p-4 md:p-6">
    <Calendar viewMode={viewMode} />
  </main>
  
  {#if showAddModal}
    <AddEventModal 
      currentDate={currentDate}
      onClose={() => closeAddModal()}
    />
  {/if}
</div>