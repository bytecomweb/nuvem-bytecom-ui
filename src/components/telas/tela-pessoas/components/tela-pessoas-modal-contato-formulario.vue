<template>
  <Dialog
    :header="typeof index === 'number' ? 'Editar contato' : 'Adicionar contato'"
    modal
    v-model:visible="visivel"
    class="min-w-125!"
  >
    <div class="mt-2 grid grid-cols-2 gap-3">
      <Label label="Tipo" :feedback="errors.tipo" class="col-span-2">
        <Select
          v-bind="tipoAttrs"
          v-model="tipo"
          :invalid="!!errors.tipo"
          :options="tipoContatoOpcoes"
          option-label="nome"
          option-value="valor"
          fluid
        />
      </Label>
      <Label label="Telefone" :feedback="errors.fone">
        <InputTelefone v-bind="foneAttrs" v-model="fone" :invalid="!!errors.fone" fluid />
      </Label>
      <Label label="E-mail" :feedback="errors.email">
        <InputText v-bind="emailAttrs" v-model="email" :invalid="!!errors.email" fluid />
      </Label>
      <div class="flex items-center">
        <Checkbox v-bind="ehWhatsAppAttrs" v-model="ehWhatsApp" binary input-id="eh-whatsapp" />
        <label for="eh-whatsapp" class="ml-2">WhatsApp</label>
      </div>
    </div>
    <template #footer>
      <Button :label="typeof index === 'number' ? 'Atualizar' : 'Adicionar'" @click="tentaSalvar" />
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import InputTelefone from '@/components/inputs/input-telefone.vue';
import Label from '@/components/label.vue';
import { pessoaContatoFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-contato-formulario-schema';
import { PessoaContatoTipo } from '@/types/modelos/pessoa-contato-tipo';
import { SelectPadrao } from '@/types/select-padrao';
import apenasNumeros from '@/utils/texto/apenas-numeros';
import { toTypedSchema } from '@vee-validate/zod';
import { Button, Checkbox, Dialog, InputText, Select } from 'primevue';
import { useForm } from 'vee-validate';
import { watch } from 'vue';
import z from 'zod';

const { defineField, resetForm, errors, handleSubmit } = useForm({
  name: 'pessoa-contato-formulario',
  validationSchema: toTypedSchema(pessoaContatoFormularioSchema),
});

const [tipo, tipoAttrs] = defineField('tipo');
const [fone, foneAttrs] = defineField('fone');
const [email, emailAttrs] = defineField('email');
const [ehWhatsApp, ehWhatsAppAttrs] = defineField('ehWhatsApp');

const { contato, index } = defineProps<{
  contato?: z.infer<typeof pessoaContatoFormularioSchema>;
  index?: number;
}>();

const visivel = defineModel<boolean>('visivel', {
  required: true,
});

watch(visivel, () => {
  resetForm(
    {
      values: contato ?? { ehWhatsApp: false },
    },
    {
      force: true,
    }
  );
});

const tipoContatoOpcoes: SelectPadrao<PessoaContatoTipo>[] = [
  {
    nome: 'Principal',
    valor: 'PRINCIPAL',
  },
  {
    nome: 'Cobrança',
    valor: 'COBRANCA',
  },
];

const emit = defineEmits<{
  adicionar: [contato: z.infer<typeof pessoaContatoFormularioSchema>];
  atualizar: [index: number, contato: z.infer<typeof pessoaContatoFormularioSchema>];
}>();

const tentaSalvar = handleSubmit((dados) => {
  dados.fone = dados.fone ? apenasNumeros(dados.fone) : undefined;
  dados.email = dados.email?.trim() || undefined;

  if (typeof index === 'number') {
    emit('atualizar', index, dados);
  } else {
    emit('adicionar', dados);
  }

  visivel.value = false;
});
</script>
