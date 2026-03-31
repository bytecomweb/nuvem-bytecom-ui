import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function ativarTotp(api: AxiosInstance, codigo: string) {
  const { data } = await api.post<RespostaSucesso<{ ativo: boolean }>>(
    '/usuarios/2fa/totp/ativar',
    { codigo }
  );

  return data;
}
