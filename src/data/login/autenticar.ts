import { AxiosInstance } from 'axios';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { DISPOSITIVO_CONFIAVEL_HEADER } from '@/utils/constantes/dispositivo-confiavel';

type AutenticarRetorno =
  | {
      requerDoisFatores: false;
      id: number;
      token: string;
      nome: string;
      cargo: 'NORMAL' | 'ADMIN';
      empresas: {
        id: number;
        cargo: 'GERENTE' | 'NORMAL';
      }[];
    }
  | {
      requerDoisFatores: true;
      tokenPreAutenticacao: string;
      metodos: ('TOTP' | 'EMAIL' | 'WHATSAPP')[];
    };

export default async function autenticar(
  api: AxiosInstance,
  email: string,
  senha: string,
  tokenDispositivoConfiavel?: string,
  sistemaId?: number
) {
  const headers: Record<string, string> = {
    Authorization: `Basic ${btoa(`${email}:${senha}`)}`,
  };

  if (tokenDispositivoConfiavel) {
    headers[DISPOSITIVO_CONFIAVEL_HEADER] = tokenDispositivoConfiavel;
  }

  const { data } = await api.get<RespostaSucesso<AutenticarRetorno>>('/entrar', {
    headers,
    params: {
      sistemaId,
    },
  });

  return data;
}
