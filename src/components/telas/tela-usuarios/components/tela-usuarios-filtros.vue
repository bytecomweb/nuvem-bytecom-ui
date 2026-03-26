<template>
  <div class="flex items-center gap-3">
    <div class="w-[320px] relative">
      <InputText v-model="busca" fluid type="text" placeholder="Buscar..." />
      <span
        v-if="temFiltroAtivo"
        class="pi pi-times absolute right-3 top-3 cursor-pointer"
        @click="emit('limpar')"
      />
    </div>

    <Select
      v-model="campo"
      :options="opcoesCampo"
      option-label="label"
      option-value="value"
      placeholder="Buscar por"
      class="w-45"
    />

    <Select
      v-model="cargo"
      :options="opcoesCargo"
      option-label="label"
      option-value="value"
      placeholder="Cargo"
      class="w-45"
    />

    <Button icon="pi pi-search" rounded @click="emit('buscar')" />
  </div>
</template>
<script lang="ts" setup>
  import { TelaUsuariosCampoFiltro } from '@/components/telas/tela-usuarios/types/tela-usuarios-campo-filtro';
  import { Empresa } from '@/types/modelos/empresa';
  import { CargoUsuario } from '@/types/modelos/usuario';
  import { Button, InputText, Select } from 'primevue';
  import { computed } from 'vue';

  const { empresaSelecionada } = defineProps<{
    empresaSelecionada?: Empresa;
  }>();

  const busca = defineModel<string>('busca', {
    required: true,
  });

  const campo = defineModel<TelaUsuariosCampoFiltro>('campo', {
    required: true,
    default: 'todos',
  });

  const cargo = defineModel<CargoUsuario | 'todos'>('cargo', {
    required: true,
    default: 'todos',
  });

  const temFiltroAtivo = computed(() => {
    return (
      !!busca.value || campo.value !== 'todos' || cargo.value !== 'todos' || !!empresaSelecionada
    );
  });

  const emit = defineEmits(['limpar', 'buscar']);

  const opcoesCampo = [
    { label: 'Todos', value: 'todos' },
    { label: 'Nome', value: 'nome' },
    { label: 'E-mail', value: 'email' },
  ];

  const opcoesCargo = [
    { label: 'Todos', value: 'todos' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Normal', value: 'NORMAL' },
    { label: 'Gerente', value: 'GERENTE' },
  ];
</script>
