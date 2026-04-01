import z from 'zod';
import { CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import apenasNumeros from '@/utils/texto/apenas-numeros';

export const cnpjSchema = z
  .string({
    required_error: CAMPO_OBRIGATORIO,
  })
  .refine((cnpj) => {
    return apenasNumeros(cnpj).length === 14;
  }, 'CNPJ inválido');
