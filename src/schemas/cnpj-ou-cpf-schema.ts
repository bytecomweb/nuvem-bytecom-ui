import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import { isValidCNPJ, isValidCPF } from '@brazilian-utils/brazilian-utils';
import z from 'zod';

export const cnpjOuCpfSchema = z
  .string({
    required_error: CAMPO_OBRIGATORIO,
  })
  .superRefine((valor, ctx) => {
    if (isValidCPF(valor) || isValidCNPJ(valor)) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: CAMPO_INVALIDO,
    });
  });
