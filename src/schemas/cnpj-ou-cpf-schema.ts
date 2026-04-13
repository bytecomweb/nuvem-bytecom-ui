import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import apenasNumeros from '@/utils/texto/apenas-numeros';
import { isValidCNPJ, isValidCPF } from '@brazilian-utils/brazilian-utils';
import z from 'zod';

export const cnpjOuCpfSchema = z
  .string({
    required_error: CAMPO_OBRIGATORIO,
  })
  .superRefine((valor, ctx) => {
    const valorNumerico = apenasNumeros(valor);
    const quantidadeDigitos = valorNumerico.length;

    if (quantidadeDigitos === 11 && isValidCPF(valorNumerico)) {
      return;
    }

    if (quantidadeDigitos === 14 && isValidCNPJ(valorNumerico)) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: CAMPO_INVALIDO,
    });
  });
