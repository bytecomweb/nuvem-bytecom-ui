import { useApiService } from '@/services/api';
import { Empresa } from '@/types/modelos/empresa';
import { RespostaPaginada } from '@/types/respostas/resposta-paginada';

export default async function obterEmpresas(busca: string | undefined) {
  const { data } = await useApiService().instance.get<RespostaPaginada<Empresa>>(
    '/usuarios/empresas',
    {
      params: { busca },
    }
  );

  return data;
}
