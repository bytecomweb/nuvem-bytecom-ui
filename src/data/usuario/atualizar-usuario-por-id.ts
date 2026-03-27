import { Usuario } from '@/types/modelos/usuario';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

type AtualizarUsuarioPorIdParametros = Pick<Usuario, 'nome' | 'cargo' | 'cnpjCpf' | 'email'> & {
  senha?: string;
  empresas: {
    id: number;
    cargo: 'GERENTE' | 'NORMAL';
    local?: boolean;
    apagar?: boolean;
  }[];
  sistemasParaAdicionar: {
    idSistema: number;
    idEmpresa: number;
  }[];
  sistemasParaRemover: {
    idSistema: number;
    idEmpresa: number;
  }[];
};

export default async function atualizarUsuarioPorId(
  api: AxiosInstance,
  id: number,
  params: AtualizarUsuarioPorIdParametros
) {
  const { data } = await api.patch<RespostaSucesso<Usuario>>(`/usuarios/${id}`, params);

  return data;
}
