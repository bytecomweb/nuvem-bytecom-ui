import { Pessoa } from '@/types/modelos/pessoa';
import { RespostaPaginada } from '@/types/respostas/resposta-paginada';
import { AxiosInstance } from 'axios';

export type ObterPessoasExtraProps = {
  pagina?: number;
  busca?: string;
  tamanho?: number;
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
      tamanhoPagina: extraProps?.tamanho,
    },
  });

  return data;
}
