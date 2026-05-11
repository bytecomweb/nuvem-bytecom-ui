import { PessoaContatoTipo } from '@/types/modelos/pessoa-contato-tipo';

export type PessoaContato = {
  id: number;
  pessoaId: number;
  fone?: string;
  email?: string;
  tipo: PessoaContatoTipo;
  ehWhatsApp: 0 | 1;
};
