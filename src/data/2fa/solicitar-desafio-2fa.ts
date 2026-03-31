import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';
type ModoSolicitacao2FA = 'TESTE' | 'REAL';

type OpcoesSolicitacao2FA = {
  modo?: ModoSolicitacao2FA;
  destino?: string;
};

export default async function solicitarDesafio2FA(
  api: AxiosInstance,
  metodo: 'TOTP' | 'EMAIL' | 'WHATSAPP',
  contexto: 'LOGIN' | 'OPERACAO_SENSIVEL' = 'OPERACAO_SENSIVEL',
  opcoes: OpcoesSolicitacao2FA = {}
) {
  const { data } = await api.post<
    RespostaSucesso<{
      desafioId: string;
      metodo: 'TOTP' | 'EMAIL' | 'WHATSAPP';
      expiraEm: string;
      codigo?: string;
    }>
  >('/usuarios/2fa/desafios', {
    metodo,
    contexto,
    modo: opcoes.modo,
    destino: opcoes.destino,
  });

  return data;
}
