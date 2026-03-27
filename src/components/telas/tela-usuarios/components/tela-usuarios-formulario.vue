<template>
  <Dialog
    v-model:visible="visivel"
    :header="modo === 'criar' ? 'Cadastrar usuário' : 'Editar usuário'"
    class="w-155"
    modal
  >
    <form class="flex flex-col gap-4 mt-2" @submit.prevent>
      <FloatLabel variant="on">
        <InputText id="nome" v-model="formulario.nome" fluid />
        <label for="nome">Nome</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputText id="email" v-model="formulario.email" fluid type="email" />
        <label for="email">E-mail</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputText id="cnpjCpf" v-model="formulario.cnpjCpf" fluid />
        <label for="cnpjCpf">CNPJ/CPF</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Select
          id="cargo"
          v-model="formulario.cargo"
          :options="opcoesCargo"
          option-label="label"
          option-value="value"
          fluid
        />
        <label for="cargo">Cargo</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Password
          id="senha"
          v-model="formulario.senha"
          :feedback="false"
          toggle-mask
          fluid
          autocomplete="new-password"
        />
        <label for="senha">{{ modo === 'criar' ? 'Senha' : 'Nova senha (opcional)' }}</label>
      </FloatLabel>
    </form>

    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="visivel = false" />
        <Button
          :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
          :loading="carregando"
          @click="emit('salvar')"
        />
      </div>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
  import { UsuarioCargo } from '@/types/modelos/usuario';
  import { Button, Dialog, FloatLabel, InputText, Password, Select } from 'primevue';

  const visivel = defineModel<boolean>('visivel', {
    required: true,
  });

  const modo = defineModel<'criar' | 'editar'>('modo', {
    required: true,
  });

  defineProps<{
    usuarioId?: number;
    carregando?: boolean;
  }>();

  const formulario = defineModel<{
    nome: string;
    email: string;
    cnpjCpf: string;
    cargo: UsuarioCargo;
    senha?: string;
  }>('formulario', {
    required: true,
    default: () => ({
      nome: '',
      email: '',
      cnpjCpf: '',
      cargo: 'NORMAL',
      senha: undefined,
    }),
  });

  const opcoesCargo = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Normal', value: 'NORMAL' },
  ];

  const emit = defineEmits(['salvar']);
</script>
