<template>
  <Dialog
    v-model:visible="visivel"
    modal
    :closable="!carregando"
    :dismissable-mask="!carregando"
    header="Recuperar senha"
    class="w-full max-w-md"
  >
    <div class="space-y-3">
      <p class="text-sm text-slate-600">
        Informe o e-mail para enviarmos o link de recuperação de senha.
      </p>
      <div>
        <label for="email-recuperacao" class="text-sm text-slate-700">E-mail</label>
        <InputText
          id="email-recuperacao"
          v-bind="emailAttrs"
          v-model="email"
          type="email"
          fluid
          inputmode="email"
          autocomplete="email"
          autocapitalize="off"
          :disabled="carregando"
          :invalid="!!errors.email"
          class="mt-1"
        />
        <span v-if="errors.email" class="text-sm text-red-500 block mt-1">
          {{ errors.email }}
        </span>
      </div>
      <div class="flex justify-end gap-2 pt-1">
        <Button
          label="Cancelar"
          severity="secondary"
          text
          type="button"
          :disabled="carregando"
          @click="visivel = false"
        />
        <Button
          label="Enviar link"
          type="button"
          :loading="carregando"
          @click="tentaEnviarRecuperacaoSenha"
        />
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
  import useNotification from '@/composables/use-notification';
  import solicitarRecuperacaoSenha from '@/data/login/solicitar-recuperacao-de-senha';
  import { CAMPO_INVALIDO, CAMPO_OBRIGATORIO } from '@/utils/constantes/feedback';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { toTypedSchema } from '@vee-validate/zod';
  import { AxiosInstance } from 'axios';
  import { Button, Dialog, InputText } from 'primevue';
  import { useForm } from 'vee-validate';
  import { ref, watch } from 'vue';
  import z from 'zod';

  const visivel = defineModel<boolean>('visivel', {
    required: true,
  });

  const { api } = defineProps<{
    api: AxiosInstance;
  }>();

  const carregando = ref(false);

  const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: toTypedSchema(
      z.object({
        email: z
          .string({
            required_error: CAMPO_OBRIGATORIO,
            invalid_type_error: CAMPO_INVALIDO,
          })
          .email({ message: CAMPO_INVALIDO }),
      })
    ),
  });

  const [email, emailAttrs] = defineField('email');

  const { sucesso, erro } = useNotification();

  const tentaEnviarRecuperacaoSenha = handleSubmit(async ({ email }) => {
    try {
      carregando.value = true;

      await solicitarRecuperacaoSenha(api, email);

      visivel.value = false;

      sucesso('E-mail de recuperação de senha foi enviado');
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível enviar o e-mail');
    } finally {
      carregando.value = false;
    }
  });

  watch(visivel, () => resetForm());
</script>
