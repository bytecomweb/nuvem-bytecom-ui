import { TelaUsuariosCampoFiltro } from '@/components/telas/tela-usuarios/types/tela-usuarios-campo-filtro';
import { useApiService } from '@/services/api';
import { Usuario, UsuarioCargo } from '@/types/modelos/usuario';
import { RespostaPaginada } from '@/types/respostas/resposta-paginada';

type ObterUsuariosParametros = {
  tamanhoPagina?: number;
  paginaAtual?: number;
  busca?: string;
  campo?: TelaUsuariosCampoFiltro;
  cargo?: UsuarioCargo | 'todos';
  empresaId: number;
};

export default async function obterUsuarios({
  empresaId,
  busca,
  campo,
  cargo,
  paginaAtual,
  tamanhoPagina,
}: ObterUsuariosParametros) {
  const { data } = await useApiService().instance.get<RespostaPaginada<Usuario>>('/usuarios', {
    params: {
      pagina: paginaAtual,
      tamanhoPagina,
      empresas: true,
      sistemas: true,
      [campo || '']: busca || undefined,
      cargo: cargo === 'todos' ? undefined : cargo,
      idEmpresa: empresaId,
    },
  });

  return data;
}
