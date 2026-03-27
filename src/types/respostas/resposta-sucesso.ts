export type RespostaSucesso<T = never> = {
  erro: false;
  mensagem: string;
  dados: T;
};
