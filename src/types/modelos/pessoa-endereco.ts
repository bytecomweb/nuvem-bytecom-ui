import { PessoaEnderecoTipo } from '@/types/modelos/pessoa-endereco-tipo';

export type PessoaEndereco = {
  id: number;
  pessoaId: number;
  tipo: PessoaEnderecoTipo;
  logradouro: string;
  cep: string;
  bairro: string;
  complemento?: string;
  numero?: string;
};
