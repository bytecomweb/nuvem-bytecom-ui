import { AxiosInstance } from 'axios';

type ObterUsuarioAutorizadoResposta = {
  status: 'ok' | string;
  autorizado: {
    id: number;
    nome?: string;
    email: string;
    sistemas: string[];
    cargo: 'ADMIN' | 'GERENTE' | 'NORMAL' | string;
    empresas: Array<{
      id: number;
      cnpj: string;
      cargo: 'ADMIN' | 'GERENTE' | 'NORMAL' | string;
    }>;
  };
};

export default async function obterUsuarioAutorizado(api: AxiosInstance) {
  const { data } = await api.get<ObterUsuarioAutorizadoResposta>('/');

  return data;
}
