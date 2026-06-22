import { Pessoa } from '@/types/modelos/pessoa';
import { PessoaContatoTipo } from '@/types/modelos/pessoa-contato-tipo';
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
  empresas?: { id: number; tabelaPrecoId?: number | null }[];
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
  contatos?: {
    id?: number;
    tipo: PessoaContatoTipo;
    fone?: string;
    email?: string;
    ehWhatsApp?: 0 | 1;
  }[];
  contatosParaRemover?: number[];
};

export default async function atualizarPessoa(
  api: AxiosInstance,
  id: number,
  params: AtualizarPessoaParametros
) {
  const { data } = await api.patch<RespostaSucesso<Pessoa>>(`/pessoas/${id}`, params);

  return data;
}
