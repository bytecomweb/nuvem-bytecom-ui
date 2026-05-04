import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import { isValidCep } from '@brazilian-utils/brazilian-utils';
import z from 'zod';

export const cepSchema = z
  .string({
    required_error: CAMPO_OBRIGATORIO,
    invalid_type_error: CAMPO_INVALIDO,
  })
  .refine((valor) => isValidCep(valor), {
    message: CAMPO_INVALIDO,
  });
