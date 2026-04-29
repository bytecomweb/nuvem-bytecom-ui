import { Pessoa } from '@/types/modelos/pessoa';
import { RespostaPaginada } from '@/types/respostas/resposta-paginada';
import { AxiosInstance } from 'axios';

export type ObterPessoasExtraProps = {
  pagina?: number;
  busca?: string;
};

export default async function obterPessoas(
  api: AxiosInstance,
  empresaId: number,
  extraProps?: ObterPessoasExtraProps
) {
  const { data } = await api.get<RespostaPaginada<Pessoa>>('/pessoas', {
    params: {
      empresaId,
      todos: extraProps?.busca || undefined,
      pagina: extraProps?.pagina,
    },
  });

  return data;
}
