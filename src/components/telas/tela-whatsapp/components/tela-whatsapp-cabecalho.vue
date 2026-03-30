<template>
  <Cabecalho titulo="WhatsApp">
    <Button label="Criar instância" icon="pi pi-plus" @click="emit('cadastrar')" />
    <SelectEmpresa
      class="w-[320px]!"
      selecionar-primeiro-automaticamente
      filtro
      v-model="empresaSelecionada"
    />
  </Cabecalho>
</template>
<script lang="ts" setup>
  import Cabecalho from '@/components/cabecalho.vue';
  import SelectEmpresa from '@/components/telas/selects/select-empresa.vue';
  import { Empresa } from '@/types/modelos/empresa';
  import { Button } from 'primevue';

  const empresaSelecionada = defineModel<Empresa | undefined>('empresa-selecionada', {
    required: true,
  });

  const emit = defineEmits(['cadastrar']);
</script>
