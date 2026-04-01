export type UsuarioCargo = 'ADMIN' | 'NORMAL' | 'GERENTE';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  whatsapp?: string;
  cnpjCpf: string;
  senha: string;
  cargo: UsuarioCargo;
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
