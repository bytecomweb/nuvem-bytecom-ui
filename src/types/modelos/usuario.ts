export type CargoUsuario = 'ADMIN' | 'NORMAL' | 'GERENTE';

export type Usuario = {
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
