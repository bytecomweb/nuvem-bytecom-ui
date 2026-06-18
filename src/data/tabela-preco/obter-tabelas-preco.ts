import { TabelaPreco } from '@/types/modelos/tabela-preco';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function obterTabelasPreco(api: AxiosInstance, empresaId: number) {
  const { data } = await api.get<RespostaSucesso<TabelaPreco[]>>('/tabelas-preco', {
    params: { empresaId, status: 'ATIVO', tamanhoPagina: 'infinito' },
  });

  return data;
}
