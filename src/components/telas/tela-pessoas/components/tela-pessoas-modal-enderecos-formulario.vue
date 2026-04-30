<template>
  <Dialog header="Endereços da pessoa" modal v-model:visible="visivel" class="min-w-125!">
    <template #footer>
      <Button label="Adicionar endereço" @click="adicionarEndereco" />
    </template>
  </Dialog>
  <Dialog header="Adicionar endereço" modal v-model:visible="formularioVisivel" class="min-w-125!">
    {{ errosTratados }}
    <div v-if="enderecoSelecionado">
      <Label label="Tipo">
        <Select
          v-model="enderecoSelecionado.value.tipo"
          :options="tipoEnderecoOpcoes"
          show-clear
          option-label="nome"
          option-value="valor"
          fluid
        />
      </Label>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import Label from '@/components/label.vue';
import { pessoaEnderecoFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-endereco-formulario-schema';
import { PessoaEnderecoTipo } from '@/types/modelos/pessoa-endereco-tipo';
import { SelectPadrao } from '@/types/select-padrao';
import { Button, Dialog, Select } from 'primevue';
import { useFieldArray } from 'vee-validate';
import { computed, nextTick, ref, watch } from 'vue';
import z from 'zod';

const visivel = defineModel<boolean>('visivel', {
  required: true,
});

const { errors, setFieldError } = defineProps<{
  errors: Record<string, string | undefined>;
  setFieldError: (campo: string, mensagem: string | string[] | undefined) => void;
}>();

watch(visivel, () => {
  indexSelecionado.value = undefined;
});

const { fields, push, update } =
  useFieldArray<Partial<z.infer<typeof pessoaEnderecoFormularioSchema>>>('enderecos');

const indexSelecionado = ref<number>();

const enderecoSelecionado = computed({
  get() {
    return typeof indexSelecionado.value === 'number'
      ? fields.value[indexSelecionado.value]
      : undefined;
  },
  set(endereco?: Partial<z.infer<typeof pessoaEnderecoFormularioSchema>>) {
    if (typeof indexSelecionado.value === 'number' && endereco) {
      return update(indexSelecionado.value, endereco);
    }

    indexSelecionado.value = undefined;
  },
});

const formularioVisivel = computed({
  get() {
    return !!enderecoSelecionado.value;
  },
  set() {
    indexSelecionado.value = undefined;
  },
});

const adicionarEndereco = () => {
  push({});

  nextTick(() => {
    indexSelecionado.value = fields.value.length - 1;

    setTimeout(() => {
      setFieldError(`enderecos[${indexSelecionado.value}].bairro`, undefined);
      setFieldError(`enderecos[${indexSelecionado.value}].cep`, undefined);
      setFieldError(`enderecos[${indexSelecionado.value}].logradouro`, undefined);
      setFieldError(`enderecos[${indexSelecionado.value}].tipo`, undefined);
    }, 5);
  });
};

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

const errosTratados = computed<Record<string, string | undefined>>(() => {
  if (typeof indexSelecionado.value === 'number') {
    // setFieldError(`enderecos[${indexSelecionado.value}].bairro`, undefined);
    //   setFieldError(`enderecos[${indexSelecionado.value}].cep`, undefined);
    //   setFieldError(`enderecos[${indexSelecionado.value}].logradouro`, undefined);
    //   setFieldError(`enderecos[${indexSelecionado.value}].tipo`, undefined);

    return {
      bairro: errors[`enderecos[${indexSelecionado.value}].bairro`],
      cep: errors[`enderecos[${indexSelecionado.value}].cep`],
      logradouro: errors[`enderecos[${indexSelecionado.value}].logradouro`],
      tipo: errors[`enderecos[${indexSelecionado.value}].tipo`],
    };
  }

  return {};
});
</script>
