<template>
  <DataTable
    class="mt-5"
    :value="usuarios"
    lazy
    paginator
    :total-records="total"
    :rows="paginacao.tamanhoPagina"
    :rows-per-page-options="[5, 20, 50, 100]"
    :loading="carregando"
    row-hover
    @update:rows="
      (novo) => {
        paginacao.tamanhoPagina = novo;
        paginacao.paginaAtual = 1;
        emit('atualizar');
      }
    "
    @page="
      (evt) => {
        paginacao.paginaAtual = evt.page + 1;
        emit('atualizar');
      }
    "
    @row-click="(evt) => emit('editar', evt.data)"
  >
    <Column field="nome" header="Nome" />
    <Column field="email" header="E-mail" />
    <Column field="cnpjCpf" header="CNPJ/CPF" />
    <Column field="cargo" header="Cargo" v-if="ehAdmin">
      <template #body="{ data }">
        <Tag
          :value="LEGENDA_CARGOS[data.cargo as keyof typeof LEGENDA_CARGOS]"
          severity="secondary"
        />
      </template>
    </Column>
    <Column header="Ações" style="width: 140px">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button icon="pi pi-pencil" text rounded @click.stop="emit('editar', data)" />
          <Button
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            @click.stop="emit('remover', data)"
          />
        </div>
      </template>
    </Column>

    <template #empty>
      <p>Nenhum usuário encontrado</p>
    </template>
  </DataTable>
</template>
<script lang="ts" setup>
  import { DataTable, Column, Button, Tag } from 'primevue';
  import { type Usuario } from '@/types/modelos/usuario';

  const usuarios = defineModel<Usuario[]>('usuarios', {
    required: true,
    default: () => [],
  });

  const total = defineModel<number>('total', {
    required: true,
    default: 0,
  });

  const paginacao = defineModel<{
    paginaAtual: number;
    tamanhoPagina: number;
  }>('paginacao', {
    required: true,
    default: () => ({
      paginaAtual: 1,
      tamanhoPagina: 20,
    }),
  });

  const emit = defineEmits<{
    atualizar: [];
    editar: [usuario: Usuario];
    remover: [usuario: Usuario];
  }>();

  defineProps<{
    carregando?: boolean;
    ehAdmin?: boolean;
  }>();

  const LEGENDA_CARGOS = {
    ADMIN: 'Admin',
    NORMAL: 'Funcionário',
  };
</script>
