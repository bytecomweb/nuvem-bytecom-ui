import { pessoaEnderecoFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-endereco-formulario-schema';
import { cnpjOuCpfSchema } from '@/schemas/cnpj-ou-cpf-schema';
import { empresaSchema } from '@/schemas/modelos/empresa-schema';
import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import z from 'zod';

export const pessoaFormularioSchema = z.object({
  nomeRazao: z
    .string({
      invalid_type_error: CAMPO_INVALIDO,
      required_error: CAMPO_OBRIGATORIO,
    })
    .min(1, { message: CAMPO_OBRIGATORIO }),
  nomeFantasia: z
    .string({
      invalid_type_error: CAMPO_INVALIDO,
      required_error: CAMPO_OBRIGATORIO,
    })
    .optional(),
  cpfCnpj: cnpjOuCpfSchema,
  email: z
    .string({
      invalid_type_error: CAMPO_OBRIGATORIO,
      required_error: CAMPO_OBRIGATORIO,
    })
    .email({
      message: CAMPO_INVALIDO,
    }),
  telefone: z.string().optional(),
  empresasParaAdicionar: z.array(empresaSchema),
  empresasParaRemover: z.array(empresaSchema),
  enderecos: z.array(pessoaEnderecoFormularioSchema),
});
