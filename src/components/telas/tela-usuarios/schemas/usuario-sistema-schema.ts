import z from 'zod';

export const usuarioSistemaSchema = z.object({
  idSistema: z.number(),
  idEmpresa: z.number(),
  nome: z.string(),
  imagem: z.string().optional().nullable(),
});

export type UsuarioSistema = z.infer<typeof usuarioSistemaSchema>;
