<template>
  <Select
    :options="empresas"
    option-label="nomeRazao"
    fluid
    :loading="carregando"
    label-id="empresaSelecionada"
    v-model="modelValue"
    :filter="filtro"
    :auto-filter-focus="false"
    reset-filter-on-clear
    ref="select"
    empty-filter-message="Nenhuma empresa encontrada"
    empty-message="Nenhuma empresa para exibir"
    @before-hide="aoEsconder"
    @filter="(e) => (busca = e.value)"
  >
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
  import { AxiosInstance } from 'axios';
  import { Select } from 'primevue';
  import { onMounted, ref, useTemplateRef, watch } from 'vue';

  const modelValue = defineModel<Empresa | undefined>({
    required: true,
  });

  const { selecionarPrimeiroAutomaticamente } = defineProps<{
    selecionarPrimeiroAutomaticamente?: boolean;
    filtro?: boolean;
  }>();

  const api = useApi();

  const select = useTemplateRef('select');

  const busca = ref('');
  const carregando = ref(false);
  const empresas = ref<Empresa[]>([]);

  async function tentaObterEmpresas() {
    try {
      carregando.value = true;

      const { dados } = await obterEmpresasDoUsuario(api, busca.value);

      empresas.value = dados.map((empresa) => ({
        ...empresa,
      }));
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

  watch(busca, () => {
    tentaObterEmpresas();
  });
</script>
