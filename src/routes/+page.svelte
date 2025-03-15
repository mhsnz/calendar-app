<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Calendar from '$lib/components/Calendar.svelte';
  import AddEventModal from '$lib/components/AddEventModal.svelte';
  import { darkMode } from '$lib/stores';
  
  let viewMode: 'daily' | 'weekly' | 'monthly' = 'daily';
  let showAddModal = false;
  let currentDate = new Date().toISOString().slice(0, 10);
  
  function handleViewChange(mode: 'daily' | 'weekly' | 'monthly') {
    viewMode = mode;
  }
  
  function openAddModal() {
    showAddModal = true;
  }
  
  function closeAddModal() {
    showAddModal = false;
  }
  
  onMount(() => {
    // Check local storage for saved view mode preference
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode) {
      viewMode = savedViewMode as 'daily' | 'weekly' | 'monthly';
    }
    
    // Initialize dark mode from system preference if not set already
    if (typeof $darkMode === 'undefined') {
      $darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });
  
  // Save view mode preference whenever it changes
  $: {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('viewMode', viewMode);
    }
  }
</script>

<svelte:head>
  <title>Calendar App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
  <Navbar {viewMode} onViewChange={handleViewChange} onAddClick={openAddModal} />
  
  <main class="flex-1 container mx-auto p-4 md:p-6">
    <Calendar {viewMode} />
  </main>
  
  <AddEventModal 
    showModal={showAddModal} 
    {currentDate}
    on:close={closeAddModal}
  />
</div>