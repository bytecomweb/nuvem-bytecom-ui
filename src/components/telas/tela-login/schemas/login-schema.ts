import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      required_error: CAMPO_OBRIGATORIO,
      invalid_type_error: CAMPO_INVALIDO,
    })
    .email({ message: CAMPO_INVALIDO }),
  senha: z
    .string({
      required_error: CAMPO_OBRIGATORIO,
      invalid_type_error: CAMPO_INVALIDO,
    })
    .min(5, { message: 'A senha deve ter ao menos 5 caracteres' }),
});
