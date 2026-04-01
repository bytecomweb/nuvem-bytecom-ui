import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import apenasNumeros from '@/utils/texto/apenas-numeros';
import z from 'zod';

export const cnpjOuCpfSchema = z
  .string({
    required_error: CAMPO_OBRIGATORIO,
  })
  .superRefine((valor, ctx) => {
    const quantidadeDigitos = apenasNumeros(valor).length;

    if (quantidadeDigitos === 11 || quantidadeDigitos === 14) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: CAMPO_INVALIDO,
    });
  });
