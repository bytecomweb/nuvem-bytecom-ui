<template>
  <Select
    :options="tabelas"
    option-label="descricao"
    option-value="id"
    fluid
    :loading="carregando"
    :invalid
    v-model="modelValue"
    empty-message="Nenhuma tabela de preço para exibir"
  />
</template>
<script lang="ts" setup>
import useApi from '@/composables/use-api';
import useNotification from '@/composables/use-notification';
import obterTabelasPreco from '@/data/tabela-preco/obter-tabelas-preco';
import { TabelaPreco } from '@/types/modelos/tabela-preco';
import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
import { Select } from 'primevue';
import { onMounted, ref, toRef, watch } from 'vue';

const modelValue = defineModel<number | null | undefined>({
  required: true,
});

const props = defineProps<{
  empresaId: number;
  invalid?: boolean;
  bearerToken?: string;
}>();

const empresaId = toRef(() => props.empresaId);
const invalid = toRef(() => props.invalid);

const api = useApi(props.bearerToken);

const carregando = ref(false);
const tabelas = ref<TabelaPreco[]>([]);

async function tentaObterTabelasPreco() {
  try {
    if (!empresaId.value) {
      tabelas.value = [];
      modelValue.value = null;
      return;
    }

    carregando.value = true;

    const { dados } = await obterTabelasPreco(api, empresaId.value);

    tabelas.value = dados;

    if (modelValue.value) {
      const taNaLista = tabelas.value.some((tabela) => tabela.id === modelValue.value);

      if (!taNaLista) {
        modelValue.value = null;
      }
    }
  } catch (err) {
    erro(obterErroDaRequisicao(err) || 'Não foi possível carregar as tabelas de preço');
  } finally {
    carregando.value = false;
  }
}

const { erro } = useNotification();

watch(empresaId, tentaObterTabelasPreco);

onMounted(tentaObterTabelasPreco);
</script>
