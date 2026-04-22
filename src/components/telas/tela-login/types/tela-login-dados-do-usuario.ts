export type TelaLoginDadosDoUsuario = {
  id: number;
  token: string;
  nome: string;
  cargo: 'NORMAL' | 'ADMIN' | 'EMPRESA';
  empresas: {
    id: number;
    cargo: 'NORMAL' | 'GERENTE';
  }[];
};
