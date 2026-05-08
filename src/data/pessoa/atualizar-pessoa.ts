import { Pessoa } from '@/types/modelos/pessoa';
import { PessoaEnderecoTipo } from '@/types/modelos/pessoa-endereco-tipo';
import { PessoaEnquadramentoTributario } from '@/types/modelos/pessoa-enquadramento-tributario';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

type AtualizarPessoaParametros = {
  nomeRazao?: string;
  nomeFantasia?: string;
  cpfCnpj?: string;
  email?: string;
  telefone?: string;
  enquadramentoTributario?: PessoaEnquadramentoTributario;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  empresasParaAdicionar?: number[];
  empresasParaRemover?: number[];
  enderecos?: {
    id?: number;
    tipo: PessoaEnderecoTipo;
    logradouro: string;
    cep: string;
    bairro: string;
    cidade: string;
    uf: string;
    complemento?: string;
    numero?: string;
  }[];
  enderecosParaRemover?: number[];
};

export default async function atualizarPessoa(
  api: AxiosInstance,
  id: number,
  params: AtualizarPessoaParametros
) {
  const { data } = await api.patch<RespostaSucesso<Pessoa>>(`/pessoas/${id}`, params);

  return data;
}
