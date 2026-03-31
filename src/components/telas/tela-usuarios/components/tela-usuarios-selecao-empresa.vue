<template>
  <Dialog
    v-model:visible="visivel"
    header="Gerenciar empresas"
    class="w-4/6"
    modal
    maximizable
    :block-scroll="false"
    :close-on-escape="false"
  >
    <form class="flex flex-col gap-4 mt-1" @submit.prevent>
      <div class="flex justify-center">
        <div class="w-3/6">
          <FloatLabel variant="on">
            <AutoComplete
              v-model="busca"
              fluid
              dropdown
              :suggestions="empresas"
              empty-search-message="Nenhuma empresa encontrada"
              option-label="nomeRazao"
              @complete="(e) => tentaBuscarEmpresas()"
              @option-select="(e) => tentaSelecionarEmpresa(e.value)"
            />
          </FloatLabel>
        </div>
      </div>
      <div>
        <DataTable :value="empresasSelecionadas.filter((empresa) => !empresa.apagar)">
          <Column field="nome" header="Nome" class="py-2 w-3/6">
            <template #body="slotProps">
              <div
                class="hover:underline cursor-pointer"
                @click="emit('abrir:acessos', slotProps.data.id)"
              >
                <p>{{ slotProps.data.nomeRazao }}</p>
                <span class="text-sm text-gray-400">
                  {{ slotProps.data.nomeFantasia }}
                </span>
              </div>
            </template>
          </Column>
          <Column field="cargo" header="Cargo" class="w-3/6">
            <template #body="slotProps">
              <div class="w-4/6">
                <Select
                  v-model="slotProps.data.cargo"
                  :options="cargos"
                  fluid
                  option-label="nome"
                  option-value="valor"
                />
              </div>
            </template>
          </Column>
          <Column>
            <template #body="slotProps">
              <Button
                icon="pi pi-times"
                link
                class="text-red-600!"
                @click="tentaRemoverEmpresa(slotProps.data)"
              />
            </template>
          </Column>
          <template #empty>
            <div class="w-100" :class="{ 'text-center': carregando }">
              <span v-if="carregando" class="pi pi-spin pi-spinner" style="font-size: 1.6rem" />
              <p v-else>Nenhuma empresa adicionada</p>
            </div>
          </template>
        </DataTable>
      </div>
    </form>
  </Dialog>
</template>
<script lang="ts" setup>
  import { UsuarioEmpresa } from '@/components/telas/tela-usuarios/schemas/usuario-empresa-schema';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import obterEmpresasDoUsuario from '@/data/usuario/obter-empresas-do-usuario';
  import { Empresa } from '@/types/modelos/empresa';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { AutoComplete, Button, Column, DataTable, Dialog, FloatLabel, Select } from 'primevue';
  import { ref, watch } from 'vue';

  const api = useApi();

  const { aviso, erro } = useNotification();

  const busca = ref('');

  const visivel = defineModel<boolean>('visivel', {
    required: true,
  });

  const empresasSelecionadas = defineModel<UsuarioEmpresa[]>('empresasSelecionadas', {
    required: true,
  });

  const empresas = ref<Empresa[]>([]);

  const carregando = ref(false);

  const emit = defineEmits<{
    'abrir:acessos': [empresaId: number];
  }>();

  const cargos = ref([
    {
      nome: 'Gerente',
      valor: 'GERENTE',
    },
    {
      nome: 'Funcionário',
      valor: 'NORMAL',
    },
  ]);

  const tentaRemoverEmpresa = (empresa: UsuarioEmpresa) => {
    if (empresa.local) {
      empresasSelecionadas.value.splice(empresasSelecionadas.value.indexOf(empresa), 1);
    } else {
      empresasSelecionadas.value[empresasSelecionadas.value.indexOf(empresa)].apagar = true;
    }
  };

  const tentaSelecionarEmpresa = ({ id, nomeRazao, nomeFantasia }: Empresa) => {
    setTimeout(() => {
      busca.value = '';
    }, 0);

    const empresa = empresasSelecionadas.value.filter((empresa) => empresa.id === id)[0];

    if (empresa && !empresa.apagar) {
      return aviso('Empresa já selecionada');
    }

    if (empresa && empresa.apagar) {
      const index = empresasSelecionadas.value.indexOf(empresa);
      empresa.apagar = false;
      empresa.cargo = 'NORMAL';
      empresasSelecionadas.value.splice(0, 0, empresasSelecionadas.value.splice(index, 1)[0]);
      return;
    }

    empresasSelecionadas.value.push({
      id,
      nomeFantasia: nomeFantasia,
      nomeRazao: nomeRazao,
      cargo: 'NORMAL',
      local: true,
      apagar: false,
    });
  };

  const tentaBuscarEmpresas = async () => {
    try {
      const { dados } = await obterEmpresasDoUsuario(api, busca.value);
      empresas.value = dados;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('obterEmpresasDoUsuario', err);
      }

      erro(obterErroDaRequisicao(err) || 'Não foi possível obter as empresas');
    }
  };

  watch(busca, tentaBuscarEmpresas);
</script>
