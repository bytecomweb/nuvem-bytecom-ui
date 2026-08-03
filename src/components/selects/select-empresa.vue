<template>
  <Select
    :options="empresas"
    option-label="nomeRazao"
    fluid
    :loading="carregando"
    label-id="empresaSelecionada"
    v-model="modelValue"
    :auto-filter-focus="false"
    reset-filter-on-clear
    ref="select"
    empty-filter-message="Nenhuma empresa encontrada"
    empty-message="Nenhuma empresa para exibir"
    @before-hide="aoEsconder"
    @filter="(e) => (busca = e.value)"
  >
    <template #header>
      <div class="p-3">
        <InputGroup>
          <InputText fluid v-model="busca" @keydown.enter="tentaObterEmpresas" />
          <InputGroupAddon @click="tentaObterEmpresas">
            <span class="pi pi-search" />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </template>
    <template #option="{ option }">
      {{ option.nomeRazao.length > 30 ? `${option.nomeRazao.slice(0, 30)}...` : option.nomeRazao }}
    </template>
  </Select>
</template>
<script lang="ts" setup>
import useApi from '@/composables/use-api';
import useNotification from '@/composables/use-notification';
import obterEmpresasDoUsuario from '@/data/usuario/obter-empresas-do-usuario';
import { Empresa } from '@/types/modelos/empresa';
import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
import { InputGroup, InputGroupAddon, InputText, Select } from 'primevue';
import { onMounted, ref, useTemplateRef, watch } from 'vue';

const modelValue = defineModel<Empresa | undefined>({
  required: true,
});

const { selecionarPrimeiroAutomaticamente, bearerToken } = defineProps<{
  selecionarPrimeiroAutomaticamente?: boolean;
  filtro?: boolean;
  bearerToken?: string;
}>();

const api = useApi(bearerToken);

const select = useTemplateRef('select');

const busca = ref('');
const carregando = ref(false);
const empresas = ref<Empresa[]>([]);

async function tentaObterEmpresas() {
  try {
    if (empresas.value.length === 0 && modelValue.value) {
      empresas.value = [modelValue.value];
    }

    carregando.value = true;

    const { dados } = await obterEmpresasDoUsuario(api, busca.value);

    if (modelValue.value) {
      console.log(modelValue.value);

      empresas.value = [
        modelValue.value,
        ...dados
          .filter((empresa) => !modelValue.value || empresa.id !== modelValue.value.id)
          .map((empresa) => ({
            ...empresa,
          })),
      ];
    } else {
      empresas.value = dados;
    }

    if (modelValue.value) {
      if (empresas.value.length === 0) {
        modelValue.value = undefined;
      } else {
        const taNaLista = empresas.value.some((empresa) => empresa.id === modelValue.value?.id);

        if (!taNaLista) {
          if (selecionarPrimeiroAutomaticamente) {
            modelValue.value = empresas.value[0];
          } else {
            modelValue.value = undefined;
          }
        }
      }
    }
  } catch (err) {
    erro(obterErroDaRequisicao(err) || 'Não foi possível carregar as empresas');
  } finally {
    carregando.value = false;
  }
}

const { erro } = useNotification();

watch(empresas, () => {
  if (empresas.value.length > 0 && !modelValue.value && selecionarPrimeiroAutomaticamente) {
    modelValue.value = empresas.value[0];
  }
});

const aoEsconder = () => {
  // Reseta a busca ao fechar
  if (
    modelValue.value &&
    select.value &&
    'filterValue' in select.value &&
    typeof select.value.filterValue === 'string'
  ) {
    busca.value = '';
    select.value.filterValue = '';
  }
};

onMounted(tentaObterEmpresas);

watch(modelValue, () => (busca.value = ''));
</script>
