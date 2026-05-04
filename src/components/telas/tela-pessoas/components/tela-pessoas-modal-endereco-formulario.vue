<template>
  <Dialog
    :header="typeof index === 'number' ? 'Editar endereço' : 'Adicionar endereço'"
    modal
    v-model:visible="visivel"
    class="min-w-125!"
  >
    <div class="mt-2 grid grid-cols-[1fr_1fr_1fr] gap-3">
      <Label label="Tipo" :feedback="errors.tipo">
        <Select
          v-bind="tipoAttrs"
          v-model="tipo"
          :invalid="!!errors.tipo"
          :options="tipoEnderecoOpcoes"
          option-label="nome"
          option-value="valor"
          fluid
        />
      </Label>
      <Label label="CEP" :feedback="errors.cep" class="col-span-2">
        <InputCep v-bind="cepAttrs" v-model="cep" :invalid="!!errors.cep" fluid />
      </Label>
      <Label label="Logradouro" :feedback="errors.logradouro" class="col-span-2">
        <InputText
          v-bind="logradouroAttrs"
          v-model="logradouro"
          :invalid="!!errors.logradouro"
          fluid
        />
      </Label>
      <Label label="Bairro" :feedback="errors.bairro">
        <InputText v-bind="bairroAttrs" v-model="bairro" :invalid="!!errors.bairro" fluid />
      </Label>
      <Label label="Número" :feedback="errors.numero">
        <InputText
          v-bind="numeroAttrs"
          v-model="numero"
          :invalid="!!errors.numero"
          fluid
          v-keyfilter.int
        />
      </Label>
      <Label label="Cidade" :feedback="errors.cidade">
        <InputText v-bind="cidadeAttrs" v-model="cidade" :invalid="!!errors.cidade" fluid />
      </Label>
      <Label label="UF" :feedback="errors.uf">
        <InputText
          v-bind="ufAttrs"
          v-model="uf"
          :invalid="!!errors.uf"
          fluid
          class="uppercase"
          maxlength="2"
        />
      </Label>
      <Label label="Complemento" class="col-span-3">
        <Textarea
          v-bind="complementoAttrs"
          v-model="complemento"
          :invalid="!!errors.complemento"
          fluid
        />
      </Label>
    </div>
    <template #footer>
      <Button :label="typeof index === 'number' ? 'Atualizar' : 'Adicionar'" @click="tentaSalvar" />
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import InputCep from '@/components/inputs/input-cep.vue';
import Label from '@/components/label.vue';
import { pessoaEnderecoFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-endereco-formulario-schema';
import { PessoaEnderecoTipo } from '@/types/modelos/pessoa-endereco-tipo';
import { SelectPadrao } from '@/types/select-padrao';
import apenasNumeros from '@/utils/texto/apenas-numeros';
import { toTypedSchema } from '@vee-validate/zod';
import { Button, Dialog, InputText, Select, Textarea } from 'primevue';
import { useForm } from 'vee-validate';
import { watch } from 'vue';
import z from 'zod';

const { defineField, resetForm, errors, handleSubmit } = useForm({
  name: 'pessoa-endereco-formulario',
  validationSchema: toTypedSchema(pessoaEnderecoFormularioSchema),
});

const [tipo, tipoAttrs] = defineField('tipo');
const [cep, cepAttrs] = defineField('cep');
const [logradouro, logradouroAttrs] = defineField('logradouro');
const [bairro, bairroAttrs] = defineField('bairro');
const [cidade, cidadeAttrs] = defineField('cidade');
const [uf, ufAttrs] = defineField('uf');
const [numero, numeroAttrs] = defineField('numero');
const [complemento, complementoAttrs] = defineField('complemento');

const { endereco, index } = defineProps<{
  endereco?: z.infer<typeof pessoaEnderecoFormularioSchema>;
  index?: number;
}>();

const visivel = defineModel<boolean>('visivel', {
  required: true,
});

watch(visivel, () => {
  resetForm(
    {
      values: endereco ?? {},
    },
    {
      force: true,
    }
  );
});

const tipoEnderecoOpcoes: SelectPadrao<PessoaEnderecoTipo>[] = [
  {
    nome: 'Principal',
    valor: 'PRINCIPAL',
  },
  {
    nome: 'Cobrança',
    valor: 'COBRANCA',
  },
  {
    nome: 'Entrega',
    valor: 'ENTREGA',
  },
  {
    nome: 'Outros',
    valor: 'OUTROS',
  },
];

const emit = defineEmits<{
  adicionar: [endereco: z.infer<typeof pessoaEnderecoFormularioSchema>];
  atualizar: [index: number, endereco: z.infer<typeof pessoaEnderecoFormularioSchema>];
}>();

const tentaSalvar = handleSubmit((dados) => {
  dados.uf = dados.uf.toUpperCase();
  dados.cep = apenasNumeros(dados.cep);

  if (typeof index === 'number') {
    emit('atualizar', index, dados);
  } else {
    emit('adicionar', dados);
  }

  visivel.value = false;
});
</script>
