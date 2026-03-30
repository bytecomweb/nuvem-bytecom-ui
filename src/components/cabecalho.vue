<template>
  <header class="border-b p-3 flex justify-between items-center gap-3">
    <h1>{{ titulo }}</h1>
    <div class="flex items-center gap-3">
      <slot />
    </div>
  </header>
</template>
<script lang="ts" setup>
  defineProps<{
    titulo: string;
  }>();
</script>
