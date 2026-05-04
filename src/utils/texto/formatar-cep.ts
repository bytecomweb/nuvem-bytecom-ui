import { formatCep } from '@brazilian-utils/brazilian-utils';

export default function formatarCep(texto?: string) {
  if (!texto) {
    return texto;
  }

  return formatCep(texto);
}
