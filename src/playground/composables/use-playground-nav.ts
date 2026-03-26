import { ref, computed } from 'vue';

export type TelaDemo = {
  id: string;
  titulo: string;
  descricao: string;
  grupo: string;
};

const TELAS_DISPONIVEIS: TelaDemo[] = [
  {
    id: 'tela-usuarios',
    titulo: 'Gestão de Usuários',
    descricao: 'Tela completa de gerenciamento de usuários com filtros e paginação',
    grupo: 'Telas',
  },
  {
    id: 'ui-button',
    titulo: 'Button Component',
    descricao: 'Componente de botão reutilizável',
    grupo: 'Componentes',
  },
];

const telaSelecionada = ref<string | null>(null);

export function usePlaygroundNav() {
  const telaAtual = computed(() =>
    TELAS_DISPONIVEIS.find((tela) => tela.id === telaSelecionada.value)
  );

  const todasAsAgrupadaas = computed(() => {
    const agrupadas: Record<string, TelaDemo[]> = {};
    TELAS_DISPONIVEIS.forEach((tela) => {
      if (!agrupadas[tela.grupo]) {
        agrupadas[tela.grupo] = [];
      }
      agrupadas[tela.grupo].push(tela);
    });
    return agrupadas;
  });

  function selecionarTela(telaId: string) {
    telaSelecionada.value = telaId;
    // Salvar no localStorage para persistência
    localStorage.setItem('playground-tela-selecionada', telaId);
  }

  function carregarTelaSalva() {
    const telaSalva = localStorage.getItem('playground-tela-selecionada');
    if (telaSalva && TELAS_DISPONIVEIS.some((t) => t.id === telaSalva)) {
      telaSelecionada.value = telaSalva;
    } else {
      telaSelecionada.value = TELAS_DISPONIVEIS[0]?.id ?? null;
    }
  }

  return {
    telaAtual,
    todasAsAgrupadaas,
    selecionarTela,
    carregarTelaSalva,
    TELAS_DISPONIVEIS,
  };
}
