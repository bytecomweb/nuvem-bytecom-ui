import z from 'zod';

export const empresaSchema = z.object({
  id: z.number(),
  nomeRazao: z.string(),
  nomeFantasia: z.string(),
  logo: z.string().optional().nullable(),
});
