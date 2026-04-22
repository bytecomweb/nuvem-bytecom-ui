<script setup lang="ts">
  import { onMounted } from 'vue';
  import PlaygroundSidebar from './components/playground-sidebar.vue';
  import PlaygroundViewer from './components/playground-viewer.vue';
  import { setupMockApi } from './mocks/api-mock';
  import { ConfirmDialog, Toast } from 'primevue';

  // Configurar mock de API
  onMounted(() => {
    setupMockApi();
  });
</script>

<template>
  <div class="playground-layout">
    <PlaygroundSidebar />
    <PlaygroundViewer />
  </div>
  <Toast />
  <ConfirmDialog />
</template>

<style>
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #app {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-variant-ligatures: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .playground-layout {
    display: flex;
    height: 100vh;
  }
</style>
