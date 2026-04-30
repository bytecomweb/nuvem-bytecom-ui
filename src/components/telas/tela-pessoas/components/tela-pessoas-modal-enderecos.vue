<template>
  <Dialog header="Endereços da pessoa" modal v-model:visible="visivel" class="min-w-125!">
    <DataTable :value="fields">
      <template #empty>
        <NenhumConteudoEncontrado mensagem="Nenhum endereço adicionado" />
      </template>
      <Column>
        <template #body="{ data }">
          {{ data.value.logradouro }}, {{ data.value.bairro }} - {{ data.value.numero || 'S/N' }} -
          {{ data.value.cidade }}, {{ data.value.uf }} - {{ formatarCep(data.value.cep) }}
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <Button label="Adicionar endereço" @click="adicionarEndereco" />
    </template>
  </Dialog>
  <TelaPessoasModalEnderecoFormulario
    v-model:visivel="formularioVisivel"
    :endereco="enderecoSelecionado"
    :index="indexSelecionado"
    @adicionar="(endereco) => push(endereco)"
  />
</template>
<script lang="ts" setup>
import NenhumConteudoEncontrado from '@/components/nenhum-conteudo-encontrado.vue';
import TelaPessoasModalEnderecoFormulario from '@/components/telas/tela-pessoas/components/tela-pessoas-modal-endereco-formulario.vue';
import { pessoaEnderecoFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-endereco-formulario-schema';
import formatarCep from '@/utils/texto/formatar-cep';
import { Button, Column, DataTable, Dialog } from 'primevue';
import { useFieldArray } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import z from 'zod';

const visivel = defineModel<boolean>('visivel', {
  required: true,
});

const { errors } = defineProps<{
  errors: Record<string, string | undefined>;
}>();

watch(visivel, () => {
  indexSelecionado.value = undefined;
});

const { fields, push, update } =
  useFieldArray<z.infer<typeof pessoaEnderecoFormularioSchema>>('enderecos');

const indexSelecionado = ref<number>();

const formularioVisivel = ref(false);

const enderecoSelecionado = computed(() => {
  return typeof indexSelecionado.value === 'number'
    ? fields.value[indexSelecionado.value].value
    : undefined;
});

const adicionarEndereco = () => {
  indexSelecionado.value = undefined;
  formularioVisivel.value = true;
};

const editarEndereco = (index: number) => {
  indexSelecionado.value = index;
  formularioVisivel.value = true;
};
</script>
