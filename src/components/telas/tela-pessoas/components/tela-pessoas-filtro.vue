<template>
  <div class="w-full flex justify-center">
    <div class="max-w-150 w-full">
      <div class="gap-3 grid grid-cols-[2fr_5fr_1fr]">
        <!-- <Label label="Campos para buscar"> -->
        <Select
          v-model="camposParaBuscar"
          :options="camposParaBuscarOpcoes"
          option-label="nome"
          option-value="valor"
        />
        <!-- </Label> -->
        <InputGroup class="w-full">
          <InputText
            v-model="buscaInterna"
            placeholder="Buscar..."
            fluid
            class="h-11"
            @keyup.enter="busca = buscaInterna"
          />
          <InputGroupAddon v-if="temFiltros">
            <Button
              icon="pi pi-times"
              text
              rounded
              aria-label="Limpar filtros"
              @click="limparFiltros"
            />
          </InputGroupAddon>
        </InputGroup>
        <Button
          icon="pi pi-search"
          rounded
          type="button"
          aria-label="Buscar"
          class="h-11! w-11! p-0! shrink-0"
          @click="emit('buscar')"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  // import Label from '@/components/label.vue';
  import { TelasPessoasCamposParaBuscar } from '@/components/telas/tela-pessoas/types/tela-pessoas-campos-para-buscar';
  import { SelectPadrao } from '@/types/select-padrao';
  import { Button, InputGroup, InputGroupAddon, InputText, Select } from 'primevue';
  import { computed, ref, watch } from 'vue';

  const busca = defineModel<string>('busca', {
    required: true,
  });

  const emit = defineEmits(['buscar']);

  const buscaInterna = ref<string>('');

  const camposParaBuscar = defineModel<TelasPessoasCamposParaBuscar>('camposParaBuscar', {
    required: true,
  });

  const camposParaBuscarOpcoes: SelectPadrao<TelasPessoasCamposParaBuscar>[] = [
    {
      nome: 'Todos',
      valor: 'todos',
    },
    {
      nome: 'Nome Razão',
      valor: 'nomeRazao',
    },
    {
      nome: 'Nome Fantasia',
      valor: 'nomeFantasia',
    },
    {
      nome: 'CPF / CNPJ',
      valor: 'cpfCnpj',
    },
    {
      nome: 'E-mail',
      valor: 'email',
    },
    {
      nome: 'Telefone',
      valor: 'telefone',
    },
  ];

  watch(busca, () => {
    buscaInterna.value = busca.value;
  });

  const limparFiltros = () => {
    busca.value = '';
    camposParaBuscar.value = 'todos';
  };

  const temFiltros = computed(() => busca.value || camposParaBuscar.value !== 'todos');
</script>
