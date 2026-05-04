<template>
  <Dialog header="Endereços da pessoa" modal v-model:visible="visivel" class="min-w-125!">
    <DataTable :value="fields">
      <template #empty>
        <NenhumConteudoEncontrado mensagem="Nenhum endereço adicionado" />
      </template>
      <Column>
        <template #body="{ data }">
          <Tag :value="tipoLabel[data.value.tipo as keyof typeof tipoLabel]" severity="secondary" />
        </template>
      </Column>
      <Column>
        <template #body="{ data }">
          {{ data.value.logradouro }}, {{ data.value.bairro }} - {{ data.value.numero || 'S/N' }} -
          {{ data.value.cidade }}, {{ data.value.uf }} - {{ formatarCep(data.value.cep) }}
        </template>
      </Column>
      <Column style="width: 6rem">
        <template #body="{ index }">
          <Button icon="pi pi-pencil" text severity="secondary" @click="editarEndereco(index)" />
          <Button
            icon="pi pi-times"
            text
            severity="danger"
            @click="confirmarRemoverEndereco($event, index)"
          />
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
    @atualizar="(index, endereco) => update(index, endereco)"
  />
</template>
<script lang="ts" setup>
import NenhumConteudoEncontrado from '@/components/nenhum-conteudo-encontrado.vue';
import TelaPessoasModalEnderecoFormulario from '@/components/telas/tela-pessoas/components/tela-pessoas-modal-endereco-formulario.vue';
import { pessoaEnderecoFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-endereco-formulario-schema';
import { PessoaEnderecoTipo } from '@/types/modelos/pessoa-endereco-tipo';
import formatarCep from '@/utils/texto/formatar-cep';
import { Button, Column, DataTable, Dialog, Tag } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useFieldArray } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import z from 'zod';

const visivel = defineModel<boolean>('visivel', {
  required: true,
});

defineProps<{
  errors: Record<string, string | undefined>;
  tituloLabel: string;
}>();

watch(visivel, () => {
  indexSelecionado.value = undefined;
});

const { fields, push, remove, update } =
  useFieldArray<z.infer<typeof pessoaEnderecoFormularioSchema>>('enderecos');

const confirm = useConfirm();

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

const removerEndereco = (index: number) => {
  remove(index);
};

const confirmarRemoverEndereco = (event: Event, index: number) => {
  const endereco = fields.value[index]?.value;
  const descricao = endereco
    ? `${tipoLabel[endereco.tipo]}: ${endereco.logradouro}, ${endereco.numero || 'S/N'}`
    : 'este endereço';

  confirm.require({
    target: event.currentTarget as HTMLElement,
    header: 'Remover endereço?',
    message: `Deseja realmente remover o endereço ${descricao}?`,
    acceptLabel: 'Remover',
    acceptProps: {
      severity: 'danger',
    },
    rejectLabel: 'Cancelar',
    rejectProps: {
      severity: 'secondary',
    },
    accept: () => removerEndereco(index),
  });
};

const editarEndereco = (index: number) => {
  indexSelecionado.value = index;
  formularioVisivel.value = true;
};

const tipoLabel: Record<PessoaEnderecoTipo, string> = {
  COBRANCA: 'Cobrança',
  ENTREGA: 'Entrega',
  OUTROS: 'Outros',
  PRINCIPAL: 'Principal',
};
</script>
