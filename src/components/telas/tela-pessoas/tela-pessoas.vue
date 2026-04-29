<template>
  <TelaPessoasCabecalho :titulo :cadastrar-label v-model:empresa-selecionada="empresaSelecionada" />
  <main class="px-5 mt-5">
    <div>
      <TelaPessoasTabela
        :pessoas
        :carregando
        :total="paginacao.total"
        v-model:pagina="paginacao.pagina"
        v-model:tamanho-pagina="paginacao.tamanho"
      />
    </div>
  </main>
</template>
<script lang="ts" setup>
  import TelaPessoasCabecalho from '@/components/telas/tela-pessoas/components/tela-pessoas-cabecalho.vue';
  import TelaPessoasTabela from '@/components/telas/tela-pessoas/components/tela-pessoas-tabela.vue';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import obterPessoas from '@/data/pessoa/obter-pessoas';
  import { Empresa } from '@/types/modelos/empresa';
  import { Pessoa } from '@/types/modelos/pessoa';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { reactive, ref, watch } from 'vue';

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
  const paginacao = reactive({
    pagina: 1,
    tamanho: 50,
    total: 1,
  });

  const tentaObterPessoas = async () => {
    try {
      if (!empresaSelecionada.value) {
        return;
      }

      carregando.value = true;

      const { dados, paginacao: paginacaoRetornada } = await obterPessoas(
        api,
        empresaSelecionada.value.id,
        {
          ...paginacao,
        }
      );

      pessoas.value = dados;

      paginacao.total = paginacaoRetornada.total;
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível obter as pessoas');
    } finally {
      carregando.value = false;
    }
  };

  watch([empresaSelecionada, () => paginacao.pagina, () => paginacao.tamanho], () => {
    tentaObterPessoas();
  });

  watch(empresaSelecionada, () => {
    paginacao.pagina = 1;
  });
</script>
