<template>
  <Dialog :header="tituloLabel" modal v-model:visible="visivel" class="min-w-125!">
    <DataTable :value="fields">
      <template #empty>
        <NenhumConteudoEncontrado mensagem="Nenhum contato adicionado" />
      </template>
      <Column>
        <template #body="{ data }">
          <Tag :value="tipoLabel[data.value.tipo as keyof typeof tipoLabel]" severity="secondary" />
        </template>
      </Column>
      <Column>
        <template #body="{ data }">
          <div class="flex flex-col">
            <span>{{ data.value.email || 'Sem e-mail' }}</span>
            <span>
              {{ data.value.fone || 'Sem telefone' }}
              <Tag v-if="data.value.ehWhatsApp" value="WhatsApp" severity="success" class="ml-2" />
            </span>
          </div>
        </template>
      </Column>
      <Column style="width: 6rem">
        <template #body="{ index }">
          <Button icon="pi pi-pencil" text severity="secondary" @click="editarContato(index)" />
          <Button
            icon="pi pi-times"
            text
            severity="danger"
            @click="confirmarRemoverContato($event, index)"
          />
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <Button label="Adicionar contato" @click="adicionarContato" />
    </template>
  </Dialog>
  <TelaPessoasModalContatoFormulario
    v-model:visivel="formularioVisivel"
    :contato="contatoSelecionado"
    :index="indexSelecionado"
    @adicionar="(contato) => push(contato)"
    @atualizar="(index, contato) => update(index, contato)"
  />
</template>
<script lang="ts" setup>
import NenhumConteudoEncontrado from '@/components/nenhum-conteudo-encontrado.vue';
import TelaPessoasModalContatoFormulario from '@/components/telas/tela-pessoas/components/tela-pessoas-modal-contato-formulario.vue';
import { pessoaContatoFormularioSchema } from '@/components/telas/tela-pessoas/schemas/pessoa-contato-formulario-schema';
import { PessoaContatoTipo } from '@/types/modelos/pessoa-contato-tipo';
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
  useFieldArray<z.infer<typeof pessoaContatoFormularioSchema>>('contatos');

const confirm = useConfirm();

const indexSelecionado = ref<number>();

const formularioVisivel = ref(false);

const contatoSelecionado = computed(() => {
  if (typeof indexSelecionado.value !== 'number') {
    return undefined;
  }

  return fields.value[indexSelecionado.value]?.value;
});

const adicionarContato = () => {
  indexSelecionado.value = undefined;
  formularioVisivel.value = true;
};

const removerContato = (index: number) => {
  if (indexSelecionado.value === index) {
    indexSelecionado.value = undefined;
    formularioVisivel.value = false;
  }

  remove(index);
};

const confirmarRemoverContato = (event: Event, index: number) => {
  const contato = fields.value[index]?.value;
  const descricao = contato
    ? `${tipoLabel[contato.tipo]}: ${contato.email || contato.fone || 'sem identificação'}`
    : 'este contato';

  confirm.require({
    target: event.currentTarget as HTMLElement,
    header: 'Remover contato?',
    message: `Deseja realmente remover o contato ${descricao}?`,
    acceptLabel: 'Remover',
    acceptProps: {
      severity: 'danger',
    },
    rejectLabel: 'Cancelar',
    rejectProps: {
      severity: 'secondary',
    },
    accept: () => removerContato(index),
  });
};

const editarContato = (index: number) => {
  indexSelecionado.value = index;
  formularioVisivel.value = true;
};

const tipoLabel: Record<PessoaContatoTipo, string> = {
  COBRANCA: 'Cobrança',
  PRINCIPAL: 'Principal',
};
</script>
