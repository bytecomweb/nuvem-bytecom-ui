import { Empresa } from '@/types/modelos/empresa';

export type PessoaEmpresa = {
  empresaId: number;
  pessoaId: number;
  empresa: Empresa;
};
