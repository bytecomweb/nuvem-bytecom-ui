<script setup lang="ts">
import Button from 'primevue/button'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  label: string
  variant?: 'primary' | 'secondary'
}>(), {
  variant: 'primary',
})
</script>

<template>
  <Button
    v-bind="$attrs"
    :label="props.label"
    :severity="props.variant === 'secondary' ? 'secondary' : 'contrast'"
    class="ui-button"
  />
</template>

<style scoped>
.ui-button {
  border-radius: 999px;
  font-weight: 600;
}

.ui-button:hover {
  transform: translateY(-1px);
}
</style>