<template>
  <Dialog v-model:visible="visivel" modal class="w-3/6" header="Gerenciar acessos do usuário">
    <div class="flex justify-center">
      <div class="w-3/6">
        <FloatLabel variant="on">
          <AutoComplete
            v-model="busca"
            fluid
            dropdown
            option-label="nome"
            :suggestions="sistemas"
            empty-search-message="Nenhum sistema encontrado"
            @complete="(e) => tentaBuscarSistemasDaEmpresa(e.query)"
            @option-select="(e) => tentaSelecionarSistema(e.value)"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <Avatar
                  v-if="!slotProps.option.imagem"
                  shape="square"
                  class="w-15"
                  :label="slotProps.option.nome.substring(0, 1)"
                />
                <img :src="slotProps.option.imagem" class="w-15" />
                <p class="m-0">
                  {{ slotProps.option.nome }}
                </p>
              </div>
            </template>
          </AutoComplete>
        </FloatLabel>
      </div>
    </div>
    <DataTable
      :value="
        sistemasParaAdicionar.fields.value.filter(
          (sistema) =>
            !sistemasParaRemover.fields.value.some(
              (sistemaParaRemover) =>
                sistemaParaRemover.value.idSistema === sistema.value.idSistema &&
                sistemaParaRemover.value.idEmpresa === sistema.value.idEmpresa
            )
        )
      "
    >
      <!-- :value="sistemasParaAdicionar.fields.value.filter((sistema) => !sistemasParaRemover.includes(sistema))" -->
      <Column class="w-[90%]" header="Sistemas">
        <template #body="slotProps">
          <div class="flex gap-2 items-center">
            <div class="flex items-center gap-2">
              <Avatar
                v-if="!slotProps.data.value.imagem"
                shape="square"
                class="w-15"
                :label="slotProps.data.value.nome.substring(0, 1)"
              />
              <img :src="slotProps.data.value.imagem" class="w-15" v-else />
            </div>
            <p>
              {{ slotProps.data.value.nome }}
            </p>
          </div>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <Button
            icon="pi pi-times"
            link
            class="text-red-600!"
            @click="tentaRemoverSistema(slotProps.data)"
          />
        </template>
      </Column>
      <template #empty>
        <p>Nenhum acesso adicionado</p>
      </template>
    </DataTable>
  </Dialog>
</template>
<script lang="ts" setup>
  import { UsuarioSistema } from '@/components/telas/tela-usuarios/schemas/usuario-sistema-schema';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import obterSistemasDaEmpresa from '@/data/empresa/obter-sistemas-da-empresa';
  import { Sistema } from '@/types/modelos/sistema';
  import { Usuario } from '@/types/modelos/usuario';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { AxiosInstance } from 'axios';
  import { AutoComplete, Avatar, Button, Column, DataTable, Dialog, FloatLabel } from 'primevue';
  import { FieldEntry, useField, useFieldArray } from 'vee-validate';
  import { ref, watch } from 'vue';

  const { empresaId, usuario } = defineProps<{
    empresaId?: number;
    usuario?: Usuario;
  }>();

  const api = useApi();

  const visivel = defineModel<boolean>('visivel', {
    required: true,
  });

  const { erro, aviso } = useNotification();

  const sistemas = ref<Sistema[]>([]);

  const busca = ref('');

  const sistemasParaAdicionar = useFieldArray<UsuarioSistema>('sistemasParaAdicionar');

  const sistemasParaRemover = useFieldArray<UsuarioSistema>('sistemasParaRemover');

  const tentaSelecionarSistema = (sistema: Sistema) => {
    if (!empresaId) return;

    setTimeout(() => {
      busca.value = '';
    }, 0);

    const taParaRemover = sistemasParaRemover.fields.value.find(
      (sistemaParaRemover) =>
        sistemaParaRemover.value.idSistema === sistema.id &&
        sistemaParaRemover.value.idEmpresa === empresaId
    );

    if (taParaRemover) {
      sistemasParaRemover.remove(taParaRemover.key as number);
    } else {
      const temOSistema = sistemasParaAdicionar.fields.value.find(
        (sistemaParaAdicionar) =>
          sistemaParaAdicionar.value.idSistema === sistema.id &&
          sistemaParaAdicionar.value.idEmpresa === empresaId
      );

      if (temOSistema) {
        aviso('O sistema já foi adicionado para o usuário');
        return;
      }

      sistemasParaAdicionar.push({
        idSistema: sistema.id,
        idEmpresa: empresaId,
        nome: sistema.nome,
        imagem: sistema.imagem,
      });
    }
  };

  const tentaRemoverSistema = (sistema: FieldEntry<UsuarioSistema>) => {
    if (!empresaId) return;

    const idx = sistemasParaRemover.fields.value.findIndex(
      (sistemaParaRemover) =>
        sistemaParaRemover.value.idSistema === sistema.value.idSistema &&
        sistemaParaRemover.value.idEmpresa === empresaId
    );

    if (idx === -1) {
      sistemasParaAdicionar.remove(idx);
    } else {
      sistemasParaRemover.push(sistema.value);
    }
  };

  watch(
    () => empresaId,
    () => {
      if (!usuario) {
        return (sistemas.value = []);
      }

      sistemas.value = usuario.sistemas
        .filter((sistema) => sistema.idEmpresa === empresaId)
        .map((usuarioSistema) => ({
          id: usuarioSistema.idEmpresa,
          nome: usuarioSistema.sistema.nome,
          imagem: usuarioSistema.sistema.imagem,
        }));
    }
  );

  const tentaBuscarSistemasDaEmpresa = async (busca?: string) => {
    try {
      if (!empresaId) return;

      const { dados } = await obterSistemasDaEmpresa(api, empresaId, busca);

      sistemas.value = dados;
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível obter os sistemas da empresa');
    }
  };
</script>
