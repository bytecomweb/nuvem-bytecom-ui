<template>
  <div class="flex items-center gap-3 w-full z-10!">
    <Checkbox v-bind="props" :input-id="id" v-model="modelValue" class="z-10!" />
    <label :for="id">{{ label }}</label>
  </div>
</template>
<script lang="ts" setup>
  import { Checkbox, type CheckboxProps } from 'primevue';

  interface CheckboxComLabelProps extends CheckboxProps {
    label: string;
    id: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelValue = defineModel<any>({
    required: true,
  });

  const { label, id, ...props } = defineProps<CheckboxComLabelProps>();
</script>
