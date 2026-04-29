import { TelasPessoasCamposParaBuscar } from '@/components/telas/tela-pessoas/types/tela-pessoas-campos-para-buscar';
import { Pessoa } from '@/types/modelos/pessoa';
import { RespostaPaginada } from '@/types/respostas/resposta-paginada';
import { AxiosInstance } from 'axios';

export type ObterPessoasExtraProps = {
  pagina?: number;
  busca?: string;
  tamanho?: number;
  campoParaBuscar: TelasPessoasCamposParaBuscar;
};

export default async function obterPessoas(
  api: AxiosInstance,
  empresaId: number,
  extraProps?: ObterPessoasExtraProps
) {
  const { data } = await api.get<RespostaPaginada<Pessoa>>('/pessoas', {
    params: {
      empresaId,
      pagina: extraProps?.pagina,
      tamanhoPagina: extraProps?.tamanho,
      [extraProps?.campoParaBuscar || 'todos']: extraProps?.busca,
    },
  });

  return data;
}
