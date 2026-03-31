import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function configurarTotp(api: AxiosInstance, regenerar = false) {
  const { data } = await api.post<
    RespostaSucesso<{
      segredo: string;
      otpauthUrl: string;
      ativo: boolean;
    }>
  >('/usuarios/2fa/totp/configurar', { regenerar });

  return data;
}
