import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

type SolicitarRecuperacaoSenhaRetorno = {
  usuarioId: number;
  emailId: number;
  link: string;
};

export default async function solicitarRecuperacaoSenha(api: AxiosInstance, email: string) {
  const { data } = await api.post<RespostaSucesso<SolicitarRecuperacaoSenhaRetorno>>(
    `/usuarios/email/${encodeURIComponent(email)}/recuperar-senha`
  );

  return data;
}
