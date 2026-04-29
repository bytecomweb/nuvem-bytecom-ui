<template>
  <div
    class="w-full"
    :class="{
      'text-center': !valor,
    }"
  >
    {{ valor || '-' }}
  </div>
</template>
<script lang="ts" setup>
  defineProps<{
    valor: unknown;
  }>();
</script>
