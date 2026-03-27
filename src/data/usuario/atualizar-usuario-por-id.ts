import { useApiService } from '@/services/api';
import { Usuario } from '@/types/modelos/usuario';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';

type AtualizarUsuarioPorIdParametros = Pick<
  Usuario,
  'nome' | 'cargo' | 'senha' | 'cnpjCpf' | 'email'
> & {
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
  id: number,
  params: AtualizarUsuarioPorIdParametros
) {
  const { data } = await useApiService().instance.put<RespostaSucesso<Usuario>>(
    `/usuarios/${id}`,
    params
  );

  return data;
}
