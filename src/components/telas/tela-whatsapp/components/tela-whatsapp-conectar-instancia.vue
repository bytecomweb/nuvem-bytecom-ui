<template>
  <Dialog v-model:visible="visivel" modal header="Conectando à instância...">
    <p>Escaneie o QR code com o WhatsApp</p>
    <img :src="base64" alt="QR code" v-if="base64 && !carregando" />
    <div class="flex justify-center items-center size-87.5" v-else>
      <div class="text-center mt-5">
        <span class="pi pi-spin pi-spinner text-orange-400" style="font-size: 1.6rem" />
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import conectarWhatsAppInstancia from '@/data/whatsapp/conectar-whatsapp-instancia';
  import obterStatusDaConexaoDaWhatsAppInstancia from '@/data/whatsapp/obter-status-da-conexao-da-whatsapp-instancia';
  import { WhatsAppInstancia } from '@/types/modelos/whatsapp-instancia';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { Dialog } from 'primevue';
  import { computed, ref, watch } from 'vue';

  const instancia = defineModel<WhatsAppInstancia | undefined>('instancia', {
    required: true,
  });

  const emit = defineEmits(['atualizarLista']);

  const visivel = computed({
    get() {
      return !!instancia.value;
    },
    set() {
      instancia.value = undefined;
    },
  });

  const { empresaId } = defineProps<{
    empresaId: number;
  }>();

  const { erro, sucesso } = useNotification();

  const carregando = ref(false);
  const base64 = ref<string>();

  let intervaloId: ReturnType<typeof setInterval> | null = null;

  const api = useApi();

  const tentaConectar = async () => {
    try {
      if (!instancia.value) return;

      carregando.value = true;

      const { dados } = await conectarWhatsAppInstancia(api, empresaId, instancia.value.name);

      base64.value = dados.base64;
      iniciarVerificacao();
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível conectar');
      visivel.value = false;
    } finally {
      carregando.value = false;
    }
  };

  const verificarEstadoDaInstancia = async () => {
    if (!instancia.value) return;

    let tentativas = 0;

    try {
      const {
        dados: { state: status },
      } = await obterStatusDaConexaoDaWhatsAppInstancia(api, empresaId, instancia.value.name);

      if (status === 'open') {
        sucesso('WhatsApp conectado com sucesso');

        terminarVerificacao();

        setTimeout(() => {
          instancia.value = undefined;
          emit('atualizarLista');
        }, 150);
      }
    } catch (err) {
      tentativas++;
      erro(
        obterErroDaRequisicao(err) ||
          `Não foi possível verificar o estado da instância (${tentativas} tentativa(s))`
      );
    }
  };

  const iniciarVerificacao = () => {
    if (instancia.value && !intervaloId) {
      intervaloId = setInterval(verificarEstadoDaInstancia, 1000);
    }
  };

  const terminarVerificacao = () => {
    if (intervaloId) {
      clearInterval(intervaloId);
      intervaloId = null;
    }
  };

  watch(instancia, tentaConectar, {
    immediate: true,
  });
</script>
