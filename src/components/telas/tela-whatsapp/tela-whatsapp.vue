<template>
  <TelaWhatsappCabecalho
    v-model:empresa-selecionada="empresaSelecionada"
    @criar="formularioVisivel = true"
  />
  <main class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 px-3 mt-2 gap-2">
    <TelaWhatsappCardInstanciaPadrao
      v-if="ehAdmin && instanciaPadrao?.instancia"
      :instancia="instanciaPadrao.instancia"
      :conexao="instanciaPadrao.conexao"
      :monitoramento="instanciaPadrao.monitoramento"
      :bloqueado="instanciaPadrao.configuracao.bloquearInstanciaPadraoWhatsApp"
    />
    <!-- @atualizar="refreshInstanciaPadrao"
      @conectar="modalInstanciaPadraoConectarVisivel = true"
      @desconectar="confirmarDesconexaoInstanciaPadrao"
      @iniciar-monitoramento="tentaIniciarMonitoramentoInstanciaPadrao"
      @parar-monitoramento="tentaPararMonitoramentoInstanciaPadrao" -->
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
  <TelaWhatsappFormulario
    v-model:visivel="formularioVisivel"
    v-if="empresaSelecionada"
    :empresa-id="empresaSelecionada?.id"
    @atualizar-instancias="tentaObterInstancias"
  />
</template>
<script lang="ts" setup>
  import TelaWhatsappCabecalho from '@/components/telas/tela-whatsapp/components/tela-whatsapp-cabecalho.vue';
  import TelaWhatsappCardInstanciaPadrao from '@/components/telas/tela-whatsapp/components/tela-whatsapp-card-instancia-padrao.vue';
  import TelaWhatsappCardInstancia from '@/components/telas/tela-whatsapp/components/tela-whatsapp-card-instancia.vue';
  import TelaWhatsappFormulario from '@/components/telas/tela-whatsapp/components/tela-whatsapp-formulario.vue';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import obterWhatsAppInstanciaPadrao, {
    DadosInstanciaPadrao,
  } from '@/data/whatsapp/obter-whatsapp-instancia-padrao';
  import obterWhatsAppInstancias from '@/data/whatsapp/obter-whatsapp-instancias';
  import { Empresa } from '@/types/modelos/empresa';
  import { WhatsAppInstancia } from '@/types/modelos/whatsapp-instancia';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { computed, onMounted, ref, watch } from 'vue';

  const { bearerToken, ehAdmin } = defineProps<{
    bearerToken: string;
    ehAdmin?: boolean;
  }>();

  const api = useApi(bearerToken);

  const empresaSelecionada = ref<Empresa>();

  const instancias = ref<WhatsAppInstancia[]>([]);

  const instanciasTratadas = computed(() => {
    if (!ehAdmin) {
      return instancias.value;
    }

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

  const instanciaPadrao = ref<DadosInstanciaPadrao>();

  const tentaObterInstanciaPadrao = async () => {
    try {
      if (!empresaSelecionada.value) return;

      const { dados } = await obterWhatsAppInstanciaPadrao(api, empresaSelecionada.value.id);

      instanciaPadrao.value = dados;
    } catch (err) {
      erro(
        obterErroDaRequisicao(err) ||
          'Não foi possível obter a instância padrão de WhatsApp. Tente novamente mais tarde.'
      );
    }
  };

  onMounted(() => {
    tentaObterInstancias();
    tentaObterInstanciaPadrao();
  });

  watch(empresaSelecionada, () => {
    instancias.value = [];
    tentaObterInstancias();
    tentaObterInstanciaPadrao();
  });

  const formularioVisivel = ref(false);
</script>
