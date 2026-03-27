import { useApiService } from '@/services/api';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';

export default async function apagarUsuario(id: number) {
  const { data } = await useApiService().instance.delete<RespostaSucesso>('/usuarios/' + id);

  return data;
}
