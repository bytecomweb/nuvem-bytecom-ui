export type Paginacao = {
  total: number;
  quantidadePaginas: number;
  paginaAtual: number;
  tamanhoPagina: number;
  proxima: number | null;
  anterior: number | null;
};
