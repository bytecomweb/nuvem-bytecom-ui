import { Empresa } from '@/types/modelos/empresa';
import { RespostaPaginada } from '@/types/respostas/resposta-paginada';
import { AxiosInstance } from 'axios';

export default async function obterEmpresas(api: AxiosInstance, busca: string | undefined) {
  const { data } = await api.get<RespostaPaginada<Empresa>>('/usuarios/empresas', {
    params: { busca },
  });

  return data;
}
