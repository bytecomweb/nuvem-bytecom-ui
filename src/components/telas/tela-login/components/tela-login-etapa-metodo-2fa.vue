<template>
  <div
    v-if="etapaLogin === 'METODO_2FA'"
    class="rounded-xl border border-slate-200 bg-slate-50 p-4"
  >
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="text-sm font-semibold text-slate-800">Verificação em duas etapas</h3>
        <p class="text-xs text-slate-500 mt-1">
          Selecione o canal e vamos solicitar o desafio automaticamente
        </p>
      </div>
      <i class="pi pi-shield text-slate-500" />
    </div>

    <div class="mt-4">
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="metodo in metodosDoisFatoresDisponiveis"
          :key="metodo"
          type="button"
          class="rounded-xl border border-slate-300 bg-white p-3 text-center transition-colors hover:border-slate-500"
          :disabled="carregando"
          @click="emit('selecionar-e-continuar', metodo)"
        >
          <i :class="`${obterIconeMetodoDoisFatores(metodo)} text-xl text-slate-700`" />
          <p class="text-[11px] text-slate-600 mt-2">
            {{ obterLabelCurtoMetodoDoisFatores(metodo) }}
          </p>
        </button>
      </div>
    </div>

    <p v-if="carregando" class="text-xs text-slate-500 mt-3">Solicitando desafio...</p>

    <span v-if="codigoDoisFatoresFeedback" class="text-sm text-red-500 block mt-3">
      {{ codigoDoisFatoresFeedback }}
    </span>
  </div>
</template>
<script lang="ts" setup>
  import { TelaLoginEtapas } from '@/components/telas/tela-login/types/tela-login-etapas';
  import { TelaLoginMetodosDoisFatores } from '@/components/telas/tela-login/types/tela-login-metodos-dois-fatores';

  const emit = defineEmits<{
    'selecionar-e-continuar': [metodo: TelaLoginMetodosDoisFatores];
  }>();

  defineProps<{
    etapaLogin: TelaLoginEtapas;
    metodosDoisFatoresDisponiveis: TelaLoginMetodosDoisFatores[];
    carregando?: boolean;
    codigoDoisFatoresFeedback?: string;
  }>();

  const obterIconeMetodoDoisFatores = (metodo: TelaLoginMetodosDoisFatores) => {
    if (metodo === 'TOTP') {
      return 'pi pi-shield';
    }

    if (metodo === 'EMAIL') {
      return 'pi pi-envelope';
    }

    if (metodo === 'WHATSAPP') {
      return 'pi pi-whatsapp';
    }

    return 'pi pi-question-circle';
  };

  const obterLabelCurtoMetodoDoisFatores = (metodo: TelaLoginMetodosDoisFatores) => {
    if (metodo === 'TOTP') {
      return 'Autenticador';
    }

    if (metodo === 'EMAIL') {
      return 'E-mail';
    }

    if (metodo === 'WHATSAPP') {
      return 'WhatsApp';
    }

    return '-';
  };
</script>
