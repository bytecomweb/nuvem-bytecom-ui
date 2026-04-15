import { Usuario } from '@/types/modelos/usuario';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

type AtualizarDadosBasicosDaContaParametros = {
  senhaAtual: string;
  email?: string;
  senhaNova?: string;
};

type AtualizarDadosBasicosDaContaResposta = Pick<Usuario, 'id' | 'email'>;

export default async function atualizarDadosBasicosDaConta(
  api: AxiosInstance,
  params: AtualizarDadosBasicosDaContaParametros
) {
  const { data } = await api.patch<RespostaSucesso<AtualizarDadosBasicosDaContaResposta>>(
    '/usuarios/me',
    params
  );

  return data;
}
