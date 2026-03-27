import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function apagarUsuario(api: AxiosInstance, id: number) {
  const { data } = await api.delete<RespostaSucesso>('/usuarios/' + id);

  return data;
}
