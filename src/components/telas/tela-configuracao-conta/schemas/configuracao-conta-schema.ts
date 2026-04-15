import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import { z } from 'zod';

export const configuracaoContaSchema = z
  .object({
    nome: z.string().trim().min(3).max(125).optional().or(z.literal('')),
    email: z.string().trim().email(CAMPO_INVALIDO).optional().or(z.literal('')),
    senhaAtual: z.string().trim().min(1, CAMPO_OBRIGATORIO),
    senhaNova: z.string().optional().or(z.literal('')),
    confirmacaoSenhaNova: z.string().optional().or(z.literal('')),
  })
  .superRefine((dados, ctx) => {
    const nome = dados.nome?.trim() || '';
    const email = dados.email?.trim() || '';
    const senhaNova = dados.senhaNova?.trim() || '';
    const confirmacaoSenhaNova = dados.confirmacaoSenhaNova?.trim() || '';

    if (!nome && !email && !senhaNova) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe nome, e-mail ou nova senha para alterar',
        path: ['nome'],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe nome, e-mail ou nova senha para alterar',
        path: ['email'],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe nome, e-mail ou nova senha para alterar',
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
