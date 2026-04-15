<template>
  <TelaConfiguracaoContaCabecalho />

  <main class="px-4 mt-5 pb-10 flex justify-center">
    <section
      class="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-4 md:p-6 space-y-6"
    >
      <div class="space-y-1">
        <h2 class="text-lg font-semibold text-gray-800">Dados básicos</h2>
        <p class="text-sm text-gray-500">Atualize seu e-mail e confirme com a senha atual.</p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="tentaSalvarEmail">
        <Label label="E-mail" :feedback="emailError">
          <InputText id="email" v-model="emailValue" type="email" fluid :invalid="!!emailError" />
        </Label>

        <Label label="Senha atual" :feedback="senhaAtualEmailError">
          <Password
            id="senha-atual"
            v-model="senhaAtualEmail"
            fluid
            toggle-mask
            :feedback="false"
            autocomplete="current-password"
            :invalid="!!senhaAtualEmailError"
          />
        </Label>

        <div class="pt-1 flex justify-end">
          <Button type="submit" label="Salvar e-mail" icon="pi pi-save" :loading="salvandoEmail" />
        </div>
      </form>

      <div class="border-t border-gray-200 pt-6 space-y-3">
        <h3 class="text-base font-semibold text-gray-800">Segurança</h3>
        <p class="text-sm text-gray-500">
          Para alterar a senha, abra o modal de troca e preencha os dados solicitados.
        </p>
        <Button
          label="Trocar senha"
          icon="pi pi-lock"
          severity="secondary"
          @click="modalTrocarSenhaVisivel = true"
        />
      </div>
    </section>
  </main>

  <Dialog
    v-model:visible="modalTrocarSenhaVisivel"
    header="Trocar senha"
    class="w-full max-w-xl"
    modal
  >
    <form class="flex flex-col gap-4 mt-2" @submit.prevent="tentaTrocarSenha">
      <Label label="Senha atual" :feedback="senhaAtualSenhaError">
        <Password
          id="senha-atual-modal"
          v-model="senhaAtualSenha"
          fluid
          toggle-mask
          :feedback="false"
          autocomplete="current-password"
          :invalid="!!senhaAtualSenhaError"
        />
      </Label>

      <Label label="Nova senha" :feedback="senhaNovaError">
        <Password
          id="senha-nova-modal"
          v-model="senhaNova"
          fluid
          toggle-mask
          :feedback="false"
          autocomplete="new-password"
          :invalid="!!senhaNovaError"
        />
      </Label>

      <Label label="Confirmar nova senha" :feedback="confirmacaoSenhaNovaError">
        <Password
          id="confirmacao-senha-nova-modal"
          v-model="confirmacaoSenhaNova"
          fluid
          toggle-mask
          :feedback="false"
          autocomplete="new-password"
          :invalid="!!confirmacaoSenhaNovaError"
        />
      </Label>

      <div class="pt-1 flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="fecharModalTrocarSenha"
        />
        <Button type="submit" label="Atualizar senha" :loading="salvandoSenha" />
      </div>
    </form>
  </Dialog>

  <Toast />
</template>

<script lang="ts" setup>
  import { isAxiosError } from 'axios';
  import { Button, Dialog, InputText, Password, Toast } from 'primevue';
  import { onMounted, ref } from 'vue';
  import Label from '@/components/label.vue';
  import TelaConfiguracaoContaCabecalho from '@/components/telas/tela-configuracao-conta/components/tela-configuracao-conta-cabecalho.vue';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import atualizarDadosBasicosDaConta from '@/data/usuario/atualizar-dados-basicos-da-conta';
  import obterUsuarioAutorizado from '@/data/usuario/obter-usuario-autorizado';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';

  const props = defineProps<{
    bearerToken?: string;
    ehAdmin?: boolean;
    email?: string;
  }>();

  const emit = defineEmits<{
    (e: 'relogin-requerido'): void;
  }>();

  const api = useApi(props.bearerToken);

  const { sucesso, erro, aviso } = useNotification();

  const emailAtual = ref(props.email || '');
  const emailValue = ref(props.email || '');
  const senhaAtualEmail = ref('');
  const senhaAtualSenha = ref('');
  const senhaNova = ref('');
  const confirmacaoSenhaNova = ref('');

  const emailError = ref('');
  const senhaAtualEmailError = ref('');
  const senhaAtualSenhaError = ref('');
  const senhaNovaError = ref('');
  const confirmacaoSenhaNovaError = ref('');

  const modalTrocarSenhaVisivel = ref(false);

  const salvandoEmail = ref(false);
  const salvandoSenha = ref(false);

  const tentaPreencherEmailAutorizado = async () => {
    try {
      const resposta = await obterUsuarioAutorizado(api);
      const emailAutorizado = resposta.autorizado?.email?.trim();

      if (emailAutorizado) {
        emailAtual.value = emailAutorizado;
        emailValue.value = emailAutorizado;
      }
    } catch {
      // Falha silenciosa: a tela continua funcional sem o preenchimento automático.
    }
  };

  const emailEhValido = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const limparErrosEmail = () => {
    emailError.value = '';
    senhaAtualEmailError.value = '';
  };

  const limparErrosSenha = () => {
    senhaAtualSenhaError.value = '';
    senhaNovaError.value = '';
    confirmacaoSenhaNovaError.value = '';
  };

  const tentarEmitirRelogin = () => {
    aviso('Por segurança, faça login novamente para continuar.');
    emit('relogin-requerido');
  };

  const tentaSalvarEmail = async () => {
    limparErrosEmail();

    const email = emailValue.value.trim();

    if (!email) {
      emailError.value = 'Campo obrigatório';
      return;
    }

    if (!emailEhValido(email)) {
      emailError.value = 'Campo inválido';
      return;
    }

    if (!senhaAtualEmail.value.trim()) {
      senhaAtualEmailError.value = 'Campo obrigatório';
      return;
    }

    if (email === emailAtual.value) {
      erro('O e-mail informado é igual ao e-mail atual.');
      return;
    }

    try {
      salvandoEmail.value = true;

      const resposta = await atualizarDadosBasicosDaConta(api, {
        senhaAtual: senhaAtualEmail.value,
        email,
      });

      if (resposta.dados?.email) {
        emailAtual.value = resposta.dados.email;
        emailValue.value = resposta.dados.email;
      }

      senhaAtualEmail.value = '';
      sucesso('E-mail atualizado com sucesso');
      tentarEmitirRelogin();
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          erro('Senha atual incorreta ou sessão inválida. Faça login novamente e tente de novo.');
          return;
        }

        if (status === 409) {
          erro('Este e-mail já está em uso por outro usuário.');
          return;
        }
      }

      erro(obterErroDaRequisicao(err) || 'Não foi possível atualizar o e-mail da conta');
    } finally {
      salvandoEmail.value = false;
    }
  };

  const fecharModalTrocarSenha = () => {
    modalTrocarSenhaVisivel.value = false;
    senhaAtualSenha.value = '';
    senhaNova.value = '';
    confirmacaoSenhaNova.value = '';
    limparErrosSenha();
  };

  const tentaTrocarSenha = async () => {
    limparErrosSenha();

    if (!senhaAtualSenha.value.trim()) {
      senhaAtualSenhaError.value = 'Campo obrigatório';
      return;
    }

    if (!senhaNova.value.trim()) {
      senhaNovaError.value = 'Campo obrigatório';
      return;
    }

    if (senhaNova.value.trim().length < 5) {
      senhaNovaError.value = 'A nova senha deve conter no mínimo 5 caracteres';
      return;
    }

    if (!confirmacaoSenhaNova.value.trim()) {
      confirmacaoSenhaNovaError.value = 'Campo obrigatório';
      return;
    }

    if (senhaNova.value !== confirmacaoSenhaNova.value) {
      confirmacaoSenhaNovaError.value = 'As senhas não conferem';
      return;
    }

    try {
      salvandoSenha.value = true;

      await atualizarDadosBasicosDaConta(api, {
        senhaAtual: senhaAtualSenha.value,
        senhaNova: senhaNova.value,
      });

      sucesso('Senha atualizada com sucesso');
      fecharModalTrocarSenha();
      tentarEmitirRelogin();
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          erro('Senha atual incorreta ou sessão inválida. Faça login novamente e tente de novo.');
          return;
        }
      }

      erro(obterErroDaRequisicao(err) || 'Não foi possível atualizar a senha');
    } finally {
      salvandoSenha.value = false;
    }
  };

  onMounted(() => {
    tentaPreencherEmailAutorizado();
  });
</script>
