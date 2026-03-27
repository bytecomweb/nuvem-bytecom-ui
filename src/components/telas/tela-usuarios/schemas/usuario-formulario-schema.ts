import { usuarioEmpresaSchema } from '@/components/telas/tela-usuarios/schemas/usuario-empresa-schema';
import { usuarioSistemaSchema } from '@/components/telas/tela-usuarios/schemas/usuario-sistema-schema';
import { cnpjOuCpfSchema } from '@/schemas/cnpj-ou-cpf-schema';
import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import apenasNumeros from '@/utils/texto/apenas-numeros';
import z from 'zod';

export const usuarioFormularioSchema = z.object({
  nome: z
    .string({
      required_error: CAMPO_OBRIGATORIO,
    })
    .min(1, CAMPO_OBRIGATORIO),
  cnpjCpf: cnpjOuCpfSchema.transform((valor) => apenasNumeros(valor)),
  senha: z
    .string({
      required_error: CAMPO_OBRIGATORIO,
    })
    .optional(),
  email: z
    .string({
      required_error: CAMPO_OBRIGATORIO,
    })
    .email(CAMPO_INVALIDO),
  cargo: z.enum(['ADMIN', 'NORMAL'], {
    invalid_type_error: CAMPO_INVALIDO,
  }),
  empresas: z.array(usuarioEmpresaSchema),
  sistemasParaAdicionar: z.array(usuarioSistemaSchema),
  sistemasParaRemover: z.array(usuarioSistemaSchema),
});
