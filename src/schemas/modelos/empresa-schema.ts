import z from 'zod';

import { CAMPO_INVALIDO } from '@/utils/constantes/feedback';

export const empresaSchema = z.object({
  id: z.number(),
  nomeRazao: z.string(),
  nomeFantasia: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  tabelaPrecoId: z
    .number({
      invalid_type_error: CAMPO_INVALIDO,
    })
    .int()
    .optional()
    .nullable(),
  podeComprar: z.boolean().optional(),
});
