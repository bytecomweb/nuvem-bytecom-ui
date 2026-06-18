export type TabelaPreco = {
  id: number;
  empresaId: number;
  descricao: string;
  status: 'ATIVO' | 'INATIVO';
  criadoEm: string;
  atualizadoEm?: string;
};
