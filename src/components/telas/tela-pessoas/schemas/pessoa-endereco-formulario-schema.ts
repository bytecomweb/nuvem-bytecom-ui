import { cepSchema } from '@/schemas/cep-schema';
import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import z from 'zod';

export const pessoaEnderecoFormularioSchema = z.object({
  id: z.number().optional(),
  tipo: z.enum(['PRINCIPAL', 'COBRANCA', 'ENTREGA', 'OUTROS'], {
    invalid_type_error: CAMPO_INVALIDO,
    required_error: CAMPO_OBRIGATORIO,
  }),
  logradouro: z
    .string({
      invalid_type_error: CAMPO_INVALIDO,
      required_error: CAMPO_OBRIGATORIO,
    })
    .min(1, { message: CAMPO_OBRIGATORIO }),
  cep: cepSchema,
  bairro: z
    .string({
      invalid_type_error: CAMPO_INVALIDO,
      required_error: CAMPO_OBRIGATORIO,
    })
    .min(1, { message: CAMPO_OBRIGATORIO }),
  cidade: z
    .string({
      invalid_type_error: CAMPO_INVALIDO,
      required_error: CAMPO_OBRIGATORIO,
    })
    .min(1, { message: CAMPO_OBRIGATORIO }),
  uf: z
    .string({
      invalid_type_error: CAMPO_INVALIDO,
      required_error: CAMPO_OBRIGATORIO,
    })
    .min(2, { message: CAMPO_INVALIDO })
    .max(2, { message: CAMPO_INVALIDO }),
  complemento: z.string().optional().nullable(),
  numero: z.string().optional(),
});
