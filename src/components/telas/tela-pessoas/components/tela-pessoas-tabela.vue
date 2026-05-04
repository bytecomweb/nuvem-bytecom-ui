<template>
  <DataTable
    :value="pessoas"
    lazy
    paginator
    :total-records="total"
    :rows="tamanhoPagina"
    :loading="carregando"
    :rows-per-page-options="[5, 20, 50, 100]"
    striped-rows
    row-hover
    :row-class="() => 'cursor-pointer'"
    @update:rows="(novoTamanhoPagina) => (tamanhoPagina = novoTamanhoPagina)"
    @page="(e) => (pagina = e.page + 1)"
    @row-click="(e) => emit('selecionar-pessoa', e.data)"
  >
    <template #empty>
      <div class="flex flex-col items-center gap-2 py-8" v-if="!carregando">
        <i class="pi pi-info-circle text-3xl text-gray-500" />
        <span class="text-gray-500">Nenhuma pessoa encontrada.</span>
      </div>
    </template>
    <Column field="id" header="Código" />
    <Column field="nomeRazao" header="Nome Razão" />
    <Column header="Nome Fantasia">
      <template #body="{ data }">
        <TextoOpcional :valor="data.nomeFantasia" />
      </template>
    </Column>
    <Column header="E-mail" field="email" />
    <Column>
      <template #body="{ data }">
        <Tag
          :value="data.temSenha ? 'Ativo' : 'Senha indefinida'"
          :severity="data.temSenha ? 'success' : 'danger'"
          class="w-full cursor-pointer"
          v-tooltip="data.temSenha ? undefined : 'Esta pessoa não tem senha definida'"
        />
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <span class="pi pi-ellipsis-v cursor-pointer" @click="(e) => abrirPopover(data, e)" />
      </template>
    </Column>
  </DataTable>
  <Popover ref="popover">
    <div v-if="pessoaSelecionada">
      <span
        class="cursor-pointer hover:bg-gray-200 px-2 py-1 transition-all rounded-lg"
        @click="emit('redefinir-senha', pessoaSelecionada.id)"
      >
        {{ pessoaSelecionada.temSenha ? 'Redefinir senha' : 'Definir senha' }}
      </span>
    </div>
  </Popover>
</template>
<script lang="ts" setup>
import TextoOpcional from '@/components/texto-opcional.vue';
import { Pessoa } from '@/types/modelos/pessoa';
import { Column, DataTable, Popover, Tag } from 'primevue';
import { ref, useTemplateRef } from 'vue';

defineProps<{
  pessoas: Pessoa[];
  total: number;
  carregando: boolean;
}>();

const pagina = defineModel<number>('pagina', {
  required: true,
});

const tamanhoPagina = defineModel<number>('tamanhoPagina', {
  required: true,
});

const popover = useTemplateRef('popover');

const emit = defineEmits<{
  'redefinir-senha': [id: number];
  'selecionar-pessoa': [pessoa: Pessoa];
}>();

const pessoaSelecionada = ref<Pessoa>();

const abrirPopover = (pessoa: Pessoa, e: Event) => {
  if (popover.value) {
    pessoaSelecionada.value = pessoa;
    popover.value.show(e);
  }
};
</script>
