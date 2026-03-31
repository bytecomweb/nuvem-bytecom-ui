<template>
  <Dialog v-model:visible="visivel" modal header="Conectando instância padrão...">
    <p>Escaneie o QR code com o WhatsApp</p>
    <img :src="base64" alt="QR code" v-if="base64 && !carregando" />
    <div class="flex justify-center items-center size-87.5!" v-else>
      <div class="text-center mt-5">
        <span class="pi pi-spin pi-spinner text-orange-400" style="font-size: 1.6rem" />
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import conectarWhatsAppInstanciaPadrao from '@/data/whatsapp/conectar-whatsapp-instancia-padrao';
  import obterWhatsAppInstanciaPadrao from '@/data/whatsapp/obter-whatsapp-instancia-padrao';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { Dialog } from 'primevue';
  import { onBeforeUnmount, ref, watch } from 'vue';

  const { empresaId } = defineProps<{
    empresaId: number;
  }>();

  const visivel = defineModel<boolean>('visivel', {
    required: true,
  });

  const emit = defineEmits(['atualizarLista']);

  const { erro, sucesso } = useNotification();

  const carregando = ref(false);
  const base64 = ref<string>();

  let intervaloId: ReturnType<typeof setInterval> | null = null;

  const api = useApi();

  const tentaConectar = async () => {
    try {
      carregando.value = true;

      const { dados } = await conectarWhatsAppInstanciaPadrao(api, empresaId);

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
    try {
      const {
        dados: {
          conexao: { state: status },
        },
      } = await obterWhatsAppInstanciaPadrao(api, empresaId);

      if (status === 'open') {
        sucesso('WhatsApp conectado com sucesso');

        terminarVerificacao();

        setTimeout(() => {
          visivel.value = false;
          emit('atualizarLista');
        }, 150);
      }
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível verificar o estado da instância');
    }
  };

  const iniciarVerificacao = () => {
    if (visivel.value && !intervaloId) {
      intervaloId = setInterval(verificarEstadoDaInstancia, 1000);
    }
  };

  const terminarVerificacao = () => {
    if (intervaloId) {
      clearInterval(intervaloId);
      intervaloId = null;
    }
  };

  watch(visivel, (novoValor) => {
    if (novoValor) {
      void tentaConectar();
      return;
    }

    terminarVerificacao();
    base64.value = undefined;
  });

  onBeforeUnmount(() => {
    terminarVerificacao();
  });
</script>
