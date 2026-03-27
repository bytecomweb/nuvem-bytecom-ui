import { useApiService } from '@/services/api';
import { Usuario } from '@/types/modelos/usuario';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';

type CadastrarUsuarioParametros = Pick<
  Usuario,
  'nome' | 'cargo' | 'senha' | 'cnpjCpf' | 'email'
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

export default async function cadastrarUsuario(params: CadastrarUsuarioParametros) {
  const { data } = await useApiService().instance.post<RespostaSucesso<Usuario>>(
    '/usuarios',
    params
  );

  return data;
}
