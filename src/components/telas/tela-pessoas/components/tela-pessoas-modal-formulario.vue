<template>
  <Dialog
    modal
    :header="pessoa ? atualizarTitulo : cadastrarTitulo"
    :style="{ width: '95vw', maxWidth: '38rem' }"
    v-model:visible="visivel"
  >
    <div class="mt-2 grid grid-cols-5 gap-3">
      <Label label="CPF / CNPJ" :feedback="errors.cpfCnpj" class="col-span-5">
        <InputCpfOuCnpj v-bind="cpfCnpjAttrs" v-model="cpfCnpj" fluid :invalid="!!errors.cpfCnpj" />
      </Label>
      <Label
        :label="tipoPessoa === 'fisica' ? 'Nome' : 'Nome Razão'"
        :feedback="errors.nomeRazao"
        class="col-span-3"
      >
        <InputText
          v-bind="nomeRazaoAttrs"
          v-model="nomeRazao"
          fluid
          :invalid="!!errors.nomeRazao"
        />
      </Label>
      <Label
        :label="tipoPessoa === 'fisica' ? 'Sobrenome' : 'Nome Fantasia'"
        :feedback="errors.nomeFantasia"
        class="col-span-2"
      >
        <InputText
          v-bind="nomeFantasiaAttrs"
          v-model="nomeFantasia"
          fluid
          :invalid="!!errors.nomeFantasia"
        />
      </Label>
      <Label label="E-mail" :feedback="errors.email" class="col-span-3">
        <InputText v-bind="emailAttrs" v-model="email" fluid :invalid="!!errors.email" />
      </Label>
      <Label label="Telefone" :feedback="errors.telefone" class="col-span-2">
        <InputTelefone
          v-bind="telefoneAttrs"
          v-model="telefone"
          fluid
          :invalid="!!errors.telefone"
        />
      </Label>
      <template v-if="tipoPessoa === 'juridica'">
        <Label
          label="Enquadramento Tributário"
          :feedback="errors.enquadramentoTributario"
          class="col-span-5"
        >
          <Select
            v-bind="enquadramentoTributarioAttrs"
            v-model="enquadramentoTributario"
            :options="enquadramentoTributarioOpcoes"
            option-label="label"
            option-value="value"
            fluid
            :invalid="!!errors.enquadramentoTributario"
          />
        </Label>
        <Label label="Inscrição Estadual" :feedback="errors.inscricaoEstadual" class="col-span-3">
          <InputText
            v-bind="inscricaoEstadualAttrs"
            v-model="inscricaoEstadual"
            fluid
            :invalid="!!errors.inscricaoEstadual"
          />
        </Label>
        <Label label="Inscrição Municipal" :feedback="errors.inscricaoMunicipal" class="col-span-2">
          <InputText
            v-bind="inscricaoMunicipalAttrs"
            v-model="inscricaoMunicipal"
            fluid
            :invalid="!!errors.inscricaoMunicipal"
          />
        </Label>
      </template>
    </div>
    <template #footer>
      <div class="flex justify-between items-center w-full">
        <div class="flex gap-2">
          <Button
            label="Empresas"
            @click="modalEmpresasFormularioVisivel = true"
            severity="secondary"
          />
          <Button
            label="Endereços"
            @click="modalEnderecosFormularioVisivel = true"
            severity="secondary"
          />
          <Button
            label="Contatos"
            @click="modalContatosFormularioVisivel = true"
            severity="secondary"
          />
          <Button
            v-if="pessoa"
            :label="pessoa.temSenha ? 'Redefinir senha' : 'Definir senha'"
            @click="emit('redefinir-senha', pessoa.id)"
            severity="info"
          />
        </div>
        <div>
          <Button label="Salvar" @click="tentaSalvar" :loading="salvando" :disabled="salvando" />
        </div>
      </div>
    </template>
  </Dialog>
  <ModalEmpresasFormulario
    v-model:visivel="modalEmpresasFormularioVisivel"
    :titulo="empresasLabel"
    para-adicionar-key="empresasParaAdicionar"
    para-remover-key="empresasParaRemover"
    :empresas="pessoa?.empresas"
  />
  <TelaPessoasModalEnderecos
    v-model:visivel="modalEnderecosFormularioVisivel"
    :errors
    :titulo-label="enderecosLabel"
  />
  <TelaPessoasModalContatos
    v-model:visivel="modalContatosFormularioVisivel"
    :errors
    :titulo-label="contatosLabel"
  />
</template>
<script lang="ts" setup>
import InputCpfOuCnpj from '@/components/inputs/input-cpf-ou-cnpj.vue';
import InputTelefone from '@/components/inputs/input-telefone.vue';
import Label from '@/components/label.vue';
import ModalEmpresasFormulario from '@/components/modals/modal-empresas-formulario.vue';
import TelaPessoasModalContatos from '@/components/telas/tela-pessoas/components/tela-pessoas-modal-contatos.vue';
import TelaPessoasModalEnderecos from '@/components/telas/tela-pessoas/components/tela-pessoas-modal-enderecos.vue';
import { pessoaFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-formulario-schema';
import useApi from '@/composables/use-api';
import useNotification from '@/composables/use-notification';
import atualizarPessoa from '@/data/pessoa/atualizar-pessoa';
import cadastrarPessoa from '@/data/pessoa/cadastrar-pessoa';
import { Empresa } from '@/types/modelos/empresa';
import { Pessoa } from '@/types/modelos/pessoa';
import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
import apenasNumeros from '@/utils/texto/apenas-numeros';
import { toTypedSchema } from '@vee-validate/zod';
import { Button, Dialog, InputText, Select } from 'primevue';
import { useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';

const visivel = defineModel<boolean>('visivel', {
  required: true,
});

const { defineField, resetForm, errors, handleSubmit } = useForm({
  name: 'pessoa-formulario',
  validationSchema: toTypedSchema(pessoaFormularioSchema),
  initialValues: {
    empresasParaAdicionar: [],
    empresasParaRemover: [],
    enderecos: [],
    contatos: [],
  },
});

const { empresaSelecionada, pessoa } = defineProps<{
  pessoa?: Pessoa;
  empresaSelecionada: Empresa;
  cadastrarTitulo: string;
  atualizarTitulo: string;
  empresasLabel: string;
  enderecosLabel: string;
  contatosLabel: string;
}>();

const emit = defineEmits<{
  salvou: [];
  'redefinir-senha': [pessoaId: number];
}>();

const [nomeRazao, nomeRazaoAttrs] = defineField('nomeRazao');
const [nomeFantasia, nomeFantasiaAttrs] = defineField('nomeFantasia');
const [cpfCnpj, cpfCnpjAttrs] = defineField('cpfCnpj');
const [email, emailAttrs] = defineField('email');
const [telefone, telefoneAttrs] = defineField('telefone');
const [enquadramentoTributario, enquadramentoTributarioAttrs] =
  defineField('enquadramentoTributario');
const [inscricaoEstadual, inscricaoEstadualAttrs] = defineField('inscricaoEstadual');
const [inscricaoMunicipal, inscricaoMunicipalAttrs] = defineField('inscricaoMunicipal');

const enquadramentoTributarioOpcoes = [
  { value: 'LUCRO_REAL_OU_PRESUMIDO', label: 'Lucro Real/Presumido' },
  { value: 'SIMPLES_OU_NORMAL_SEM_CREDITO', label: 'Simples / Normal sem Crédito' },
  { value: 'SIMPLES_COM_COBRANCA_ST', label: 'Simples com Cobrança de ST' },
  { value: 'SIMPLES_SEM_COBRANCA_ST', label: 'Normal sem Cobrança de ST' },
  { value: 'NAO_CONTRIBUINTE', label: 'Não Contribuinte' },
  { value: 'MEI_NAO_CONTRIBUINTE', label: 'MEI - Não Contribuinte' },
  { value: 'MEI_CONTRIBUINTE', label: 'MEI - Contribuinte' },
];

watch(visivel, () => {
  if (pessoa) {
    resetForm({
      values: {
        empresasParaAdicionar: [],
        empresasParaRemover: [],
        cpfCnpj: pessoa.cpfCnpj,
        contatos: pessoa.contatos.map((contato) => ({
          id: contato.id,
          tipo: contato.tipo,
          fone: contato.fone,
          email: contato.email,
          ehWhatsApp: contato.ehWhatsApp === 1,
        })),
        email: pessoa.email,
        enderecos: pessoa.enderecos,
        nomeFantasia: pessoa.nomeFantasia,
        nomeRazao: pessoa.nomeRazao,
        telefone: pessoa.telefone,
        enquadramentoTributario: pessoa.enquadramentoTributario,
        inscricaoEstadual: pessoa.inscricaoEstadual,
        inscricaoMunicipal: pessoa.inscricaoMunicipal,
      },
    });
  } else {
    resetForm(
      {
        values: {
          empresasParaAdicionar: [empresaSelecionada],
          empresasParaRemover: [],
        },
      },
      {
        force: true,
      }
    );
  }
});

const { erro, sucesso } = useNotification();

const api = useApi();

const salvando = ref(false);

const tentaSalvar = handleSubmit(async (dados) => {
  try {
    if ((!dados.empresasParaAdicionar || dados.empresasParaAdicionar.length === 0) && !pessoa) {
      return erro('Essa pessoa deve estar associada à uma empresa');
    }

    if (!dados.enderecos || dados.enderecos.length === 0) {
      return erro('A pessoa deve possuir ao menos um endereço do tipo principal');
    }

    const enderecosPrincipais = dados.enderecos.filter((endereco) => endereco.tipo === 'PRINCIPAL');

    if (enderecosPrincipais.length === 0) {
      return erro('A pessoa deve possuir um endereço principal');
    }

    if (enderecosPrincipais.length > 1) {
      return erro('A pessoa não pode possuir mais de um endereço principal');
    }

    if (!dados.contatos || dados.contatos.length === 0) {
      return erro('A pessoa deve possuir ao menos um contato do tipo principal');
    }

    const contatosPrincipais = dados.contatos.filter((contato) => contato.tipo === 'PRINCIPAL');

    if (contatosPrincipais.length === 0) {
      return erro('A pessoa deve possuir um contato principal');
    }

    if (contatosPrincipais.length > 1) {
      return erro('A pessoa não pode possuir mais de um contato principal');
    }

    dados.cpfCnpj = apenasNumeros(dados.cpfCnpj);
    dados.telefone = dados.telefone ? apenasNumeros(dados.telefone) : dados.telefone;

    salvando.value = true;

    if (pessoa) {
      const empresaIdsOriginais = new Set(pessoa.empresas.map(({ empresaId }) => empresaId));
      const enderecoIdsAtuais = new Set(dados.enderecos.map((e) => e.id).filter(Boolean));
      const contatoIdsAtuais = new Set(dados.contatos.map((c) => c.id).filter(Boolean));

      await atualizarPessoa(api, pessoa.id, {
        nomeRazao: dados.nomeRazao,
        nomeFantasia: dados.nomeFantasia || undefined,
        cpfCnpj: dados.cpfCnpj,
        email: dados.email,
        telefone: dados.telefone || undefined,
        enquadramentoTributario: dados.enquadramentoTributario || undefined,
        inscricaoEstadual: dados.inscricaoEstadual || undefined,
        inscricaoMunicipal: dados.inscricaoMunicipal || undefined,
        empresasParaAdicionar: dados.empresasParaAdicionar
          .filter((e) => !empresaIdsOriginais.has(e.id))
          .map((e) => e.id),
        empresasParaRemover: dados.empresasParaRemover.map((e) => e.id),
        enderecos: dados.enderecos.map((e) => ({
          id: e.id,
          tipo: e.tipo,
          logradouro: e.logradouro,
          cep: apenasNumeros(e.cep),
          bairro: e.bairro,
          cidade: e.cidade,
          uf: e.uf.substring(0, 2),
          complemento: e.complemento || undefined,
          numero: e.numero || undefined,
        })),
        enderecosParaRemover: pessoa.enderecos
          .filter((e) => !enderecoIdsAtuais.has(e.id))
          .map((e) => e.id),
        contatos: dados.contatos.map((c) => ({
          id: c.id,
          tipo: c.tipo,
          fone: c.fone || undefined,
          email: c.email || undefined,
          ehWhatsApp: c.ehWhatsApp ? 1 : 0,
        })),
        contatosParaRemover: pessoa.contatos
          .filter((c) => !contatoIdsAtuais.has(c.id))
          .map((c) => c.id),
      });

      visivel.value = false;
      emit('salvou');
      sucesso('Pessoa atualizada com sucesso');
    } else {
      await cadastrarPessoa(api, dados);
      visivel.value = false;
      emit('salvou');
      sucesso('Pessoa cadastrada com sucesso');
    }
  } catch (err) {
    erro(obterErroDaRequisicao(err) || 'Não foi possível realizar a operação');
  } finally {
    salvando.value = false;
  }
});

const tipoPessoa = computed(() =>
  !cpfCnpj.value || apenasNumeros(cpfCnpj.value).length < 14 ? 'fisica' : 'juridica'
);

const modalEmpresasFormularioVisivel = ref(false);

const modalEnderecosFormularioVisivel = ref(false);

const modalContatosFormularioVisivel = ref(false);
</script>
