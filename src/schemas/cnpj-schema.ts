import z from 'zod';
import { isValidCNPJ } from '@brazilian-utils/brazilian-utils';
import { CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';

export const cnpjSchema = z
  .string({
    required_error: CAMPO_OBRIGATORIO,
  })
  .refine((cnpj) => {
    return isValidCNPJ(cnpj);
  }, 'CNPJ inválido');
