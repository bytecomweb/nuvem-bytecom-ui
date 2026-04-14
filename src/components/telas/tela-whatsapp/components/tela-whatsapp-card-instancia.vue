<template>
  <div
    class="bg-white p-2 rounded-lg flex justify-between gap-3 shadow"
    :class="instancia.ehInstanciaPadrao ? 'border-2 border-orange-200' : 'border border-gray-200'"
  >
    <div class="flex flex-col justify-between gap-4">
      <div v-if="instancia.ehInstanciaPadrao" class="flex items-center gap-2">
        <i class="pi pi-star-fill text-orange-400" />
        <p class="font-semibold">Instância padrão</p>
      </div>

      <p v-if="!instancia.ehInstanciaPadrao">
        {{
          formatarTexto({
            texto: removerSimbolos(instancia.name),
            mascara: [
              '(00) 0000-0000',
              '(00) 0 0000-0000',
              '+00 (00) 0000-0000',
              '+00 (00) 0 0000-0000',
            ],
          })
        }}
      </p>

      <div class="flex flex-wrap gap-2">
        <Tag
          :value="textoStatus[instancia.connectionStatus]"
          :severity="grauStatus[instancia.connectionStatus]"
        />
        <Tag
          v-if="instancia.ehInstanciaPadrao && gerenciamentoRestrito"
          value="Gerenciamento restrito"
          severity="warn"
        />
      </div>
    </div>

    <div class="flex flex-col justify-between items-end gap-2">
      <div v-if="!gerenciamentoRestrito">
        <Button
          icon="pi pi-trash"
          size="small"
          variant="text"
          @click="emit('apagar')"
          v-tooltip="'Apagar'"
        />
        <Button
          icon="pi pi-cog"
          variant="text"
          size="small"
          @click="emit('configurar')"
          v-tooltip="'Configurações'"
        />
      </div>

      <Button
        label="Conectar"
        size="small"
        v-if="!gerenciamentoRestrito && instancia.connectionStatus !== 'open'"
        @click="emit('conectar')"
      />
      <Button
        label="Desconectar"
        size="small"
        severity="danger"
        v-else-if="!gerenciamentoRestrito && instancia.connectionStatus === 'open'"
        @click="emit('desconectar')"
      />
      <span
        v-else-if="instancia.ehInstanciaPadrao"
        class="text-xs text-zinc-500 text-right max-w-36"
      >
        Esta instância é exibida apenas para consulta.
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { WhatsAppInstancia } from '@/types/modelos/whatsapp-instancia';
  import { WhatsAppInstanciaStatus } from '@/types/modelos/whatsapp-instancia-status';
  import formatarTexto from '@/utils/texto/formatar-texto';
  import removerSimbolos from '@/utils/texto/remover-simbolos';
  import { Button, Tag, type TagProps } from 'primevue';

  defineProps<{
    instancia: WhatsAppInstancia;
    gerenciamentoRestrito?: boolean;
  }>();

  const emit = defineEmits(['conectar', 'configurar', 'desconectar', 'apagar']);

  const textoStatus: Record<WhatsAppInstanciaStatus, string> = {
    close: 'Desconectado',
    connecting: 'Conectando',
    open: 'Conectado',
  };

  const grauStatus: Record<WhatsAppInstanciaStatus, TagProps['severity']> = {
    close: 'danger',
    connecting: 'warn',
    open: 'success',
  };
</script>
