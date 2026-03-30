import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import apenasNumeros from '@/utils/texto/apenas-numeros';
import { z } from 'zod';

export const whatsAppInstanciaFormularioSchema = z.object({
  numero: z
    .string({
      required_error: CAMPO_OBRIGATORIO,
      invalid_type_error: CAMPO_INVALIDO,
    })
    .refine((numero) => {
      const numeroLimpo = apenasNumeros(numero);

      return numeroLimpo.length >= 9;
    }, CAMPO_INVALIDO),
});
