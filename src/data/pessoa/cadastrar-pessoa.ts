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
    enquadramentoTributario: dados.enquadramentoTributario || undefined,
    inscricaoEstadual: dados.inscricaoEstadual || undefined,
    inscricaoMunicipal: dados.inscricaoMunicipal || undefined,
    empresas: dados.empresas.map(({ id, tabelaPrecoId, podeComprar }) => ({
      id,
      tabelaPrecoId: tabelaPrecoId ?? null,
      podeComprar: podeComprar ?? false,
    })),
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
    contatos: dados.contatos.map((contato) => ({
      tipo: contato.tipo,
      fone: contato.fone ? apenasNumeros(contato.fone) : undefined,
      email: contato.email || undefined,
      ehWhatsApp: contato.ehWhatsApp ? 1 : 0,
    })),
  });

  return data;
}
