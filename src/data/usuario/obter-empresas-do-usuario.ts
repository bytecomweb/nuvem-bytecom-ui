import { Empresa } from '@/types/modelos/empresa';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function obterEmpresasDoUsuario(api: AxiosInstance, busca?: string) {
  const { data } = await api.get<RespostaSucesso<Empresa[]>>('/usuarios/empresas', {
    params: { todos: busca },
  });

  return data;
}
