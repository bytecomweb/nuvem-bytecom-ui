import axios from 'axios';

// Mock de empresas
const empresasMock = [
  {
    id: 1,
    nomeRazao: 'Empresa A Ltda',
    nomeFantasia: 'Empresa A',
    cnpj: '12345678000190',
    status: 'ativa',
  },
  {
    id: 2,
    nomeRazao: 'Empresa B Com Razão Social Muito Longa Para Testar Truncamento Na Tela',
    nomeFantasia: 'Empresa B',
    cnpj: '98765432000109',
    status: 'ativa',
  },
  {
    id: 3,
    nomeRazao: 'Empresa C Ltda',
    nomeFantasia: 'Empresa C',
    cnpj: '55555555000145',
    status: 'inativa',
  },
];

// Mock de usuários
const usuariosMock = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@example.com',
    cnpjCpf: '12345678901',
    cargo: 'ADMIN' as const,
    empresas: [
      {
        empresa: {
          id: 1,
          nomeRazao: 'Empresa A Ltda',
          nomeFantasia: 'Empresa A',
          cnpj: '12345678000190',
        },
        cargo: 'GERENTE' as const,
      },
    ],
    sistemas: [
      {
        idEmpresa: 1,
        sistema: {
          id: 1,
          nome: 'Sistema 1',
          imagem: null,
          linkBackend: null,
          linkFrontend: null,
        },
      },
    ],
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@example.com',
    cnpjCpf: '98765432101',
    cargo: 'NORMAL' as const,
    empresas: [
      {
        empresa: {
          id: 2,
          nomeRazao: 'Empresa B Ltda',
          nomeFantasia: 'Empresa B',
          cnpj: '98765432000109',
        },
        cargo: 'NORMAL' as const,
      },
    ],
    sistemas: [],
  },
  {
    id: 3,
    nome: 'Pedro Costa',
    email: 'pedro@example.com',
    cnpjCpf: '11111111101',
    cargo: 'GERENTE' as const,
    empresas: [
      {
        empresa: {
          id: 1,
          nomeRazao: 'Empresa A Ltda',
          nomeFantasia: 'Empresa A',
          cnpj: '12345678000190',
        },
        cargo: 'GERENTE' as const,
      },
      {
        empresa: {
          id: 2,
          nomeRazao: 'Empresa B Ltda',
          nomeFantasia: 'Empresa B',
          cnpj: '98765432000109',
        },
        cargo: 'NORMAL' as const,
      },
    ],
    sistemas: [],
  },
];

export function setupMockApi() {
  // Interceptar requisições GET para /usuarios/empresas
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const config = error.config;

      if (config.url === '/usuarios/empresas' && config.method === 'get') {
        return Promise.resolve({
          status: 200,
          data: {
            erro: false,
            mensagem: 'Sucesso',
            dados: empresasMock.filter(
              (emp) =>
                !config.params?.busca ||
                emp.nomeRazao.toLowerCase().includes(config.params.busca.toLowerCase())
            ),
          },
        });
      }

      if (config.url === '/usuarios' && config.method === 'get') {
        const { pagina = 1, tamanhoPagina = 20, idEmpresa } = config.params || {};
        const inicio = (pagina - 1) * tamanhoPagina;
        const fim = inicio + tamanhoPagina;

        // Filtrar por empresa
        let dadosFiltrados = usuariosMock.filter((usuario) =>
          usuario.empresas.some((emp) => emp.empresa.id === idEmpresa)
        );

        // Aplicar filtros adicionais
        if (config.params?.email) {
          dadosFiltrados = dadosFiltrados.filter((u) => u.email.includes(config.params.email));
        }
        if (config.params?.nome) {
          dadosFiltrados = dadosFiltrados.filter((u) =>
            u.nome.toLowerCase().includes(config.params.nome.toLowerCase())
          );
        }
        if (config.params?.cargo && config.params.cargo !== 'todos') {
          dadosFiltrados = dadosFiltrados.filter((u) => u.cargo === config.params.cargo);
        }

        return Promise.resolve({
          status: 200,
          data: {
            erro: false,
            mensagem: 'Sucesso',
            dados: dadosFiltrados.slice(inicio, fim),
            paginacao: {
              paginaAtual: pagina,
              tamanhoPagina,
              total: dadosFiltrados.length,
            },
          },
        });
      }

      if (config.url?.includes('/usuarios') && config.method === 'post') {
        const novoId = Math.max(...usuariosMock.map((u) => u.id), 0) + 1;
        usuariosMock.push({
          id: novoId,
          nome: config.data.nome,
          email: config.data.email,
          cnpjCpf: config.data.cnpjCpf,
          cargo: config.data.cargo,
          empresas: [],
          sistemas: [],
        });
        return Promise.resolve({
          status: 201,
          data: { erro: false, mensagem: 'Usuário criado com sucesso' },
        });
      }

      if (config.url?.match(/\/usuarios\/\d+/) && config.method === 'patch') {
        const id = parseInt(config.url.split('/').pop());
        const usuario = usuariosMock.find((u) => u.id === id);
        if (usuario) {
          Object.assign(usuario, config.data);
        }
        return Promise.resolve({
          status: 200,
          data: { erro: false, mensagem: 'Usuário atualizado com sucesso' },
        });
      }

      if (config.url?.match(/\/usuarios\/\d+/) && config.method === 'delete') {
        const id = parseInt(config.url.split('/').pop());
        const idx = usuariosMock.findIndex((u) => u.id === id);
        if (idx > -1) {
          usuariosMock.splice(idx, 1);
        }
        return Promise.resolve({
          status: 200,
          data: { erro: false, mensagem: 'Usuário removido com sucesso' },
        });
      }

      return Promise.reject(error);
    }
  );
}
