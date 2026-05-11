import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import z from 'zod';

export const pessoaContatoFormularioSchema = z
  .object({
    id: z.number().optional(),
    tipo: z.enum(['PRINCIPAL', 'COBRANCA'], {
      invalid_type_error: CAMPO_INVALIDO,
      required_error: CAMPO_OBRIGATORIO,
    }),
    fone: z.string().optional().nullable(),
    email: z
      .string({
        invalid_type_error: CAMPO_INVALIDO,
      })
      .email({
        message: CAMPO_INVALIDO,
      })
      .optional()
      .nullable(),
    ehWhatsApp: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    const temFone = !!data.fone?.trim();
    const temEmail = !!data.email?.trim();

    if (!temFone && !temEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe ao menos telefone ou e-mail',
        path: ['fone'],
      });
    }

    if (data.ehWhatsApp && !temFone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o telefone para marcar como WhatsApp',
        path: ['fone'],
      });
    }
  });
