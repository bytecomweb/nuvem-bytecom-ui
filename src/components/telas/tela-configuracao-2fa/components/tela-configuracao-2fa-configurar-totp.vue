<template>
  <Dialog
    v-model:visible="visivel"
    modal
    header="Configurar pelo aplicativo"
    :style="{ width: 'min(680px, 92vw)' }"
  >
    <div class="space-y-4 flex flex-col justify-center items-center">
      <p class="text-sm text-gray-600 w-full">
        {{
          metodoTotpAtivo
            ? 'Já está ativo. Se quiser, gere um novo QR Code para configurar novamente no aplicativo.'
            : 'Abra o aplicativo autenticador, escaneie o QR Code e digite o código para ativar.'
        }}
      </p>

      <div class="flex flex-wrap gap-2 w-full">
        <Button
          :label="segredoTotp ? 'Gerar novo QR Code' : 'Gerar QR Code'"
          severity="secondary"
          :loading="carregandoConfiguracaoTotp"
          @click="emit('configurar', !!segredoTotp)"
        />
        <Button
          v-if="metodoTotpAtivo"
          label="Desativar verificação por aplicativo"
          severity="danger"
          outlined
          :loading="!!metodos.find((item) => item.metodo === 'TOTP')?.salvando"
          @click="emit('desativar')"
        />
      </div>

      <div v-if="qrCodeTotp" class="bg-gray-50 border rounded p-3 inline-block fld">
        <p class="text-xs text-gray-600 mb-2">Escaneie com seu aplicativo:</p>
        <img :src="qrCodeTotp" alt="QR Code TOTP" class="w-[220px] h-[220px]" />
      </div>

      <template v-if="otpauthUrl && !metodoTotpAtivo">
        <div class="space-y-2 pt-1">
          <label class="text-sm text-gray-700">Código do aplicativo</label>
          <InputOtp v-model="codigoAtivacaoTotp" :length="6" integerOnly class="otp-totp-config" />
        </div>
        <div class="w-full">
          <Button label="Ativar com este código" :loading="ativandoTotp" @click="emit('ativar')" />
        </div>
      </template>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
  import { MetodoTela } from '@/components/telas/tela-configuracao-2fa/types/metodo-tela';
  import { Button, Dialog, InputOtp } from 'primevue';

  defineProps<{
    metodos: MetodoTela[];
  }>();

  const visivel = defineModel<boolean>('visivel', {
    required: true,
  });

  const metodoTotpAtivo = defineModel<boolean>('metodoTotpAtivo', {
    required: true,
  });
  const segredoTotp = defineModel<string | null>('segredoTotp', {
    required: true,
  });
  const otpauthUrl = defineModel<string | null>('otpauthUrl', {
    required: true,
  });
  const codigoAtivacaoTotp = defineModel<string>('codigoAtivacaoTotp', {
    required: true,
  });
  const carregandoConfiguracaoTotp = defineModel<boolean>('carregandoConfiguracaoTotp', {
    required: true,
  });
  const ativandoTotp = defineModel<boolean>('ativandoTotp', {
    required: true,
  });
  const qrCodeTotp = defineModel<string | null>('qrCodeTotp', {
    required: true,
  });

  const emit = defineEmits<{
    configurar: [regenerar: boolean];
    desativar: [];
    ativar: [];
  }>();
</script>
