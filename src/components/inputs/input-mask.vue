<template>
  <InputText v-model="modelValue" v-maska="maskConfig" fluid />
</template>
<script lang="ts" setup>
  import { InputText, type InputTextProps } from 'primevue';
  import { vMaska } from 'maska/vue';
  import { type MaskInputOptions } from 'maska';
  import { computed } from 'vue';

  const modelValue = defineModel<string | null | undefined>({
    required: true,
  });

  interface InputMaskProps extends /* @vue-ignore */ InputTextProps {
    mask: string | string[];
  }

  const props = defineProps<InputMaskProps>();

  const maskConfig = computed<MaskInputOptions | undefined>(() => {
    if (!props.mask) {
      return;
    }

    return {
      // @ts-ignore - A tipagem do maska não reconhece o tipo string | string[] para a propriedade mask, mas a biblioteca suporta ambos os tipos.
      mask: props.mask,
    };
  });
</script>
