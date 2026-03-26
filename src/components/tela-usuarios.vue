<template>
  <div class="h-screen bg-white">
    <header class="border-b p-3 flex justify-between items-center gap-3">
      <h2>Usuários</h2>

      <div class="flex items-center gap-3">
        <Button
          label="Cadastrar usuário"
          icon="pi pi-plus"
          @click="abrirModalCriar"
        />

        <div class="w-[320px]">
          <Select
            v-model="empresaSelecionadaTopo"
            :options="opcoesEmpresas"
            option-label="nomeVirtual"
            placeholder="Empresa selecionada"
            filter
            fluid
            :loading="estaCarregandoEmpresas"
            @show="buscaEmpresa = ''"
            @filter="(e) => (buscaEmpresa = String(e.value || ''))"
          >
            <template #empty>
              <p class="text-xs">Nenhuma empresa encontrada</p>
            </template>
            <template #emptyfilter>
              <p class="text-xs">Nenhuma empresa encontrada</p>
            </template>
          </Select>
        </div>
      </div>
    </header>

    <main class="px-4 mt-5 pb-10">
      <div class="flex items-center gap-3">
        <div class="w-[320px] relative">
          <InputText
            v-model="filtro.busca"
            fluid
            type="text"
            placeholder="Buscar..."
            @keydown="(e) => e.key === 'Enter' && sincronizarUsuarios()"
          />
          <span
            v-if="temFiltroAtivo"
            class="pi pi-times absolute right-3 top-3 cursor-pointer"
            @click="limparFiltros"
          />
        </div>

        <Select
          v-model="filtro.campo"
          :options="opcoesCampo"
          option-label="label"
          option-value="value"
          placeholder="Buscar por"
          class="w-[180px]"
        />

        <Select
          v-model="filtro.cargo"
          :options="opcoesCargo"
          option-label="label"
          option-value="value"
          placeholder="Cargo"
          class="w-[180px]"
        />

        <Button icon="pi pi-search" rounded @click="sincronizarUsuarios()" />
      </div>

      <DataTable
        class="mt-5"
        :value="usuarios"
        lazy
        paginator
        :total-records="total"
        :rows="paginacao.tamanhoPagina"
        :rows-per-page-options="[5, 20, 50, 100]"
        :loading="estaCarregandoUsuarios"
        row-hover
        @update:rows="(novo) => { paginacao.tamanhoPagina = novo; paginacao.paginaAtual = 1; sincronizarUsuarios(); }"
        @page="(evt) => { paginacao.paginaAtual = evt.page + 1; sincronizarUsuarios(); }"
        @row-click="(evt) => abrirModalEditar(evt.data)"
      >
        <Column field="nome" header="Nome" />
        <Column field="email" header="E-mail" />
        <Column field="cnpjCpf" header="CNPJ/CPF" />
        <Column field="cargo" header="Cargo" />
        <Column header="Ações" style="width: 140px">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" text rounded @click.stop="abrirModalEditar(data)" />
              <Button icon="pi pi-trash" text rounded severity="danger" @click.stop="confirmarRemocao(data)" />
            </div>
          </template>
        </Column>

        <template #empty>
          <p>Nenhum usuário encontrado</p>
        </template>
      </DataTable>
    </main>
  </div>

  <Dialog
    v-model:visible="modal.visivel"
    :header="modal.modo === 'criar' ? 'Cadastrar usuário' : 'Editar usuário'"
    class="w-[620px]"
    modal
  >
    <form class="flex flex-col gap-4 mt-2" @submit.prevent>
      <FloatLabel variant="on">
        <InputText id="nome" v-model="formulario.nome" fluid />
        <label for="nome">Nome</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputText id="email" v-model="formulario.email" fluid type="email" />
        <label for="email">E-mail</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputText id="cnpjCpf" v-model="formulario.cnpjCpf" fluid />
        <label for="cnpjCpf">CNPJ/CPF</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Select
          id="cargo"
          v-model="formulario.cargo"
          :options="opcoesCargoForm"
          option-label="label"
          option-value="value"
          fluid
        />
        <label for="cargo">Cargo</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Password
          id="senha"
          v-model="formulario.senha"
          :feedback="false"
          toggle-mask
          fluid
          autocomplete="new-password"
        />
        <label for="senha">{{ modal.modo === 'criar' ? 'Senha' : 'Nova senha (opcional)' }}</label>
      </FloatLabel>
    </form>

    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="modal.visivel = false" />
        <Button
          :label="modal.modo === 'criar' ? 'Cadastrar' : 'Salvar'"
          :loading="estaSalvandoUsuario"
          @click="salvarUsuario"
        />
      </div>
    </template>
  </Dialog>

  <ConfirmDialog />

  <Toast />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useApiService } from '@/services/api';

const props = defineProps<{
  bearerToken?: string;
}>();

type CargoUsuario = 'ADMIN' | 'NORMAL' | 'GERENTE';
type CampoFiltro = 'todos' | 'nome' | 'email';

type EmpresaOpcao = {
  id: number;
  nomeRazao: string;
  nomeFantasia: string;
  cnpj: string;
  status: string;
  nomeVirtual: string;
};

type UsuarioTabela = {
  id: number;
  nome: string;
  email: string;
  cnpjCpf: string;
  cargo: CargoUsuario;
  empresas: Array<{
    empresa: {
      id: number;
      nomeRazao: string;
      nomeFantasia: string;
      cnpj: string;
    };
    cargo: 'GERENTE' | 'NORMAL';
  }>;
  sistemas: Array<{
    idEmpresa: number;
    sistema: {
      id: number;
      nome: string;
      imagem: string | null;
      linkBackend: string | null;
      linkFrontend: string | null;
    };
  }>;
};

type RespostaUsuarios = {
  erro: boolean;
  mensagem: string;
  dados: UsuarioTabela[];
  paginacao: {
    paginaAtual: number;
    tamanhoPagina: number;
    total: number;
  };
};

type RespostaEmpresas = {
  erro: boolean;
  mensagem: string;
  dados: Array<{
    id: number;
    nomeRazao: string;
    nomeFantasia: string;
    cnpj: string;
    status: string;
  }>;
};

type ToastLike = {
  add: (message: Record<string, unknown>) => void;
};

type ConfirmLike = {
  require: (options: Record<string, unknown>) => void;
};

const api = useApiService().instance;

function getAuthHeaders() {
  if (!props.bearerToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${props.bearerToken}`
  };
}

const noopToast: ToastLike = {
  add: () => {}
};

const noopConfirm: ConfirmLike = {
  require: () => {}
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
const empresaSelecionadaTopo = ref<EmpresaOpcao | undefined>(undefined);

const filtro = reactive({
  busca: '',
  campo: 'todos' as CampoFiltro,
  cargo: 'todos' as 'todos' | CargoUsuario
});

const paginacao = reactive({
  paginaAtual: 1,
  tamanhoPagina: 20
});

const modal = reactive({
  visivel: false,
  modo: 'criar' as 'criar' | 'editar',
  idUsuario: 0
});

const formulario = reactive({
  nome: '',
  email: '',
  cnpjCpf: '',
  cargo: 'NORMAL' as 'ADMIN' | 'NORMAL',
  senha: ''
});

const opcoesCampo = [
  { label: 'Todos', value: 'todos' },
  { label: 'Nome', value: 'nome' },
  { label: 'E-mail', value: 'email' }
];

const opcoesCargo = [
  { label: 'Todos', value: 'todos' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Normal', value: 'NORMAL' },
  { label: 'Gerente', value: 'GERENTE' }
];

const opcoesCargoForm = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Normal', value: 'NORMAL' }
];

const opcoesEmpresas = ref<EmpresaOpcao[]>([]);
const estaCarregandoEmpresas = ref(false);

const usuarios = ref<UsuarioTabela[]>([]);
const total = ref(0);
const estaCarregandoUsuarios = ref(false);
const estaSalvandoUsuario = ref(false);

const temFiltroAtivo = computed(() => {
  return (
    !!filtro.busca ||
    filtro.campo !== 'todos' ||
    filtro.cargo !== 'todos' ||
    !!empresaSelecionadaTopo.value
  );
});

async function carregarEmpresas() {
  estaCarregandoEmpresas.value = true;
  try {
    const { data } = await api.get<RespostaEmpresas>('/api/v1/usuarios/empresas', {
      params: { busca: buscaEmpresa.value || undefined },
      headers: getAuthHeaders()
    });

    opcoesEmpresas.value = data.dados.map((empresa) => ({
      ...empresa,
      nomeVirtual: empresa.nomeRazao.length > 30 ? `${empresa.nomeRazao.slice(0, 30)}...` : empresa.nomeRazao
    }));
  } finally {
    estaCarregandoEmpresas.value = false;
  }
}

async function carregarUsuarios() {
  if (!empresaSelecionadaTopo.value?.id) {
    usuarios.value = [];
    total.value = 0;
    return;
  }

  estaCarregandoUsuarios.value = true;
  try {
    const params: Record<string, unknown> = {
      pagina: paginacao.paginaAtual,
      tamanhoPagina: paginacao.tamanhoPagina,
      empresas: true,
      sistemas: true,
      idEmpresa: empresaSelecionadaTopo.value.id,
      cargo: filtro.cargo === 'todos' ? undefined : filtro.cargo
    };

    if (filtro.campo !== 'todos' && filtro.busca) {
      params[filtro.campo] = filtro.busca;
    }

    const { data } = await api.get<RespostaUsuarios>('/api/v1/usuarios', {
      params,
      headers: getAuthHeaders()
    });

    usuarios.value = data.dados;
    total.value = data.paginacao?.total || 0;
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

function abrirModalEditar(usuario: UsuarioTabela) {
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
  empresaSelecionadaTopo.value = undefined;
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
      const payload = {
        nome: formulario.nome,
        email: formulario.email.trim().toLowerCase(),
        cnpjCpf: somenteNumeros(formulario.cnpjCpf),
        cargo: formulario.cargo,
        senha: formulario.senha,
        empresasParaAdicionar: empresaSelecionadaTopo.value
          ? [{ id: empresaSelecionadaTopo.value.id, cargo: 'GERENTE' as const }]
          : [],
        sistemasParaAdicionar: []
      };

      await api.post('/api/v1/usuarios', payload, {
        headers: getAuthHeaders()
      });
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário cadastrado', life: 2500 });
    } else {
      const payload: Record<string, unknown> = {
        nome: formulario.nome,
        email: formulario.email.trim().toLowerCase(),
        cnpjCpf: somenteNumeros(formulario.cnpjCpf),
        cargo: formulario.cargo
      };

      if (formulario.senha) {
        payload.senha = formulario.senha;
      }

      await api.patch(`/api/v1/usuarios/${modal.idUsuario}`, payload, {
        headers: getAuthHeaders()
      });
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado', life: 2500 });
    }

    modal.visivel = false;
    await carregarUsuarios();
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: modal.modo === 'criar' ? 'Falha ao cadastrar usuário' : 'Falha ao atualizar usuário',
      life: 3000
    });
  } finally {
    estaSalvandoUsuario.value = false;
  }
}

function confirmarRemocao(usuario: UsuarioTabela) {
  confirmacao.require({
    header: 'Remover usuário?',
    message: `Você tem certeza que deseja remover o usuário ${usuario.nome}?`,
    acceptProps: { label: 'Remover', severity: 'danger' },
    rejectProps: { label: 'Cancelar', severity: 'secondary' },
    accept: async () => {
      try {
        await api.delete(`/api/v1/usuarios/${usuario.id}`, {
          headers: getAuthHeaders()
        });
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário removido', life: 2500 });
        await carregarUsuarios();
      } catch {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao remover usuário', life: 3000 });
      }
    }
  });
}

watch(empresaSelecionadaTopo, () => {
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