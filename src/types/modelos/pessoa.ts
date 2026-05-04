import { PessoaEmpresa } from '@/types/modelos/pessoa-empresa';
import { PessoaEndereco } from '@/types/modelos/pessoa-endereco';

export type Pessoa = {
  id: number;
  nomeRazao: string;
  nomeFantasia?: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  criadoEm: string;
  atualizadoEm?: string;
  temSenha?: boolean;
  enderecos: PessoaEndereco[];
  empresas: PessoaEmpresa[];
};
