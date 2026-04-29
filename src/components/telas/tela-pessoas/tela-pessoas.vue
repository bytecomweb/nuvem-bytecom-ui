<template>
  <TelaPessoasCabecalho :titulo :cadastrar-label v-model:empresa-selecionada="empresaSelecionada" />
</template>
<script lang="ts" setup>
  import TelaPessoasCabecalho from '@/components/telas/tela-pessoas/components/tela-pessoas-cabecalho.vue';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import obterPessoas from '@/data/pessoa/obter-pessoas';
  import { Empresa } from '@/types/modelos/empresa';
  import { Pessoa } from '@/types/modelos/pessoa';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { ref, watch } from 'vue';

  export type TelaPessoasProps = {
    titulo?: string;
    bearerToken?: string;
    ehAdmin?: boolean;
    cadastrarLabel?: string;
  };

  const {
    titulo = 'Pessoas',
    bearerToken,
    cadastrarLabel = 'Cadastrar pessoa',
  } = defineProps<TelaPessoasProps>();

  const api = useApi(bearerToken);

  const empresaSelecionada = ref<Empresa>();

  const pessoas = ref<Pessoa[]>([]);

  const { erro } = useNotification();

  const carregando = ref(false);

  const tentaObterPessoas = async () => {
    try {
      if (!empresaSelecionada.value) {
        return;
      }

      carregando.value = true;

      const { dados } = await obterPessoas(api, empresaSelecionada.value.id, {});

      pessoas.value = dados;
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível obter as pessoas');
    } finally {
      carregando.value = false;
    }
  };

  watch([empresaSelecionada], tentaObterPessoas);
</script>
