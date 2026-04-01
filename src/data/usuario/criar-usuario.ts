import { Usuario } from '@/types/modelos/usuario';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

type CadastrarUsuarioParametros = Pick<
  Usuario,
  'nome' | 'cargo' | 'senha' | 'cnpjCpf' | 'email' | 'whatsapp'
> & {
  empresasSelecionadas: {
    cargo: 'GERENTE' | 'NORMAL';
    local?: boolean;
    id: number;
  }[];
  sistemasParaAdicionar: {
    idSistema: number;
    idEmpresa: number;
  }[];
};

export default async function cadastrarUsuario(
  api: AxiosInstance,
  params: CadastrarUsuarioParametros
) {
  const { data } = await api.post<RespostaSucesso<Usuario>>('/usuarios', {
    ...params,
    empresasParaAdicionar: params.empresasSelecionadas,
  });

  return data;
}
