import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import { z } from 'zod';

export const configuracaoContaSchema = z
  .object({
    email: z.string().trim().email(CAMPO_INVALIDO).optional().or(z.literal('')),
    senhaAtual: z.string().trim().min(1, CAMPO_OBRIGATORIO),
    senhaNova: z.string().optional().or(z.literal('')),
    confirmacaoSenhaNova: z.string().optional().or(z.literal('')),
  })
  .superRefine((dados, ctx) => {
    const email = dados.email?.trim() || '';
    const senhaNova = dados.senhaNova?.trim() || '';
    const confirmacaoSenhaNova = dados.confirmacaoSenhaNova?.trim() || '';

    if (!email && !senhaNova) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Preencha novo e-mail ou nova senha',
        path: ['email'],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Preencha novo e-mail ou nova senha',
        path: ['senhaNova'],
      });
    }

    if (senhaNova && senhaNova.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A nova senha deve conter no mínimo 5 caracteres',
        path: ['senhaNova'],
      });
    }

    if (senhaNova && !confirmacaoSenhaNova) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: CAMPO_OBRIGATORIO,
        path: ['confirmacaoSenhaNova'],
      });
    }

    if (senhaNova && confirmacaoSenhaNova && senhaNova !== confirmacaoSenhaNova) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não conferem',
        path: ['confirmacaoSenhaNova'],
      });
    }
  });
