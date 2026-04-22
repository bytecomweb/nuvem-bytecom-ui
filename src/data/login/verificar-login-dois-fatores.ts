import { AxiosInstance } from 'axios';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';

type VerificarLoginDoisFatoresRetorno = {
  requerDoisFatores: false;
  id: number;
  token: string;
  tokenDispositivoConfiavel?: string;
  nome: string;
  cargo: 'NORMAL' | 'ADMIN';
  empresas: {
    id: number;
    cargo: 'GERENTE' | 'NORMAL';
  }[];
};

export default async function verificarLoginDoisFatores(
  api: AxiosInstance,
  tokenPreAutenticacao: string,
  desafioId: string,
  codigo: string,
  confiarDispositivo = false
) {
  const { data } = await api.post<RespostaSucesso<VerificarLoginDoisFatoresRetorno>>(
    '/entrar/2fa/verificar',
    {
      tokenPreAutenticacao,
      desafioId,
      codigo,
      confiarDispositivo,
    }
  );

  return data;
}
