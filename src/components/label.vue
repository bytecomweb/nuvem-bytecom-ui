<template>
  <div>
    <FloatLabel variant="on">
      <slot />
      <label>{{ label }}</label>
    </FloatLabel>
    <Message variant="simple" size="small" severity="danger" class="text-red-500">
      {{ feedback }}
    </Message>
  </div>
</template>
<script lang="ts" setup>
  import { FloatLabel, Message } from 'primevue';

  defineProps<{
    label: string;
    feedback?: string;
  }>();
</script>
