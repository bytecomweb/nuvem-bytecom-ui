import { TelaUsuariosCampoFiltro } from '@/components/telas/tela-usuarios/types/tela-usuarios-campo-filtro';
import { Usuario, UsuarioCargo } from '@/types/modelos/usuario';
import { RespostaPaginada } from '@/types/respostas/resposta-paginada';
import { AxiosInstance } from 'axios';

type ObterUsuariosParametros = {
  tamanhoPagina?: number;
  paginaAtual?: number;
  busca?: string;
  campo?: TelaUsuariosCampoFiltro;
  cargo?: UsuarioCargo | 'todos';
  empresaId: number;
};

export default async function obterUsuarios(
  api: AxiosInstance,
  { empresaId, busca, campo, cargo, paginaAtual, tamanhoPagina }: ObterUsuariosParametros
) {
  const { data } = await api.get<RespostaPaginada<Usuario>>('/usuarios', {
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
