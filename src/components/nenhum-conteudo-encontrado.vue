<template>
  <div class="flex flex-col items-center gap-2 py-8">
    <i class="pi pi-info-circle text-3xl text-gray-500" />
    <span class="text-gray-500">{{ mensagem }}</span>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  mensagem: string;
}>();
</script>
