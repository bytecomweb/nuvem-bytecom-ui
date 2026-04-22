<template>
  <div
    v-if="etapaLogin === 'CODIGO_2FA'"
    class="rounded-xl border border-slate-200 bg-slate-50 p-4"
  >
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="text-sm font-semibold text-slate-800">Digite o código 2FA</h3>
        <p class="text-xs text-slate-500 mt-1">
          Método:
          {{
            metodoDoisFatoresSelecionado
              ? obterLabelMetodoDoisFatores(metodoDoisFatoresSelecionado)
              : '-'
          }}
        </p>
      </div>
      <i class="pi pi-shield text-slate-500" />
    </div>

    <div class="mt-4">
      <label class="text-sm text-slate-700">Código 2FA</label>
      <InputOtp
        v-model="codigoDoisFatoresValor"
        :length="6"
        integer-only
        class="mt-2 otp-login justify-center"
      />
      <div class="flex items-center gap-2 mt-3">
        <Checkbox v-model="confiarDispositivo" input-id="confiar-dispositivo" :binary="true" />
        <label for="confiar-dispositivo" class="text-xs text-slate-600 cursor-pointer">
          Não pedir código neste dispositivo por 30 dias
        </label>
      </div>
      <p v-if="desafioDoisFatoresExpiraEm" class="text-xs text-slate-500 mt-2">
        Desafio ativo até
        {{ new Date(desafioDoisFatoresExpiraEm).toLocaleTimeString() }}
      </p>
      <span v-if="codigoDoisFatoresFeedback" class="text-sm text-red-500 block mt-2">
        {{ codigoDoisFatoresFeedback }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { TelaLoginEtapas } from '@/components/telas/tela-login/types/tela-login-etapas';
  import { TelaLoginMetodosDoisFatores } from '@/components/telas/tela-login/types/tela-login-metodos-dois-fatores';
  import { Checkbox, InputOtp } from 'primevue';

  defineProps<{
    etapaLogin: TelaLoginEtapas;
    metodoDoisFatoresSelecionado: TelaLoginMetodosDoisFatores | null;
    codigoDoisFatoresFeedback?: string;
    desafioDoisFatoresExpiraEm?: string;
  }>();

  const codigoDoisFatoresValor = defineModel<string>('codigoDoisFatoresValor', {
    required: true,
  });

  const confiarDispositivo = defineModel<boolean>('confiarDispositivo', {
    required: true,
  });

  const obterLabelMetodoDoisFatores = (metodo: TelaLoginMetodosDoisFatores) => {
    if (metodo === 'TOTP') {
      return 'Aplicativo autenticador (TOTP)';
    }

    if (metodo === 'EMAIL') {
      return 'Código por e-mail';
    }

    if (metodo === 'WHATSAPP') {
      return 'Código por WhatsApp';
    }

    return '-';
  };
</script>
