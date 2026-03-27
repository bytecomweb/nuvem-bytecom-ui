import z from 'zod';

export const usuarioEmpresaSchema = z.object({
  id: z.number(),
  nomeRazao: z.string(),
  nomeFantasia: z.string(),
  local: z.boolean().optional(),
  apagar: z.boolean().optional(),
  cargo: z.enum(['GERENTE', 'NORMAL']),
});

export type UsuarioEmpresa = z.infer<typeof usuarioEmpresaSchema>;
