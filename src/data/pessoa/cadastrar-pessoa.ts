import { pessoaFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-formulario-schema';
import apenasNumeros from '@/utils/texto/apenas-numeros';
import { AxiosInstance } from 'axios';
import z from 'zod';

export default async function cadastrarPessoa(
  api: AxiosInstance,
  dados: z.infer<typeof pessoaFormularioSchema>
) {
  const { data } = await api.post('/pessoas', {
    nomeRazao: dados.nomeRazao,
    nomeFantasia: dados.nomeFantasia,
    cpfCnpj: dados.cpfCnpj,
    email: dados.email,
    telefone: dados.telefone || undefined,
    empresaIds: dados.empresasParaAdicionar.map(({ id }) => id),
    enderecos: dados.enderecos.map((endereco) => ({
      tipo: endereco.tipo,
      logradouro: endereco.logradouro,
      cep: apenasNumeros(endereco.cep),
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      uf: endereco.uf.substring(0, 2),
      complemento: endereco.complemento || undefined,
      numero: endereco.numero || undefined,
    })),
  });

  return data;
}
