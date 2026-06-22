<template>
  <TelaPessoasCabecalho
    :titulo
    :cadastrar-label
    v-model:empresa-selecionada="empresaSelecionada"
    @criar="abrirModalCriar"
  />
  <main class="px-5 mt-8 flex flex-col gap-8">
    <TelaPessoasFiltro
      v-model:busca="filtros.busca"
      v-model:campos-para-buscar="filtros.camposParaBuscar"
      @buscar="tentaObterPessoas"
    />
    <div>
      <TelaPessoasTabela
        :pessoas
        :carregando
        :total="paginacao.total"
        :nao-encontrado-label
        v-model:pagina="paginacao.pagina"
        v-model:tamanho-pagina="paginacao.tamanho"
        @redefinir-senha="tentaRedefinirSenha"
        @selecionar-pessoa="abrirModalAtualizar"
      />
    </div>
  </main>
  <TelaPessoasModalRedefinicaoSenha v-model:link="linkRedefinicao" />
  <TelaPessoasModalFormulario
    v-if="empresaSelecionada"
    v-model:visivel="modalFormulario.visivel"
    :pessoa="modalFormulario.pessoa"
    :empresa-selecionada
    :eh-admin
    :empresa-ids-com-permissao-tabela-preco="empresaIdsComPermissaoTabelaPreco"
    :cadastrar-titulo
    :atualizar-titulo
    :empresas-label
    :enderecos-label
    :contatos-label
    @salvou="tentaObterPessoas"
    @redefinir-senha="tentaRedefinirSenha"
  />
</template>
<script lang="ts" setup>
import TelaPessoasCabecalho from '@/components/telas/tela-pessoas/components/tela-pessoas-cabecalho.vue';
import TelaPessoasFiltro from '@/components/telas/tela-pessoas/components/tela-pessoas-filtro.vue';
import TelaPessoasModalFormulario from '@/components/telas/tela-pessoas/components/tela-pessoas-modal-formulario.vue';
import TelaPessoasModalRedefinicaoSenha from '@/components/telas/tela-pessoas/components/tela-pessoas-modal-redefinicao-senha.vue';
import TelaPessoasTabela from '@/components/telas/tela-pessoas/components/tela-pessoas-tabela.vue';
import { TelaPessoasFiltros } from '@/components/telas/tela-pessoas/types/tela-pessoas-filtros';
import useApi from '@/composables/use-api';
import useNotification from '@/composables/use-notification';
import obterPessoas from '@/data/pessoa/obter-pessoas';
import redefinirSenhaPorPessoaId from '@/data/pessoa/redefinir-senha-por-pessoa-id';
import { Empresa } from '@/types/modelos/empresa';
import { Pessoa } from '@/types/modelos/pessoa';
import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
import { computed, reactive, ref, watch } from 'vue';

export type TelaPessoasProps = {
  titulo?: string;
  bearerToken?: string;
  ehAdmin?: boolean;
  empresasDoUsuario?: Array<{ id: number; cargo: 'GERENTE' | 'NORMAL' }>;
  cadastrarLabel?: string;
  naoEncontradoLabel?: string;
  atualizarTitulo?: string;
  cadastrarTitulo?: string;
  empresasLabel?: string;
  enderecosLabel?: string;
  contatosLabel?: string;
};

const {
  titulo = 'Pessoas',
  bearerToken,
  ehAdmin = false,
  empresasDoUsuario,
  cadastrarLabel = 'Cadastrar pessoa',
  naoEncontradoLabel = 'Nenhuma pessoa encontrada.',
  atualizarTitulo = 'Atualizar pessoa',
  cadastrarTitulo = 'Cadastrar pessoa',
  empresasLabel = 'Empresas da pessoa',
  enderecosLabel = 'Endereços da pessoa',
  contatosLabel = 'Contatos da pessoa',
} = defineProps<TelaPessoasProps>();

const empresaIdsComPermissaoTabelaPreco = computed(() => {
  if (!empresasDoUsuario?.length) return [];
  if (ehAdmin) return empresasDoUsuario.map((e) => e.id);
  return empresasDoUsuario
    .filter((e) => e.cargo === 'GERENTE')
    .map((e) => e.id);
});

const api = useApi(bearerToken);

const empresaSelecionada = defineModel<Empresa | undefined>('empresaSelecionada');

const pessoas = ref<Pessoa[]>([]);

const { erro } = useNotification();

const carregando = ref(false);
const paginacao = reactive({
  pagina: 1,
  tamanho: 50,
  total: 1,
});
const filtros = reactive<TelaPessoasFiltros>({
  busca: '',
  camposParaBuscar: 'todos',
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
        busca: filtros.busca,
        ...paginacao,
        campoParaBuscar: filtros.camposParaBuscar,
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

watch(
  [empresaSelecionada, () => paginacao.pagina, () => paginacao.tamanho, filtros],
  () => {
    tentaObterPessoas();
  },
  {
    immediate: true,
  }
);

watch(
  [empresaSelecionada, filtros],
  () => {
    paginacao.pagina = 1;
  },
  {
    immediate: true,
  }
);

const linkRedefinicao = ref<string>();

const tentaRedefinirSenha = async (pessoaId: number) => {
  try {
    const { dados } = await redefinirSenhaPorPessoaId(api, pessoaId);

    linkRedefinicao.value = dados.link;
  } catch (err) {
    erro(obterErroDaRequisicao(err) || 'Não foi possível redefinir a senha');
  }
};

const modalFormulario = reactive({
  visivel: false,
  pessoa: undefined as undefined | Pessoa,
});

const abrirModalCriar = () => {
  modalFormulario.pessoa = undefined;
  modalFormulario.visivel = true;
};

const abrirModalAtualizar = (pessoa: Pessoa) => {
  modalFormulario.pessoa = pessoa;
  modalFormulario.visivel = true;
};
</script>
