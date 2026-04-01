import z from 'zod';
import { CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import apenasNumeros from '@/utils/texto/apenas-numeros';

export const cpfSchema = z
  .string({
    required_error: CAMPO_OBRIGATORIO,
  })
  .refine((cpf) => {
    return apenasNumeros(cpf).length === 11;
  }, 'CPF inválido');
