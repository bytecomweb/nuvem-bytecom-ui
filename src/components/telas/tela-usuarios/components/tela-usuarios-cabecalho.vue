<template>
  <Cabecalho titulo="Usuários">
    <div class="flex items-center gap-3">
      <Button label="Cadastrar usuário" icon="pi pi-plus" @click="emit('criar')" />

      <div class="w-[320px]">
        <SelectEmpresa v-model="empresaSelecionada" selecionar-primeiro-automaticamente filtro />
      </div>
    </div>
  </Cabecalho>
</template>
<script lang="ts" setup>
  import Cabecalho from '@/components/cabecalho.vue';
  import SelectEmpresa from '@/components/selects/select-empresa.vue';
  import { Empresa } from '@/types/modelos/empresa';
  import { Button } from 'primevue';

  defineProps<{
    carregando?: boolean;
  }>();

  const emit = defineEmits(['criar']);

  const empresaSelecionada = defineModel<Empresa | undefined>('empresa-selecionada', {
    required: true,
  });
</script>
