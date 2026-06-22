import { Empresa } from '@/types/modelos/empresa';

export type PessoaEmpresa = {
  empresaId: number;
  pessoaId: number;
  podeComprar?: boolean;
  empresa: Empresa;
  tabelaPrecoId?: number | null;
};
