import { PessoaContato } from '@/types/modelos/pessoa-contato';
import { PessoaEmpresa } from '@/types/modelos/pessoa-empresa';
import { PessoaEndereco } from '@/types/modelos/pessoa-endereco';
import { PessoaEnquadramentoTributario } from '@/types/modelos/pessoa-enquadramento-tributario';

export type Pessoa = {
  id: number;
  nomeRazao: string;
  nomeFantasia?: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  tabelaPrecoId?: number | null;
  enquadramentoTributario?: PessoaEnquadramentoTributario;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  criadoEm: string;
  atualizadoEm?: string;
  temSenha?: boolean;
  enderecos: PessoaEndereco[];
  empresas: PessoaEmpresa[];
  contatos: PessoaContato[];
};
