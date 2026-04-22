import { AxiosInstance } from 'axios';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';

type MetodoDoisFatores = 'TOTP' | 'EMAIL' | 'WHATSAPP';

type SolicitarLogin2FADesafioRetorno = {
  desafioId: string;
  metodo: MetodoDoisFatores;
  expiraEm: string;
  codigo?: string;
};

export default async function solicitarLogin2FADesafio(api: AxiosInstance, tokenPreAutenticacao: string, metodo: MetodoDoisFatores) {
  const { data } = await api.post<RespostaSucesso<SolicitarLogin2FADesafioRetorno>>('/api/v1/entrar/2fa/desafios', {
    tokenPreAutenticacao,
    metodo
  });

  return data;
}
