import { Sistema } from '@/types/modelos/sistema';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function obterSistemasDaEmpresa(
  api: AxiosInstance,
  empresaId: number,
  busca?: string
) {
  const { data } = await api.get<RespostaSucesso<Sistema[]>>(`/empresas/${empresaId}/sistemas`, {
    params: {
      todos: busca,
    },
  });

  return data;
}
