<template>
  <TelaWhatsappCabecalho
    v-model:empresa-selecionada="empresaSelecionada"
    @criar="formularioVisivel = true"
  />
  <main
    class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2"
    :style="{
      marginTop: '15px',
      paddingLeft: '10px',
      paddingRight: '10px',
    }"
  >
    <TelaWhatsappCardInstanciaPadrao
      v-if="ehAdmin && instanciaPadrao?.instancia"
      :instancia="instanciaPadrao.instancia"
      :conexao="instanciaPadrao.conexao"
      :monitoramento="instanciaPadrao.monitoramento"
      :bloqueado="instanciaPadrao.configuracao.bloquearInstanciaPadraoWhatsApp"
      @atualizar="tentaObterInstanciaPadrao"
      @conectar="conectarInstanciaPadraoVisivel = true"
      @desconectar="confirmarDesconexaoInstanciaPadrao"
      @iniciar-monitoramento="tentaIniciarMonitoramentoInstanciaPadrao"
      @parar-monitoramento="tentaPararMonitoramentoInstanciaPadrao"
    />
    <TelaWhatsappCardInstancia
      v-for="(instancia, idx) in instanciasTratadas"
      :instancia
      :gerenciamento-restrito="instancia.podeGerenciar === false"
      :key="idx"
      @apagar="() => confirmarApagarInstancia(instancia.name)"
      @configurar="instanciaParaConfigurar = instancia"
      @conectar="instanciaParaConectar = instancia"
      @desconectar="confirmarDesconexao(instancia.name)"
    />
  </main>
  <TelaWhatsappFormulario
    v-model:visivel="formularioVisivel"
    v-if="empresaSelecionada"
    :empresa-id="empresaSelecionada?.id"
    @atualizar-instancias="tentaObterInstancias"
  />
  <TelaWhatsappConfiguracaoFormulario
    v-model:instancia="instanciaParaConfigurar"
    v-if="empresaSelecionada"
    :empresa-id="empresaSelecionada.id"
  />
  <TelaWhatsappConectarInstancia
    v-model:instancia="instanciaParaConectar"
    v-if="empresaSelecionada"
    :empresa-id="empresaSelecionada.id"
    @atualizarLista="tentaObterInstancias"
  />
  <TelaWhatsappConectarInstanciaPadrao
    v-if="empresaSelecionada"
    v-model:visivel="conectarInstanciaPadraoVisivel"
    :empresa-id="empresaSelecionada.id"
  />
  <ConfirmDialog />
  <Toast />
</template>
<script lang="ts" setup>
  import TelaWhatsappCabecalho from '@/components/telas/tela-whatsapp/components/tela-whatsapp-cabecalho.vue';
  import TelaWhatsappCardInstanciaPadrao from '@/components/telas/tela-whatsapp/components/tela-whatsapp-card-instancia-padrao.vue';
  import TelaWhatsappCardInstancia from '@/components/telas/tela-whatsapp/components/tela-whatsapp-card-instancia.vue';
  import TelaWhatsappConectarInstanciaPadrao from '@/components/telas/tela-whatsapp/components/tela-whatsapp-conectar-instancia-padrao.vue';
  import TelaWhatsappConectarInstancia from '@/components/telas/tela-whatsapp/components/tela-whatsapp-conectar-instancia.vue';
  import TelaWhatsappConfiguracaoFormulario from '@/components/telas/tela-whatsapp/components/tela-whatsapp-configuracao-formulario.vue';
  import TelaWhatsappFormulario from '@/components/telas/tela-whatsapp/components/tela-whatsapp-formulario.vue';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import apagarWhatsAppInstancia from '@/data/whatsapp/apagar-whatsapp-instancia';
  import desconectarWhatsAppInstancia from '@/data/whatsapp/desconectar-whatsapp-instancia';
  import desconectarWhatsAppInstanciaPadrao from '@/data/whatsapp/desconectar-whatsapp-instancia-padrao';
  import iniciarMonitoramentoWhatsAppInstanciaPadrao from '@/data/whatsapp/iniciar-monitoramento-whatsapp-instancia-padrao';
  import obterWhatsAppInstanciaPadrao, {
    DadosInstanciaPadrao,
  } from '@/data/whatsapp/obter-whatsapp-instancia-padrao';
  import obterWhatsAppInstancias from '@/data/whatsapp/obter-whatsapp-instancias';
  import pararMonitoramentoDaWhatsAppInstanciaPadrao from '@/data/whatsapp/parar-monitoramento-da-whatsapp-instancia-padrao';
  import { Empresa } from '@/types/modelos/empresa';
  import { WhatsAppInstancia } from '@/types/modelos/whatsapp-instancia';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import apenasNumeros from '@/utils/texto/apenas-numeros';
  import formatarTexto from '@/utils/texto/formatar-texto';
  import removerSimbolos from '@/utils/texto/remover-simbolos';
  import { ConfirmDialog, Toast } from 'primevue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useConfirm } from 'primevue/useconfirm';

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

  const { erro, sucesso } = useNotification();

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

  const confirm = useConfirm();

  const confirmarApagarInstancia = (numero: string) => {
    const numeroFormatado = formatarTexto({
      texto: removerSimbolos(numero),
      mascara: ['(00) 0000-0000', '(00) 0 0000-0000', '+00 (00) 0000-0000', '+00 (00) 0 0000-0000'],
    });

    confirm.require({
      header: 'Apagar instância?',
      message: `Deseja realmente apagar a instância com o número ${numeroFormatado}?`,
      acceptLabel: 'Apagar',
      acceptProps: {
        severity: 'danger',
      },
      rejectLabel: 'Cancelar',
      rejectProps: {
        severity: 'secondary',
      },
      accept() {
        tentaApagarInstancia(numero);
      },
    });
  };

  const tentaApagarInstancia = async (numero: string) => {
    try {
      if (empresaSelecionada.value) {
        await apagarWhatsAppInstancia(api, empresaSelecionada.value.id, apenasNumeros(numero));
      }

      setTimeout(() => {
        tentaObterInstancias();
      }, 150);
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível apagar instância');
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

  const instanciaParaConfigurar = ref<WhatsAppInstancia>();
  const instanciaParaConectar = ref<WhatsAppInstancia>();

  const confirmarDesconexao = (numero: string) => {
    if (!empresaSelecionada.value) return;

    const numeroFormatado = formatarTexto({
      texto: removerSimbolos(numero),
      mascara: ['(00) 0000-0000', '(00) 0 0000-0000', '+00 (00) 0000-0000', '+00 (00) 0 0000-0000'],
    });

    confirm.require({
      header: 'Desconectar instância?',
      message: `Deseja realmente desconectar a instância com o número ${numeroFormatado}?`,
      acceptLabel: 'Desconectar',
      acceptProps: {
        severity: 'danger',
      },
      rejectLabel: 'Cancelar',
      rejectProps: {
        severity: 'secondary',
      },
      accept() {
        tentaDesconectarInstancia(numero);
      },
    });
  };

  const tentaDesconectarInstancia = async (numero: string) => {
    try {
      if (!empresaSelecionada.value) {
        return;
      }

      await desconectarWhatsAppInstancia(api, empresaSelecionada.value.id, numero);

      sucesso('Instância desconectada com sucesso');

      setTimeout(tentaObterInstancias, 150);
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível desconectar');
    }
  };

  const conectarInstanciaPadraoVisivel = ref(false);

  const confirmarDesconexaoInstanciaPadrao = () => {
    confirm.require({
      header: 'Desconectar instância padrão?',
      message: 'Deseja realmente desconectar a instância padrão do WhatsApp?',
      acceptLabel: 'Desconectar',
      acceptProps: {
        severity: 'danger',
      },
      rejectLabel: 'Cancelar',
      rejectProps: {
        severity: 'secondary',
      },
      accept() {
        tentaDesconectarInstanciaPadrao();
      },
    });
  };

  const tentaDesconectarInstanciaPadrao = async () => {
    try {
      if (!empresaSelecionada.value) {
        return;
      }

      await desconectarWhatsAppInstanciaPadrao(api, empresaSelecionada.value.id);

      setTimeout(() => {
        tentaObterInstanciaPadrao();
      }, 150);
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível desconectar a instância padrão');
    }
  };

  const tentaIniciarMonitoramentoInstanciaPadrao = async () => {
    try {
      await iniciarMonitoramentoWhatsAppInstanciaPadrao(api);

      setTimeout(() => {
        tentaObterInstanciaPadrao();
      }, 150);
    } catch (err) {
      erro(
        obterErroDaRequisicao(err) || 'Não foi possível iniciar monitoramento da instância padrão'
      );
    }
  };

  const tentaPararMonitoramentoInstanciaPadrao = async () => {
    try {
      await pararMonitoramentoDaWhatsAppInstanciaPadrao(api);

      setTimeout(() => {
        tentaObterInstanciaPadrao();
      }, 150);
    } catch (err) {
      erro(
        obterErroDaRequisicao(err) || 'Não foi possível parar monitoramento da instância padrão'
      );
    }
  };
</script>
