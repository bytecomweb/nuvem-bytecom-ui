<template>
  <Dialog
    modal
    :header="pessoa ? 'Atualizar' : 'Cadastrar'"
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
    </div>
    <template #footer>
      <div class="flex justify-between items-center w-full">
        <div>
          <Button
            label="Empresas"
            @click="modalEmpresasFormularioVisivel = true"
            severity="secondary"
          />
        </div>
        <div>
          <Button label="Salvar" @click="tentaSalvar" />
        </div>
      </div>
    </template>
  </Dialog>
  <ModalEmpresasFormulario
    v-model:visivel="modalEmpresasFormularioVisivel"
    titulo="Empresas da pessoa"
    para-adicionar-key="empresasParaAdicionar"
    para-remover-key="empresasParaRemover"
  />
</template>
<script lang="ts" setup>
import InputCpfOuCnpj from '@/components/inputs/input-cpf-ou-cnpj.vue';
import InputTelefone from '@/components/inputs/input-telefone.vue';
import Label from '@/components/label.vue';
import ModalEmpresasFormulario from '@/components/modals/modal-empresas-formulario.vue';
import { pessoaFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-formulario-schema';
import useNotification from '@/composables/use-notification';
import { Empresa } from '@/types/modelos/empresa';
import { Pessoa } from '@/types/modelos/pessoa';
import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
import apenasNumeros from '@/utils/texto/apenas-numeros';
import { toTypedSchema } from '@vee-validate/zod';
import { Button, Dialog, InputText } from 'primevue';
import { useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';

const visivel = defineModel<boolean>('visivel', {
  required: true,
});

const { defineField, resetForm, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(pessoaFormularioSchema),
  initialValues: {
    empresasParaAdicionar: [],
    empresasParaRemover: [],
    enderecos: [],
  },
});

const { empresaSelecionada, pessoa } = defineProps<{
  pessoa?: Pessoa;
  empresaSelecionada: Empresa;
}>();

const [nomeRazao, nomeRazaoAttrs] = defineField('nomeRazao');
const [nomeFantasia, nomeFantasiaAttrs] = defineField('nomeFantasia');
const [cpfCnpj, cpfCnpjAttrs] = defineField('cpfCnpj');
const [email, emailAttrs] = defineField('email');
const [telefone, telefoneAttrs] = defineField('telefone');

watch(visivel, () => {
  resetForm({
    values: {
      empresasParaAdicionar: [empresaSelecionada],
      empresasParaRemover: [],
    },
  });
});

const { erro } = useNotification();

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
  } catch (err) {
    erro(obterErroDaRequisicao(err) || 'Não foi possível realizar a operação');
  }
});

const tipoPessoa = computed(() =>
  !cpfCnpj.value || apenasNumeros(cpfCnpj.value).length < 14 ? 'fisica' : 'juridica'
);

const modalEmpresasFormularioVisivel = ref(false);
</script>
