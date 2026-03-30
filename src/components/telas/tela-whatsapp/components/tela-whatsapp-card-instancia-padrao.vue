<template>
  <div class="bg-white p-2 rounded-lg flex justify-between gap-3 border-2 border-orange-200 shadow">
    <div class="flex flex-col justify-between gap-3">
      <div class="flex items-center gap-2">
        <i class="pi pi-star-fill text-orange-400" />
        <p class="font-semibold">Instância Padrão</p>
      </div>
      <p class="text-sm text-zinc-600 break-all">
        {{ instancia.titulo || instancia.name }}
      </p>
      <div class="flex flex-wrap gap-2">
        <Tag :value="textoStatus[statusConexao]" :severity="grauStatus[statusConexao]" />
        <Tag
          :value="bloquearUsoInstanciaPadrao ? 'Uso bloqueado' : 'Uso liberado'"
          :severity="bloquearUsoInstanciaPadrao ? 'danger' : 'success'"
        />
        <Tag
          :value="monitoramento.ativo ? 'Monitoramento ativo' : 'Monitoramento parado'"
          :severity="monitoramento.ativo ? 'success' : 'secondary'"
        />
      </div>
    </div>
    <div class="flex flex-col justify-between items-end gap-2">
      <Button label="Atualizar" size="small" variant="text" @click="emit('atualizar')" />
      <Button
        :label="monitoramento.ativo ? 'Parar monitoramento' : 'Iniciar monitoramento'"
        size="small"
        variant="text"
        :disabled="bloquearUsoInstanciaPadrao"
        @click="monitoramento.ativo ? emit('parar-monitoramento') : emit('iniciar-monitoramento')"
      />
      <Button
        label="Conectar"
        size="small"
        v-if="statusConexao !== 'open'"
        :disabled="bloquearUsoInstanciaPadrao"
        @click="emit('conectar')"
      />
      <Button
        label="Desconectar"
        size="small"
        severity="danger"
        v-else
        :disabled="bloquearUsoInstanciaPadrao"
        @click="emit('desconectar')"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { WhatsAppInstancia } from '@/types/modelos/whatsapp-instancia';
  import { WhatsAppInstanciaStatus } from '@/types/modelos/whatsapp-instancia-status';
  import { Button, Tag, type TagProps } from 'primevue';
  import { computed } from 'vue';

  const props = defineProps<{
    instancia: WhatsAppInstancia;
    conexao: {
      state: WhatsAppInstanciaStatus;
    };
    monitoramento: {
      ativo: boolean;
      ultimoStatus: WhatsAppInstanciaStatus | null;
    };
    bloqueado: boolean;
  }>();

  const emit = defineEmits([
    'conectar',
    'desconectar',
    'atualizar',
    'iniciar-monitoramento',
    'parar-monitoramento',
  ]);

  const bloquearUsoInstanciaPadrao = computed(() => props.bloqueado);

  const statusConexao = computed<WhatsAppInstanciaStatus>(() => props.conexao.state || 'close');

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
