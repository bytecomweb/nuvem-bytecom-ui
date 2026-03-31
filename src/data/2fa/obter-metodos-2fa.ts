import { Metodo2FA } from '@/types/modelos/metodo-2fa';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function obterMetodos2FA(api: AxiosInstance) {
  const { data } =
    await api.get<RespostaSucesso<{ metodos: Metodo2FA[] }>>('/usuarios/2fa/metodos');

  return data;
}
