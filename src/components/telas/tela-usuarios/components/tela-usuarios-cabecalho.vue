<template>
  <header class="border-b p-3 flex justify-between items-center gap-3">
    <h2>Usuários</h2>

    <div class="flex items-center gap-3">
      <Button label="Cadastrar usuário" icon="pi pi-plus" @click="emit('criar')" />

      <div class="w-[320px]">
        <Select
          v-model="empresaSelecionada"
          :options="empresas"
          option-label="nomeVirtual"
          placeholder="Empresa selecionada"
          filter
          fluid
          :loading="carregando"
          @show="busca = ''"
          @filter="(e) => (busca = String(e.value || ''))"
        >
          <template #empty>
            <p class="text-xs">Nenhuma empresa encontrada</p>
          </template>
          <template #emptyfilter>
            <p class="text-xs">Nenhuma empresa encontrada</p>
          </template>
        </Select>
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
  import { Empresa } from '@/types/modelos/empresa';
  import { Button, Select } from 'primevue';
  import { ref } from 'vue';

  const { empresas = [] } = defineProps<{
    carregando?: boolean;
    empresas?: Empresa[];
  }>();

  const emit = defineEmits(['criar']);

  const empresaSelecionada = defineModel<Empresa | undefined>('empresa-selecionada', {
    required: true,
  });

  const busca = ref('');
</script>
