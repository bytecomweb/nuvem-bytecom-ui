<template>
  <Dialog
    v-model:visible="visivel"
    header="E-mail enviado"
    modal
    :style="{ maxWidth: '350px', width: '90vw' }"
    content-class="p-0"
  >
    <div v-if="link" class="flex flex-col items-center justify-center gap-4">
      <span class="flex items-center justify-center bg-green-100 rounded-full w-16 h-16 mb-2">
        <i class="pi pi-check text-green-600 text-3xl"></i>
      </span>
      <p class="text-lg text-center font-semibold text-gray-800">
        E-mail para redefinição de senha enviado!
      </p>
      <Button
        :label="copiado ? 'Link copiado' : 'Copiar link de redefinição'"
        @click="copiarLink"
        :disabled="copiado"
        class="w-full max-w-xs"
        icon="pi pi-copy"
        outlined
      />
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
  import useNotification from '@/composables/use-notification';
  import { Button, Dialog } from 'primevue';
  // Certifique-se de que o ícone PrimeIcons está disponível globalmente ou importado no projeto
  import { computed, ref } from 'vue';

  const link = defineModel<string | undefined>('link', {
    required: true,
  });

  const visivel = computed({
    get() {
      return !!link.value;
    },
    set() {
      link.value = undefined;
    },
  });

  const { erro } = useNotification();

  const copiado = ref(false);

  const copiarLink = () => {
    if (link.value) {
      navigator.clipboard
        .writeText(link.value)
        .then(() => {
          copiado.value = true;
          setTimeout(() => {
            copiado.value = false;
          }, 2000);
        })
        .catch((err) => {
          console.error(err);
          erro('Não foi possível copiar');
        });
    }
  };
</script>
