<template>
  <TelaUsuariosCabecalho
    v-model:empresa-selecionada="empresaSelecionada"
    :empresas
    @criar="abrirModalCriar"
  />
  <main class="px-4 mt-5 pb-10">
    <TelaUsuariosFiltros
      v-model:busca="filtro.busca"
      v-model:campo="filtro.campo"
      v-model:cargo="filtro.cargo"
      :empresa-selecionada="empresaSelecionada"
      :eh-admin
      @buscar="carregarUsuarios"
      @limpar="limparFiltros"
    />
    <TelaUsuariosTabela
      :usuarios="usuarios"
      :total="total"
      :paginacao="paginacao"
      :carregando="estaCarregandoUsuarios"
      :eh-admin
      @atualizar="carregarUsuarios"
      @editar="abrirModalEditar"
      @remover="confirmarRemocao"
    />
  </main>

  <TelaUsuariosFormulario
    v-model:visivel="modal.visivel"
    :modo="modal.modo"
    :usuario-id="modal.idUsuario"
    :carregando="modal.carregando"
    :api
    :eh-admin
    @salvar="tentaSalvarUsuario"
  />

  <ConfirmDialog />

  <Toast />
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue';
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
  import { useForm } from 'vee-validate';
  import { toTypedSchema } from '@vee-validate/zod';
  import { usuarioFormularioSchema } from '@/components/telas/tela-usuarios/schemas/usuario-formulario-schema';
  import useNotification from '@/composables/use-notification';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
  import { UsuarioEmpresa } from '@/components/telas/tela-usuarios/schemas/usuario-empresa-schema';

  const props = defineProps<{
    bearerToken?: string;
    ehAdmin?: boolean;
  }>();

  useApiService().setConfig({
    bearerToken: props.bearerToken,
  });

  const toast = useToast();
  const confirmacao = useConfirm();

  const { erro, sucesso } = useNotification();

  const api = useApiService().instance;

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
    carregando: false,
  });

  const { resetForm, handleSubmit, setFieldError } = useForm({
    validationSchema: toTypedSchema(usuarioFormularioSchema),
    initialValues: {
      empresas: [],
      cargo: 'NORMAL',
    },
  });

  const empresas = ref<Empresa[]>([]);
  const estaCarregandoEmpresas = ref(false);

  const usuarios = ref<Usuario[]>([]);
  const total = ref(0);
  const estaCarregandoUsuarios = ref(false);

  async function carregarEmpresas() {
    try {
      estaCarregandoEmpresas.value = true;

      const { dados } = await obterEmpresas(api, buscaEmpresa.value);

      empresas.value = dados.map((empresa) => ({
        ...empresa,
        nomeVirtual:
          empresa.nomeRazao.length > 30
            ? `${empresa.nomeRazao.slice(0, 30)}...`
            : empresa.nomeRazao,
      }));
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível carregar as empresas');
    } finally {
      estaCarregandoEmpresas.value = false;
    }
  }

  async function carregarUsuarios() {
    try {
      if (!empresaSelecionada.value?.id) {
        usuarios.value = [];
        total.value = 0;
        return;
      }

      estaCarregandoUsuarios.value = true;

      const { dados, paginacao: paginacaoRetornada } = await obterUsuarios(api, {
        empresaId: empresaSelecionada.value.id,
        busca: filtro.busca,
        campo: filtro.campo,
        cargo: filtro.cargo,
        paginaAtual: paginacao.paginaAtual,
        tamanhoPagina: paginacao.tamanhoPagina,
      });

      usuarios.value = dados;
      total.value = paginacaoRetornada?.total || 0;
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível carregar os usuários');
    } finally {
      estaCarregandoUsuarios.value = false;
    }
  }

  function limparFormulario() {
    const empresas: UsuarioEmpresa[] = [];

    if (empresaSelecionada.value) {
      empresas.push({
        id: empresaSelecionada.value.id,
        nomeFantasia: empresaSelecionada.value.nomeFantasia,
        nomeRazao: empresaSelecionada.value.nomeRazao,
        cargo: 'NORMAL',
        local: true,
        apagar: false,
      });
    }

    resetForm({
      values: {
        cargo: 'NORMAL',
        empresas,
        sistemasParaAdicionar: [],
        sistemasParaRemover: [],
      },
    });
    modal.idUsuario = 0;
  }

  function abrirModalCriar() {
    modal.modo = 'criar';
    limparFormulario();
    modal.visivel = true;
  }

  function abrirModalEditar(usuario: Usuario) {
    resetForm({
      values: {
        nome: usuario.nome,
        email: usuario.email,
        cnpjCpf: usuario.cnpjCpf,
        cargo: usuario.cargo === 'ADMIN' ? 'ADMIN' : 'NORMAL',
        senha: '',
        empresas: usuario.empresas.map((empresa) => ({
          nomeRazao: empresa.empresa.nomeRazao,
          nomeFantasia: empresa.empresa.nomeFantasia,
          id: empresa.empresa.id,
          cargo: empresa.cargo,
          local: false,
          apagar: false,
        })),
        sistemasParaAdicionar: [],
        sistemasParaRemover: [],
      },
    });

    modal.modo = 'editar';
    modal.idUsuario = usuario.id;

    modal.visivel = true;
  }

  function limparFiltros() {
    filtro.busca = '';
    filtro.campo = 'todos';
    filtro.cargo = 'todos';
    paginacao.paginaAtual = 1;
    carregarUsuarios();
  }

  const tentaSalvarUsuario = handleSubmit(async (dados) => {
    try {
      modal.carregando = true;

      if (modal.modo === 'criar') {
        if (!dados.senha) {
          setFieldError('senha', CAMPO_OBRIGATORIO);
          return;
        }

        if (dados.senha.length < 6) {
          setFieldError('senha', 'Deve conter no mínimo 6 caracteres');
          return;
        }

        await cadastrarUsuario(api, {
          ...dados,
          senha: dados.senha,
          empresasSelecionadas: dados.empresas.map((empresa) => ({
            id: empresa.id,
            cargo: empresa.cargo,
          })),
          sistemasParaAdicionar: dados.sistemasParaAdicionar,
        });
      } else {
        await atualizarUsuarioPorId(api, modal.idUsuario, {
          ...dados,
          senha: dados.senha || undefined,
          empresas: dados.empresas.map((empresa) => ({
            id: empresa.id,
            cargo: empresa.cargo,
            apagar: empresa.apagar,
          })),
          sistemasParaAdicionar: dados.sistemasParaAdicionar,
          sistemasParaRemover: dados.sistemasParaRemover,
        });
      }

      modal.visivel = false;

      const mensagem =
        modal.modo === 'criar'
          ? 'Usuário cadastrado com sucesso'
          : 'Usuário atualizado com sucesso';

      sucesso(mensagem);

      await carregarUsuarios();
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Falha ao salvar usuário');
    } finally {
      modal.carregando = false;
    }
  });

  function confirmarRemocao(usuario: Usuario) {
    confirmacao.require({
      header: 'Remover usuário?',
      message: `Você tem certeza que deseja remover o usuário ${usuario.nome}?`,
      acceptProps: { label: 'Remover', severity: 'danger' },
      rejectProps: { label: 'Cancelar', severity: 'secondary' },
      accept: async () => {
        try {
          await apagarUsuario(api, usuario.id);

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

  watch([empresaSelecionada, () => filtro.campo, () => filtro.cargo], () => {
    paginacao.paginaAtual = 1;
    carregarUsuarios();
  });

  watch(buscaEmpresa, () => {
    void carregarEmpresas();
  });

  onMounted(async () => {
    await carregarEmpresas();

    if (!empresaSelecionada.value) {
      empresaSelecionada.value = empresas.value[0];
    }
  });
</script>
