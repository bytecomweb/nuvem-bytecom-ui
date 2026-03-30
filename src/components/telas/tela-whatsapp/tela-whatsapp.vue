<template>
  <TelaWhatsappCabecalho v-model:empresa-selecionada="empresaSelecionada" />
</template>
<script lang="ts" setup>
  import TelaWhatsappCabecalho from '@/components/telas/tela-whatsapp/components/tela-whatsapp-cabecalho.vue';
  import useApi from '@/composables/use-api';
  import { Empresa } from '@/types/modelos/empresa';
  import { ref } from 'vue';

  const { bearerToken } = defineProps<{
    bearerToken: string;
    ehAdmin?: boolean;
  }>();

  const api = useApi(bearerToken);

  const empresaSelecionada = ref<Empresa>();
</script>
