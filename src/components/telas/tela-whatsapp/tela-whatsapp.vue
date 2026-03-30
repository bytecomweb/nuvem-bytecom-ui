<template>
  <TelaWhatsappCabecalho v-model:empresa-selecionada="empresaSelecionada" />
  <main class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 px-3 mt-2 gap-2">
    <TelaWhatsappCardInstancia
      v-for="(instancia, idx) in instanciasTratadas"
      :instancia
      :gerenciamento-restrito="instancia.podeGerenciar === false"
      :key="idx"
    />
    <!-- @apagar="() => confirmarApagarInstancia(instancia.name)"
      @configurar="instanciaParaConfigurar = instancia"
      @conectar="instanciaParaConectar = instancia"
      @desconectar="confirmarDesconexao(instancia.name)" -->
  </main>
</template>
<script lang="ts" setup>
  import TelaWhatsappCabecalho from '@/components/telas/tela-whatsapp/components/tela-whatsapp-cabecalho.vue';
  import TelaWhatsappCardInstancia from '@/components/telas/tela-whatsapp/components/tela-whatsapp-card-instancia.vue';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import obterWhatsAppInstancias from '@/data/whatsapp/obter-whatsapp-instancias';
  import { Empresa } from '@/types/modelos/empresa';
  import { WhatsAppInstancia } from '@/types/modelos/whatsapp-instancia';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { computed, onMounted, ref, watch } from 'vue';

  const { bearerToken } = defineProps<{
    bearerToken: string;
    ehAdmin?: boolean;
  }>();

  const api = useApi(bearerToken);

  const empresaSelecionada = ref<Empresa>();

  const instancias = ref<WhatsAppInstancia[]>([]);

  const instanciasTratadas = computed(() => {
    return instancias.value.filter((instancia) => !instancia.ehInstanciaPadrao);
  });

  const { erro } = useNotification();

  const carregando = ref(false);

  const tentaObterInstancias = async () => {
    try {
      if (!empresaSelecionada.value) return;

      carregando.value = true;

      const { dados } = await obterWhatsAppInstancias(api, empresaSelecionada.value.id);

      instancias.value = dados;
    } catch (err) {
      erro(
        obterErroDaRequisicao(err) ||
          'Não foi possível obter as instâncias de WhatsApp. Tente novamente mais tarde.'
      );
    } finally {
      carregando.value = false;
    }
  };

  onMounted(tentaObterInstancias);

  watch(empresaSelecionada, () => {
    instancias.value = [];
    tentaObterInstancias();
  });
</script>
