<template>
  <Dialog v-model:visible="visivel" modal class="min-w-96!">
    <template #header>
      <div class="flex gap-2 items-center">
        <p class="text-xl font-semibold">Configurações da instância</p>
        <span class="pi pi-spinner pi-spin text-sm!" v-if="carregando"></span>
      </div>
    </template>
    <div class="flex flex-col gap-3 p-2">
      <CheckboxComLabel
        v-model="recusarChamadas"
        binary
        label="Recusar chamadas"
        id="recusar-chamadas"
        :disabled="carregando"
      />
      <Label label="Mensagem padrão" v-if="recusarChamadas">
        <Textarea v-model="mensagemPadraoParaChamadas" fluid :disabled="carregando" />
      </Label>
      <CheckboxComLabel
        v-model="ignorarGrupos"
        binary
        label="Ignorar grupos"
        id="ignorar-grupos"
        :disabled="carregando"
      />
      <CheckboxComLabel
        v-model="sempreOnline"
        binary
        label="Sempre online"
        id="sempre-online"
        :disabled="carregando"
      />
      <CheckboxComLabel
        v-model="lerMensagens"
        binary
        label="Ler mensagens"
        id="ler-mensagens"
        :disabled="carregando"
      />
      <CheckboxComLabel
        v-model="sincronizarConversas"
        binary
        label="Sincronizar conversas"
        id="sincronizar-conversas"
        :disabled="carregando"
      />
      <CheckboxComLabel
        v-model="lerStatus"
        binary
        label="Ler Status"
        id="ler-status"
        :disabled="carregando"
      />
    </div>
    <template #footer>
      <Button label="Salvar" :loading="carregando" @click="tentaSalvarConfiguracao" />
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
  import CheckboxComLabel from '@/components/inputs/checkbox-com-label.vue';
  import Label from '@/components/label.vue';
  import { whatsAppInstanciaConfiguracaoFormularioSchema } from '@/components/telas/tela-whatsapp/schema/whatsapp-instancia-configuracao-formulario-schema';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import atualizarConfiguracaoDaWhatsAppInstancia from '@/data/whatsapp/atualizar-configuracao-da-whatsapp-instancia';
  import obterConfiguracaoDaWhatsAppInstancia from '@/data/whatsapp/obter-configuracao-da-whatsapp-instancia';
  import { WhatsAppInstancia } from '@/types/modelos/whatsapp-instancia';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { toTypedSchema } from '@vee-validate/zod';
  import { Button, Dialog, Textarea } from 'primevue';
  import { useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';

  const instancia = defineModel<WhatsAppInstancia | undefined>('instancia', {
    required: true,
  });

  const visivel = computed({
    get() {
      return !!instancia.value;
    },
    set() {
      instancia.value = undefined;
    },
  });

  const carregando = ref(false);

  const { empresaId } = defineProps<{
    empresaId: number;
  }>();

  const { defineField, resetForm, handleSubmit } = useForm({
    validationSchema: toTypedSchema(whatsAppInstanciaConfiguracaoFormularioSchema),
  });

  const api = useApi();

  const { erro, sucesso } = useNotification();

  const [ignorarGrupos] = defineField('ignorarGrupos');
  const [lerMensagens] = defineField('lerMensagens');
  const [lerStatus] = defineField('lerStatus');
  const [mensagemPadraoParaChamadas] = defineField('mensagemPadraoParaChamadas');
  const [recusarChamadas] = defineField('recusarChamadas');
  const [sempreOnline] = defineField('sempreOnline');
  const [sincronizarConversas] = defineField('sincronizarConversas');

  const tentaObterConfiguracao = async () => {
    try {
      if (!instancia.value) {
        resetForm({
          values: {
            ignorarGrupos: false,
            lerMensagens: false,
            lerStatus: false,
            mensagemPadraoParaChamadas: '',
            recusarChamadas: false,
            sempreOnline: false,
            sincronizarConversas: false,
          },
        });
        return;
      }

      carregando.value = true;

      const { dados } = await obterConfiguracaoDaWhatsAppInstancia(
        api,
        empresaId,
        instancia.value.name
      );

      resetForm({
        values: {
          ignorarGrupos: dados.groupsIgnore,
          lerMensagens: dados.readMessages,
          lerStatus: dados.readStatus,
          mensagemPadraoParaChamadas: dados.msgCall,
          recusarChamadas: dados.rejectCall,
          sempreOnline: dados.alwaysOnline,
          sincronizarConversas: dados.syncFullHistory,
        },
      });
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível obter as configurações');
      visivel.value = false;
    } finally {
      carregando.value = false;
    }
  };

  const tentaSalvarConfiguracao = handleSubmit(async (dados) => {
    try {
      if (!instancia.value) {
        return;
      }

      carregando.value = true;

      await atualizarConfiguracaoDaWhatsAppInstancia(api, empresaId, instancia.value.name, dados);

      visivel.value = false;
      sucesso('Configuração salva com sucesso');
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível salvar a configuração');
    } finally {
      carregando.value = false;
    }
  });

  watch(instancia, tentaObterConfiguracao, {
    immediate: true,
  });
</script>
