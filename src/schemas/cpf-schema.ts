import z from 'zod';
import { isValidCPF } from '@brazilian-utils/brazilian-utils';
import { CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';

export const cpfSchema = z
  .string({
    required_error: CAMPO_OBRIGATORIO,
  })
  .refine((cpf) => {
    return isValidCPF(cpf);
  }, 'CPF inválido');
