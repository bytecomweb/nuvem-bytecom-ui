import { Paginacao } from '@/types/paginacao';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';

export type RespostaPaginada<T> = RespostaSucesso<T[]> & {
  paginacao: Paginacao;
};
