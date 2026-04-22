<template>
  <main
    class="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-white flex items-center justify-center p-4"
  >
    <div
      class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white"
    >
      <section class="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-10">
        <div>
          <p class="text-xs uppercase tracking-[0.2em]">Nuvem Bytecom</p>
          <p class="text-sm text-slate-300 mt-4">
            Gerencie sistemas, usuários e comunicação com autenticação reforçada.
          </p>
        </div>
        <div class="text-xs text-slate-400">
          <p>Proteção por senha</p>
        </div>
      </section>

      <section class="p-6 md:p-10">
        <div class="max-w-md mx-auto">
          <h2 class="text-2xl font-semibold text-slate-900">Entrar</h2>
          <p class="text-sm text-slate-500 mt-1">
            {{ descricaoEtapaAtual }}
          </p>
          <div class="mt-4 grid grid-cols-3 gap-2">
            <div
              class="h-1.5 rounded-full"
              :class="numeroEtapaAtual >= 1 ? 'bg-slate-900' : 'bg-slate-200'"
            />
            <div
              class="h-1.5 rounded-full"
              :class="numeroEtapaAtual >= 2 ? 'bg-slate-900' : 'bg-slate-200'"
            />
            <div
              class="h-1.5 rounded-full"
              :class="numeroEtapaAtual >= 3 ? 'bg-slate-900' : 'bg-slate-200'"
            />
          </div>

          <form class="mt-7 space-y-5" @submit.prevent="tentaFazerLogin">
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
                :invalid="!!errors.email"
                :disabled="carregando"
                class="mt-1"
              />
              <span v-if="errors.email" class="text-sm text-red-500 block mt-1">
                {{ errors.email }}
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
                :invalid="!!errors.senha"
                :disabled="carregando"
                :feedback="false"
                class="mt-1"
              />
              <span v-if="errors.senha" class="text-sm text-red-500 block mt-1">
                {{ errors.senha }}
              </span>
            </div>

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
                    :disabled="solicitandoDesafioDoisFatores"
                    @click="selecionarMetodoEContinuar(metodo)"
                  >
                    <i :class="`${obterIconeMetodoDoisFatores(metodo)} text-xl text-slate-700`" />
                    <p class="text-[11px] text-slate-600 mt-2">
                      {{ obterLabelCurtoMetodoDoisFatores(metodo) }}
                    </p>
                  </button>
                </div>
              </div>

              <p v-if="solicitandoDesafioDoisFatores" class="text-xs text-slate-500 mt-3">
                Solicitando desafio...
              </p>

              <span v-if="codigoDoisFatores.feedback" class="text-sm text-red-500 block mt-3">
                {{ codigoDoisFatores.feedback }}
              </span>
            </div>

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
                  ref="inputOtpRef"
                  v-model="codigoDoisFatores.valor"
                  :length="6"
                  integer-only
                  class="mt-2 otp-login justify-center"
                />
                <div class="flex items-center gap-2 mt-3">
                  <Checkbox
                    v-model="confiarDispositivo"
                    input-id="confiar-dispositivo"
                    :binary="true"
                  />
                  <label for="confiar-dispositivo" class="text-xs text-slate-600 cursor-pointer">
                    Não pedir código neste dispositivo por 30 dias
                  </label>
                </div>
                <p v-if="desafioDoisFatoresExpiraEm" class="text-xs text-slate-500 mt-2">
                  Desafio ativo até
                  {{ new Date(desafioDoisFatoresExpiraEm).toLocaleTimeString() }}
                </p>
                <span v-if="codigoDoisFatores.feedback" class="text-sm text-red-500 block mt-2">
                  {{ codigoDoisFatores.feedback }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <Button
                v-if="etapaLogin !== 'CREDENCIAIS'"
                label="Voltar"
                severity="secondary"
                outlined
                type="button"
                @click="voltarEtapa"
              />
              <Button
                v-if="etapaLogin !== 'METODO_2FA'"
                :label="textoBotaoPrincipal"
                fluid
                type="submit"
                :loading="carregando || solicitandoDesafioDoisFatores"
              />
            </div>

            <button
              type="button"
              class="text-sm text-slate-500 underline cursor-pointer w-fit"
              :disabled="carregando"
              @click="abrirModalRecuperacaoSenha"
            >
              Esqueceu a senha?
            </button>
          </form>
        </div>
      </section>
    </div>
  </main>
  <TelaLoginModalRecuperarSenha v-model:visivel="modalRecuperarSenhaVisivel" :api />
</template>
<script lang="ts" setup>
  import { loginSchema } from '@/components/telas/tela-login/schemas/login-schema';
  import { TelaLoginEtapas } from '@/components/telas/tela-login/types/tela-login-etapas';
  import { TelaLoginMetodosDoisFatores } from '@/components/telas/tela-login/types/tela-login-metodos-dois-fatores';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import { computed, reactive, ref } from 'vue';

  import solicitarLogin2FADesafio from '@/data/2fa/solicitar-login-2fa-desafio';
  import { Button, Checkbox, InputOtp, InputText, Password } from 'primevue';
  import verificarLoginDoisFatores from '@/data/login/verificar-login-dois-fatores';
  import { TelaLoginDadosDoUsuario } from '@/components/telas/tela-login/types/tela-login-dados-do-usuario';
  import autenticar from '@/data/login/autenticar';
  import TelaLoginModalRecuperarSenha from '@/components/telas/tela-login/components/tela-login-modal-recuperar-senha.vue';

  const api = useApi();

  const { tokenDispositivoConfiavel } = defineProps<{
    tokenDispositivoConfiavel?: string;
  }>();

  const emit = defineEmits<{
    'salvar:dados': [dados: TelaLoginDadosDoUsuario];
    'salvar:dispositivo-confiavel': [token: string];
    'remover:dispositivo-confiavel': [];
    'ir:rota-inicial': [];
  }>();

  const { defineField, handleSubmit, errors } = useForm({
    validationSchema: toTypedSchema(loginSchema),
  });

  const [email, emailAttrs] = defineField('email');
  const [senha, senhaAttrs] = defineField('senha');

  const carregando = ref(false);
  const aguardandoDoisFatores = ref(false);
  const etapaLogin = ref<TelaLoginEtapas>('CREDENCIAIS');
  const tokenPreAutenticacao = ref('');
  const metodosDoisFatoresDisponiveis = ref<TelaLoginMetodosDoisFatores[]>([]);
  const metodoDoisFatoresSelecionado = ref<null | TelaLoginMetodosDoisFatores>(null);
  const desafioDoisFatoresId = ref('');
  const desafioDoisFatoresExpiraEm = ref('');
  const solicitandoDesafioDoisFatores = ref(false);
  const inputOtpRef = ref<{ $el?: HTMLElement } | null>(null);
  const confiarDispositivo = ref(true);
  const modalRecuperarSenhaVisivel = ref(false);
  const emailRecuperacaoSenha = ref('');
  const feedbackRecuperacaoSenha = ref('');

  const descricaoEtapaAtual = computed(() => {
    if (etapaLogin.value === 'METODO_2FA') {
      return 'Etapa 2 de 3: escolha o método de verificação.';
    }

    if (etapaLogin.value === 'CODIGO_2FA') {
      return 'Etapa 3 de 3: informe o código de autenticação.';
    }

    return 'Etapa 1 de 3: use suas credenciais para acessar a plataforma.';
  });

  const numeroEtapaAtual = computed(() => {
    if (etapaLogin.value === 'METODO_2FA') {
      return 2;
    }

    if (etapaLogin.value === 'CODIGO_2FA') {
      return 3;
    }

    return 1;
  });

  const { erro, info } = useNotification();

  const tentaFazerLogin = handleSubmit(async ({ email, senha }) => {
    try {
      carregando.value = true;

      if (etapaLogin.value === 'METODO_2FA') {
        await solicitarDesafioDoisFatores();
        return;
      }

      if (etapaLogin.value === 'CODIGO_2FA') {
        if (!desafioDoisFatoresId.value) {
          codigoDoisFatores.feedback = 'Solicite um desafio antes de validar o código';
          return;
        }

        const codigoDoisFatoresLimpo = obterCodigoDoisFatoresLimpo();

        if (!codigoDoisFatoresLimpo) {
          codigoDoisFatores.feedback = 'Você deve informar o código';
          return;
        }

        if (codigoDoisFatoresLimpo.length < 6) {
          codigoDoisFatores.feedback = 'Informe os 6 dígitos do código';
          return;
        }

        carregando.value = true;

        const { dados } = await verificarLoginDoisFatores(
          api,
          tokenPreAutenticacao.value,
          desafioDoisFatoresId.value,
          codigoDoisFatores.valor,
          confiarDispositivo.value
        );

        emit('salvar:dados', dados);

        if (dados.tokenDispositivoConfiavel) {
          emit('salvar:dispositivo-confiavel', dados.tokenDispositivoConfiavel);
        } else {
          emit('remover:dispositivo-confiavel');
        }

        emit('ir:rota-inicial');
        return;
      }

      carregando.value = true;

      const { dados } = await autenticar(api, email, senha, tokenDispositivoConfiavel);

      if (dados.requerDoisFatores) {
        aguardandoDoisFatores.value = true;
        etapaLogin.value = 'METODO_2FA';
        tokenPreAutenticacao.value = dados.tokenPreAutenticacao;
        metodosDoisFatoresDisponiveis.value = dados.metodos;
        metodoDoisFatoresSelecionado.value = null;
        desafioDoisFatoresId.value = '';
        desafioDoisFatoresExpiraEm.value = '';
        codigoDoisFatores.valor = '';

        info('Escolha o método e solicite o desafio para concluir o login', '2FA');
        return;
      }

      emit('salvar:dados', dados);
      emit('ir:rota-inicial');
    } catch (err) {
      erro(obterErroDaRequisicao(err) || 'Não foi possível fazer login');
    } finally {
      carregando.value = false;
    }
  });

  const selecionarMetodoEContinuar = async (metodo: 'TOTP' | 'EMAIL' | 'WHATSAPP') => {
    selecionarMetodoDoisFatores(metodo);
    await solicitarDesafioDoisFatores();
  };

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

  const codigoDoisFatores = reactive({
    valor: '',
    feedback: '',
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

  const voltarEtapa = () => {
    codigoDoisFatores.feedback = '';

    if (etapaLogin.value === 'CODIGO_2FA') {
      etapaLogin.value = 'METODO_2FA';
      desafioDoisFatoresId.value = '';
      desafioDoisFatoresExpiraEm.value = '';
      codigoDoisFatores.valor = '';
      return;
    }

    if (etapaLogin.value === 'METODO_2FA') {
      etapaLogin.value = 'CREDENCIAIS';
      aguardandoDoisFatores.value = false;
      tokenPreAutenticacao.value = '';
      metodosDoisFatoresDisponiveis.value = [];
      metodoDoisFatoresSelecionado.value = null;
      desafioDoisFatoresId.value = '';
      desafioDoisFatoresExpiraEm.value = '';
    }
  };

  const textoBotaoPrincipal = computed(() => {
    if (etapaLogin.value === 'METODO_2FA') {
      return 'Solicitar desafio';
    }

    if (etapaLogin.value === 'CODIGO_2FA') {
      return 'Validar';
    }

    return 'Continuar';
  });

  const abrirModalRecuperacaoSenha = () => {
    feedbackRecuperacaoSenha.value = '';
    emailRecuperacaoSenha.value = '';
    modalRecuperarSenhaVisivel.value = true;
  };

  const selecionarMetodoDoisFatores = (metodo: TelaLoginMetodosDoisFatores) => {
    metodoDoisFatoresSelecionado.value = metodo;
    etapaLogin.value = 'METODO_2FA';
    desafioDoisFatoresId.value = '';
    desafioDoisFatoresExpiraEm.value = '';
    codigoDoisFatores.valor = '';
    codigoDoisFatores.feedback = '';
  };

  const solicitarDesafioDoisFatores = async () => {
    try {
      if (!metodoDoisFatoresSelecionado.value) {
        codigoDoisFatores.feedback = 'Selecione um método de 2FA';
        return;
      }

      solicitandoDesafioDoisFatores.value = true;
      codigoDoisFatores.feedback = '';

      const { dados } = await solicitarLogin2FADesafio(
        api,
        tokenPreAutenticacao.value,
        metodoDoisFatoresSelecionado.value
      );

      desafioDoisFatoresId.value = dados.desafioId;
      desafioDoisFatoresExpiraEm.value = dados.expiraEm;
      codigoDoisFatores.valor = dados.codigo || '';
      etapaLogin.value = 'CODIGO_2FA';

      info(
        dados.metodo === 'TOTP'
          ? 'Informe o código do app autenticador'
          : 'Código enviado. Informe os 6 dígitos para continuar',
        '2FA'
      );
    } catch (err) {
      codigoDoisFatores.feedback = obterErroDaRequisicao(err) || 'Não foi possível solicitar';
    } finally {
      solicitandoDesafioDoisFatores.value = false;
    }
  };

  const obterCodigoDoisFatoresLimpo = () => {
    return String(codigoDoisFatores.valor || '')
      .replace(/\D/g, '')
      .slice(0, 6);
  };
</script>
