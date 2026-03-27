<template>
  <TelaUsuariosCabecalho
    v-model:empresa-selecionada="empresaSelecionada"
    @criar="abrirModalCriar"
  />
  <main class="px-4 mt-5 pb-10">
    <TelaUsuariosFiltros
      v-model:busca="filtro.busca"
      v-model:campo="filtro.campo"
      v-model:cargo="filtro.cargo"
      :empresa-selecionada="empresaSelecionada"
    />
    <TelaUsuariosTabela
      :usuarios="usuarios"
      :total="total"
      :paginacao="paginacao"
      :carregando="estaCarregandoUsuarios"
      @atualizar="carregarUsuarios"
      @editar="abrirModalEditar"
      @remover="confirmarRemocao"
    />
  </main>

  <TelaUsuariosFormulario
    v-model:visivel="modal.visivel"
    v-model:formulario="formulario"
    :modo="modal.modo"
    :usuario-id="modal.idUsuario"
    :carregando="estaSalvandoUsuario"
    @salvar="salvarUsuario"
  />

  <ConfirmDialog />

  <Toast />
</template>

<script setup lang="ts">
  import type { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { useConfirm } from 'primevue/useconfirm';
  import { useToast } from 'primevue/usetoast';
  import { useApiService } from '@/services/api';
  import TelaUsuariosCabecalho from '@/components/telas/tela-usuarios/components/tela-usuarios-cabecalho.vue';
  import TelaUsuariosFiltros from '@/components/telas/tela-usuarios/components/tela-usuarios-filtros.vue';
  import TelaUsuariosTabela from '@/components/telas/tela-usuarios/components/tela-usuarios-tabela.vue';
  import TelaUsuariosFormulario from '@/components/telas/tela-usuarios/components/tela-usuarios-formulario.vue';
  import { UsuarioCargo, Usuario } from '@/types/modelos/usuario';
  import { ConfirmDialog, Toast } from 'primevue';
  import { Empresa } from '@/types/modelos/empresa';
  import { TelaUsuariosCampoFiltro } from '@/components/telas/tela-usuarios/types/tela-usuarios-campo-filtro';
  import obterEmpresas from '@/data/empresa/obter-empresas';
  import obterUsuarios from '@/data/usuario/obter-usuarios';
  import cadastrarUsuario from '@/data/usuario/criar-usuario';
  import atualizarUsuarioPorId from '@/data/usuario/atualizar-usuario-por-id';
  import apagarUsuario from '@/data/usuario/apagar-usuario';

  const props = defineProps<{
    bearerToken?: string;
  }>();

  type RespostaUsuarios = {
    erro: boolean;
    mensagem: string;
    dados: Usuario[];
    paginacao: {
      paginaAtual: number;
      tamanhoPagina: number;
      total: number;
    };
  };

  type ToastLike = {
    add: (message: Record<string, unknown>) => void;
  };

  type ConfirmLike = {
    require: (options: Record<string, unknown>) => void;
  };

  const api = useApiService().instance;

  useApiService().setConfig({
    bearerToken: props.bearerToken,
  });

  const noopToast: ToastLike = {
    add: () => {},
  };

  const noopConfirm: ConfirmLike = {
    require: () => {},
  };

  let toast: ToastLike = noopToast;
  let confirmacao: ConfirmLike = noopConfirm;

  try {
    toast = useToast() as ToastLike;
  } catch {
    toast = noopToast;
  }

  try {
    confirmacao = useConfirm() as ConfirmLike;
  } catch {
    confirmacao = noopConfirm;
  }

  const buscaEmpresa = ref('');
  const empresaSelecionada = ref<Empresa | undefined>(undefined);

  const filtro = reactive({
    busca: '',
    campo: 'todos' as TelaUsuariosCampoFiltro,
    cargo: 'todos' as 'todos' | UsuarioCargo,
  });

  const paginacao = reactive({
    paginaAtual: 1,
    tamanhoPagina: 20,
  });

  const modal = reactive({
    visivel: false,
    modo: 'criar' as 'criar' | 'editar',
    idUsuario: 0,
  });

  const formulario = reactive({
    nome: '',
    email: '',
    cnpjCpf: '',
    cargo: 'NORMAL' as UsuarioCargo,
    senha: '',
  });

  const opcoesEmpresas = ref<Empresa[]>([]);
  const estaCarregandoEmpresas = ref(false);

  const usuarios = ref<Usuario[]>([]);
  const total = ref(0);
  const estaCarregandoUsuarios = ref(false);
  const estaSalvandoUsuario = ref(false);

  async function carregarEmpresas() {
    try {
      estaCarregandoEmpresas.value = true;

      const { dados } = await obterEmpresas(buscaEmpresa.value);

      opcoesEmpresas.value = dados.map((empresa) => ({
        ...empresa,
        nomeVirtual:
          empresa.nomeRazao.length > 30
            ? `${empresa.nomeRazao.slice(0, 30)}...`
            : empresa.nomeRazao,
      }));
    } finally {
      estaCarregandoEmpresas.value = false;
    }
  }

  async function carregarUsuarios() {
    if (!empresaSelecionada.value?.id) {
      usuarios.value = [];
      total.value = 0;
      return;
    }

    estaCarregandoUsuarios.value = true;
    try {
      const { dados, paginacao: paginacaoRetornada } = await obterUsuarios({
        empresaId: empresaSelecionada.value.id,
        busca: filtro.busca,
        campo: filtro.campo,
        cargo: filtro.cargo,
        paginaAtual: paginacao.paginaAtual,
        tamanhoPagina: paginacao.tamanhoPagina,
      });

      usuarios.value = dados;
      total.value = paginacaoRetornada?.total || 0;
    } finally {
      estaCarregandoUsuarios.value = false;
    }
  }

  function somenteNumeros(valor: string) {
    return valor.replace(/\D/g, '');
  }

  function limparFormulario() {
    formulario.nome = '';
    formulario.email = '';
    formulario.cnpjCpf = '';
    formulario.cargo = 'NORMAL';
    formulario.senha = '';
    modal.idUsuario = 0;
  }

  function abrirModalCriar() {
    modal.modo = 'criar';
    limparFormulario();
    modal.visivel = true;
  }

  function abrirModalEditar(usuario: Usuario) {
    modal.modo = 'editar';
    modal.idUsuario = usuario.id;
    formulario.nome = usuario.nome;
    formulario.email = usuario.email;
    formulario.cnpjCpf = usuario.cnpjCpf;
    formulario.cargo = usuario.cargo === 'ADMIN' ? 'ADMIN' : 'NORMAL';
    formulario.senha = '';
    modal.visivel = true;
  }

  function sincronizarUsuarios() {
    void carregarUsuarios();
  }

  function limparFiltros() {
    filtro.busca = '';
    filtro.campo = 'todos';
    filtro.cargo = 'todos';
    empresaSelecionada.value = undefined;
    paginacao.paginaAtual = 1;
    sincronizarUsuarios();
  }

  function validarFormulario() {
    if (!formulario.nome.trim()) return 'Informe o nome';
    if (!formulario.email.trim()) return 'Informe o e-mail';
    if (!formulario.cnpjCpf.trim()) return 'Informe o CNPJ/CPF';
    if (modal.modo === 'criar' && !formulario.senha.trim()) return 'Informe a senha';
    return null;
  }

  function salvarUsuario() {
    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      toast.add({ severity: 'warn', summary: 'Atenção', detail: erroValidacao, life: 2500 });
      return;
    }

    void salvarUsuarioRequest();
  }

  async function salvarUsuarioRequest() {
    estaSalvandoUsuario.value = true;
    try {
      if (modal.modo === 'criar') {
        await cadastrarUsuario({
          ...formulario,
          empresasSelecionadas: empresaSelecionada.value
            ? [{ id: empresaSelecionada.value.id, cargo: 'GERENTE' as const }]
            : [],
          sistemasParaAdicionar: [],
        });

        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário cadastrado',
          life: 2500,
        });
      } else {
        const payload: Record<string, unknown> = {
          nome: formulario.nome,
          email: formulario.email.trim().toLowerCase(),
          cnpjCpf: somenteNumeros(formulario.cnpjCpf),
          cargo: formulario.cargo,
        };

        if (formulario.senha) {
          payload.senha = formulario.senha;
        }

        await atualizarUsuarioPorId(modal.idUsuario, {
          ...formulario,
          empresas: empresaSelecionada.value
            ? [{ id: empresaSelecionada.value.id, cargo: 'GERENTE' as const }]
            : [],
          sistemasParaAdicionar: [],
          sistemasParaRemover: [],
        });

        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário atualizado',
          life: 2500,
        });
      }

      modal.visivel = false;
      await carregarUsuarios();
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail:
          modal.modo === 'criar' ? 'Falha ao cadastrar usuário' : 'Falha ao atualizar usuário',
        life: 3000,
      });
    } finally {
      estaSalvandoUsuario.value = false;
    }
  }

  function confirmarRemocao(usuario: Usuario) {
    confirmacao.require({
      header: 'Remover usuário?',
      message: `Você tem certeza que deseja remover o usuário ${usuario.nome}?`,
      acceptProps: { label: 'Remover', severity: 'danger' },
      rejectProps: { label: 'Cancelar', severity: 'secondary' },
      accept: async () => {
        try {
          await apagarUsuario(usuario.id);

          toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário removido',
            life: 2500,
          });
          await carregarUsuarios();
        } catch {
          toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao remover usuário',
            life: 3000,
          });
        }
      },
    });
  }

  watch(empresaSelecionada, () => {
    paginacao.paginaAtual = 1;
    void carregarUsuarios();
  });

  watch(buscaEmpresa, () => {
    void carregarEmpresas();
  });

  onMounted(() => {
    void carregarEmpresas();
  });
</script>
