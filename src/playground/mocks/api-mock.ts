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
  const parseData = (data: unknown) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return {};
      }
    }

    return data || {};
  };

  // Interceptar requisições GET para /usuarios/empresas
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const config = error.config;
      const body = parseData(config.data) as {
        nome?: string;
        email?: string;
        cnpjCpf?: string;
        cargo?: 'ADMIN' | 'NORMAL' | 'GERENTE';
        senhaAtual?: string;
        senhaNova?: string;
      };

      if (config.url === '/api/v1' && config.method === 'get') {
        return Promise.resolve({
          status: 200,
          data: {
            status: 'ok',
            autorizado: {
              id: 8,
              email: 'tomas153lm@gmail.com',
              sistemas: ['Ótica', 'Ótica'],
              cargo: 'ADMIN',
              empresas: [
                {
                  id: 1,
                  cnpj: '05063495000111',
                  cargo: 'GERENTE',
                },
                {
                  id: 2,
                  cnpj: '72407711000196',
                  cargo: 'GERENTE',
                },
              ],
            },
          },
        });
      }

      if ((config.url === '/' || config.url === '') && config.method === 'get') {
        return Promise.resolve({
          status: 200,
          data: {
            status: 'ok',
            autorizado: {
              id: 8,
              email: 'tomas153lm@gmail.com',
              sistemas: ['Ótica', 'Ótica'],
              cargo: 'ADMIN',
              empresas: [
                {
                  id: 1,
                  cnpj: '05063495000111',
                  cargo: 'GERENTE',
                },
                {
                  id: 2,
                  cnpj: '72407711000196',
                  cargo: 'GERENTE',
                },
              ],
            },
          },
        });
      }

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
          nome: body.nome || 'Usuário sem nome',
          email: body.email || `usuario${novoId}@example.com`,
          cnpjCpf: body.cnpjCpf || '00000000000',
          cargo: body.cargo || 'NORMAL',
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
          Object.assign(usuario, body);
        }
        return Promise.resolve({
          status: 200,
          data: { erro: false, mensagem: 'Usuário atualizado com sucesso' },
        });
      }

      if (config.url === '/usuarios/me' && config.method === 'patch') {
        if (!body.senhaAtual) {
          return Promise.resolve({
            status: 400,
            data: { erro: true, mensagem: 'Senha atual é obrigatória' },
          });
        }

        if (!body.email && !body.senhaNova) {
          return Promise.resolve({
            status: 400,
            data: { erro: true, mensagem: 'Informe e-mail ou nova senha' },
          });
        }

        if (body.senhaNova && body.senhaNova.length < 5) {
          return Promise.resolve({
            status: 400,
            data: { erro: true, mensagem: 'Nova senha deve conter no mínimo 5 caracteres' },
          });
        }

        if (body.senhaAtual !== '123456') {
          return Promise.resolve({
            status: 403,
            data: { erro: true, mensagem: 'Senha atual incorreta' },
          });
        }

        if (body.email === 'email-em-uso@teste.com') {
          return Promise.resolve({
            status: 409,
            data: { erro: true, mensagem: 'E-mail já está em uso' },
          });
        }

        const usuario = usuariosMock[0];

        if (usuario && body.email) {
          usuario.email = body.email;
        }

        return Promise.resolve({
          status: 200,
          data: {
            erro: false,
            mensagem: 'Dados básicos atualizados com sucesso',
            dados: {
              id: usuario?.id || 1,
              email: usuario?.email || body.email || 'novo@email.com',
            },
          },
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
