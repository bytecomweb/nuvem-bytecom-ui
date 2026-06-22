import apenasNumeros from '@/utils/texto/apenas-numeros';
import { pessoaContatoFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-contato-formulario-schema';
import { pessoaEnderecoFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-endereco-formulario-schema';
import { cnpjOuCpfSchema } from '@/schemas/cnpj-ou-cpf-schema';
import { empresaSchema } from '@/schemas/modelos/empresa-schema';
import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
import z from 'zod';

export const pessoaEnquadramentoTributarioSchema = z.enum([
  'LUCRO_REAL_OU_PRESUMIDO',
  'SIMPLES_OU_NORMAL_SEM_CREDITO',
  'SIMPLES_COM_COBRANCA_ST',
  'SIMPLES_SEM_COBRANCA_ST',
  'NAO_CONTRIBUINTE',
  'MEI_NAO_CONTRIBUINTE',
  'MEI_CONTRIBUINTE',
]);

export const pessoaFormularioSchema = z
  .object({
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
      .optional()
      .nullable(),
    cpfCnpj: cnpjOuCpfSchema,
    email: z
      .string({
        invalid_type_error: CAMPO_OBRIGATORIO,
        required_error: CAMPO_OBRIGATORIO,
      })
      .email({
        message: CAMPO_INVALIDO,
      }),
    telefone: z.string().optional().nullable(),
    enquadramentoTributario: pessoaEnquadramentoTributarioSchema.optional().nullable(),
    inscricaoEstadual: z.string().optional().nullable(),
    inscricaoMunicipal: z.string().optional().nullable(),
    empresas: z.array(empresaSchema),
    empresasParaRemover: z.array(empresaSchema),
    enderecos: z.array(pessoaEnderecoFormularioSchema),
    contatos: z.array(pessoaContatoFormularioSchema),
  })
  .superRefine((data, ctx) => {
    const isPj = apenasNumeros(data.cpfCnpj ?? '').length >= 14;
    if (isPj && !data.enquadramentoTributario) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: CAMPO_OBRIGATORIO,
        path: ['enquadramentoTributario'],
      });
    }
  });
