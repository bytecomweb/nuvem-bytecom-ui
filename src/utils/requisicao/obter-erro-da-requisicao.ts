import { AxiosError, isAxiosError } from 'axios';

type RespostaComErro = {
  erro: true;
  mensagem: string;
};

function ehRespostaComErro(resposta: unknown): resposta is AxiosError<RespostaComErro> {
  return (
    isAxiosError(resposta) &&
    !!resposta.response &&
    !!resposta.response.data &&
    'mensagem' in resposta.response.data &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (resposta.response.data as any).mensagem === 'string'
  );
}

export default function obterErroDaRequisicao(erro: unknown) {
  if (ehRespostaComErro(erro)) {
    return erro.response?.data.mensagem;
  }
}
