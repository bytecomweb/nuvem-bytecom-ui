<template>
  <InputMask
    v-bind="props"
    :mask="['+55 (##) ####-####', '+55 (##) # ####-####']"
    v-model="modelValue"
  />
</template>
<script lang="ts" setup>
import InputMask, { InputMaskProps } from '@/components/inputs/input-mask.vue';

const modelValue = defineModel<string | undefined | null>({
  required: true,
});

const props = defineProps<Omit<InputMaskProps, 'mask'>>();
</script>
