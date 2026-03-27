<template>
  <Dialog
    v-model:visible="visivel"
    :header="modo === 'criar' ? 'Cadastrar usuário' : 'Editar usuário'"
    class="w-155"
    modal
  >
    <form class="flex flex-col gap-4 mt-2" @submit.prevent>
      <Label label="Nome" :feedback="nomeError">
        <InputText id="nome" v-model="nomeValue" fluid :invalid="!!nomeError" />
      </Label>

      <Label label="E-mail" :feedback="emailError">
        <InputText id="email" v-model="emailValue" fluid type="email" :invalid="!!emailError" />
      </Label>

      <Label label="CNPJ/CPF" :feedback="cnpjCpfError">
        <InputText
          id="cnpjCpf"
          v-model="cnpjCpfValue"
          fluid
          :invalid="!!cnpjCpfError"
          v-maska="cnpjCpfMascara"
        />
      </Label>

      <Label label="Cargo" :feedback="cargoError" v-if="ehAdmin">
        <Select
          id="cargo"
          v-model="cargoValue"
          :options="opcoesCargo"
          option-label="label"
          option-value="value"
          fluid
        />
      </Label>

      <Label :label="modo === 'criar' ? 'Senha' : 'Nova senha (opcional)'" :feedback="senhaError">
        <Password
          id="senha"
          v-model="senhaValue"
          :feedback="false"
          toggle-mask
          fluid
          autocomplete="new-password"
          :invalid="!!senhaError"
        />
      </Label>
    </form>

    <template #footer>
      <div class="w-full flex justify-between">
        <Button label="Empresas" severity="secondary" @click="selecaoEmpresasVisivel = true" />
        <div class="flex gap-2">
          <Button label="Cancelar" severity="secondary" @click="visivel = false" />
          <Button
            :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
            :loading="carregando"
            @click="emit('salvar')"
          />
        </div>
      </div>
    </template>
  </Dialog>

  <TelaUsuariosSelecaoEmpresa
    v-model:visivel="selecaoEmpresasVisivel"
    v-model:empresas-selecionadas="empresas"
    :api
    @abrir:acessos="
      (idEmpresa) => {
        selecaoSistemas.empresaId = idEmpresa;
        selecaoSistemas.visivel = true;
      }
    "
  />

  <TelaUsuariosSelecaoSistema
    v-model:visivel="selecaoSistemas.visivel"
    :empresa-id="selecaoSistemas.empresaId"
    :api
  />
</template>
<script lang="ts" setup>
  import Label from '@/components/label.vue';
  import TelaUsuariosSelecaoEmpresa from '@/components/telas/tela-usuarios/components/tela-usuarios-selecao-empresa.vue';
  import TelaUsuariosSelecaoSistema from '@/components/telas/tela-usuarios/components/tela-usuarios-selecao-sistema.vue';
  import { UsuarioEmpresa } from '@/components/telas/tela-usuarios/schemas/usuario-empresa-schema';
  import { Usuario, UsuarioCargo } from '@/types/modelos/usuario';
  import { AxiosInstance } from 'axios';
  import { Button, Dialog, FloatLabel, InputText, Password, Select } from 'primevue';
  import { useField } from 'vee-validate';
  import { reactive, ref, watch } from 'vue';
  import { vMaska } from 'maska/vue';

  const visivel = defineModel<boolean>('visivel', {
    required: true,
  });

  const modo = defineModel<'criar' | 'editar'>('modo', {
    required: true,
  });

  defineProps<{
    usuarioId?: number;
    carregando?: boolean;
    api: AxiosInstance;
    ehAdmin?: boolean;
  }>();

  const { value: nomeValue, errorMessage: nomeError } = useField<string>('nome');

  const { value: emailValue, errorMessage: emailError } = useField<string>('email');

  const { value: cnpjCpfValue, errorMessage: cnpjCpfError } = useField<string>('cnpjCpf');

  const { value: cargoValue, errorMessage: cargoError } = useField<UsuarioCargo>('cargo');

  const { value: senhaValue, errorMessage: senhaError } = useField<string>('senha');

  const { value: empresas } = useField<UsuarioEmpresa[]>('empresas');

  const opcoesCargo = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Normal', value: 'NORMAL' },
  ];

  const emit = defineEmits(['salvar']);

  const selecaoEmpresasVisivel = ref(false);

  const selecaoSistemas = reactive({
    empresaId: undefined as undefined | number,
    visivel: false,
  });

  watch(visivel, () => {
    if (!visivel) {
      selecaoEmpresasVisivel.value = false;
    }
  });

  const cnpjCpfMascara = {
    mask: ['###.###.###-##', '##.###.###/####-##'],
  };
</script>
