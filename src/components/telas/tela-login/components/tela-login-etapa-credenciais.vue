<template>
  <div v-if="etapaLogin === 'CREDENCIAIS'">
    <label for="email" class="text-sm text-slate-700">E-mail</label>
    <InputText
      id="email"
      v-model="email"
      v-bind="emailAttrs"
      type="email"
      inputmode="email"
      autocomplete="email"
      autocapitalize="off"
      fluid
      :invalid="!!emailError"
      :disabled="carregando"
      class="mt-1"
    />
    <span v-if="emailError" class="text-sm text-red-500 block mt-1">
      {{ emailError }}
    </span>
  </div>

  <div v-if="etapaLogin === 'CREDENCIAIS'">
    <label for="password" class="text-sm text-slate-700">Senha</label>
    <Password
      id="password"
      v-model="senha"
      v-bind="senhaAttrs"
      toggle-mask
      fluid
      autocomplete="current-password"
      :invalid="!!senhaError"
      :disabled="carregando"
      :feedback="false"
      class="mt-1"
    />
    <span v-if="senhaError" class="text-sm text-red-500 block mt-1">
      {{ senhaError }}
    </span>
  </div>
</template>
<script lang="ts" setup>
  import { TelaLoginEtapas } from '@/components/telas/tela-login/types/tela-login-etapas';
  import { VeeValidateAttrs } from '@/types/vee-validate-attrs';
  import { InputText, Password } from 'primevue';

  const email = defineModel<string | undefined>('email', {
    required: true,
  });

  const senha = defineModel<string | undefined>('senha', {
    required: true,
  });

  defineProps<{
    emailAttrs: VeeValidateAttrs;
    senhaAttrs: VeeValidateAttrs;
    senhaError?: string;
    emailError?: string;
    carregando?: boolean;
    etapaLogin: TelaLoginEtapas;
  }>();
</script>
