<template>
  <Dialog v-model:visible="visivel" header="Cadastrar instância" modal class="min-w-75!">
    <div class="mt-2">
      <Label label="Número" :feedback="errors.numero">
        <InputMask
          v-bind="numeroAttrs"
          v-model="numero"
          :mask="[
            '(##) ####-####',
            '(##) # ####-####',
            '+## (##) ####-####',
            '+## (##) # ####-####',
          ]"
          :invalid="!!errors.numero"
        />
      </Label>
    </div>
    <template #footer>
      <Button label="Cadastrar" :loading="carregando" @click="tentaFazerSubmit" />
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
  import InputMask from '@/components/inputs/input-mask.vue';
  import Label from '@/components/label.vue';
  import { whatsAppInstanciaFormularioSchema } from '@/components/telas/tela-whatsapp/schema/whatsapp-instancia-formulario-schema';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import criarWhatsAppInstancia from '@/data/whatsapp/criar-whatsapp-instancia';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import apenasNumeros from '@/utils/texto/apenas-numeros';
  import { toTypedSchema } from '@vee-validate/zod';
  import { Button, Dialog } from 'primevue';
  import { useForm } from 'vee-validate';
  import { ref, watch } from 'vue';

  const visivel = defineModel<boolean>('visivel', {
    required: true,
  });

  const { empresaId } = defineProps<{
    empresaId: number;
  }>();

  const emit = defineEmits(['atualizar-instancias']);

  const { erro, sucesso } = useNotification();

  const { defineField, handleSubmit, errors, resetForm } = useForm({
    validationSchema: toTypedSchema(whatsAppInstanciaFormularioSchema),
  });

  const [numero, numeroAttrs] = defineField('numero');

  const carregando = ref(false);

  const api = useApi();

  const tentaCadastrar = async (numero: string) => {
    try {
      carregando.value = true;
      await criarWhatsAppInstancia(api, empresaId, numero);

      emit('atualizar-instancias');
      sucesso('Instância cadastrada com sucesso');

      visivel.value = false;
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível cadastrar');
    } finally {
      carregando.value = false;
    }
  };

  const tentaFazerSubmit = handleSubmit(async ({ numero }) => {
    tentaCadastrar(apenasNumeros(numero));
  });

  watch(visivel, () => {
    resetForm();
  });
</script>
