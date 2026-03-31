<template>
  <header class="border-b p-3 flex justify-between items-center gap-3 border-b-gray-200">
    <div>
      <h1>{{ titulo }}</h1>
      <p v-if="descricao" class="text-sm text-gray-500">
        {{ descricao }}
      </p>
    </div>
    <div class="flex items-center gap-3">
      <slot />
    </div>
  </header>
</template>
<script lang="ts" setup>
  defineProps<{
    titulo: string;
    descricao?: string;
  }>();
</script>
