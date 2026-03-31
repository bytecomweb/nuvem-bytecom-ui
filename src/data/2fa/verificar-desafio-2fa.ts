import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function verificarDesafio2FA(
  api: AxiosInstance,
  desafioId: string,
  codigo: string
) {
  const { data } = await api.post<
    RespostaSucesso<{
      valido: true;
      metodo: 'TOTP' | 'EMAIL' | 'WHATSAPP';
      contexto: 'LOGIN' | 'OPERACAO_SENSIVEL' | null;
    }>
  >('/usuarios/2fa/desafios/verificar', {
    desafioId,
    codigo,
  });

  return data;
}
