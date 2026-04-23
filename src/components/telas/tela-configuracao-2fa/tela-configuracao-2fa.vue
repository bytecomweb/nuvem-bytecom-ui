<template>
  <TelaConfiguracao2faCabecalho v-if="!esconderCabecalho" />
  <main class="px-4 mt-5 pb-10 flex justify-center">
    <div class="w-full max-w-2xl grid grid-cols-1 gap-3">
      <div class="border rounded-lg p-3 bg-white border-gray-200">
        <p class="text-xs text-gray-500">Formas ativas</p>
        <p class="text-lg font-semibold">{{ metodosAtivos }}</p>
      </div>
      <div
        v-for="metodo in metodos"
        :key="metodo.metodo"
        class="rounded-lg p-4 bg-white border border-gray-200"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div
              class="w-9 h-9 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center text-base"
            >
              <i :class="iconesMetodo[metodo.metodo]" />
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-semibold text-gray-800">{{ titulosMetodo[metodo.metodo] }}</h3>
                <Tag
                  :severity="metodo.ativo ? 'success' : 'secondary'"
                  :value="metodo.ativo ? 'Ativo' : 'Inativo'"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ descricoesMetodo[metodo.metodo] }}</p>
            </div>
          </div>
          <div class="flex items-center">
            <ToggleSwitch
              v-if="metodo.metodo !== 'TOTP'"
              v-model="metodo.ativo"
              :disabled="metodo.salvando"
              @update:modelValue="() => tentaSalvarMetodo(metodo, true)"
            />
            <Tag
              v-else
              :severity="metodo.ativo ? 'success' : 'secondary'"
              :value="metodo.ativo ? 'Ativo' : 'Inativo'"
            />
          </div>
        </div>

        <div v-if="metodo.metodo !== 'TOTP'" class="mt-4">
          <label :for="`destino-${metodo.metodo}`" class="text-sm text-gray-700"
            >Para onde enviar</label
          >
          <InputText
            :id="`destino-${metodo.metodo}`"
            v-model="metodo.destino"
            v-maska="metodo.metodo === 'WHATSAPP' ? mascaraWhatsappConfig : undefined"
            fluid
            class="mt-1"
            :disabled="!metodo.ativo || metodo.salvando"
            :placeholder="metodo.metodo === 'EMAIL' ? 'exemplo@dominio.com' : '5511999999999'"
            @blur="tentaSalvarMetodo(metodo, true)"
          />

          <div class="mt-3 flex justify-end">
            <Button
              label="Salvar este método"
              icon="pi pi-save"
              size="small"
              :loading="metodo.salvando"
              @click="tentaSalvarMetodo(metodo)"
            />
          </div>
        </div>

        <div v-else class="mt-4 space-y-2">
          <div class="text-sm text-gray-600">
            {{
              metodo.ativo
                ? 'Verificação por aplicativo ativa.'
                : 'Configure no aplicativo e confirme com um código.'
            }}
          </div>
          <div class="flex flex-wrap gap-2">
            <Button
              label="Configurar no aplicativo"
              severity="secondary"
              @click="abrirDialogTotp(metodo.ativo)"
            />
            <Button
              v-if="metodo.ativo"
              label="Desativar verificação por aplicativo"
              severity="danger"
              outlined
              :loading="!!metodos.find((item) => item.metodo === 'TOTP')?.salvando"
              @click="tentaDesativarTotp"
            />
          </div>
          <p class="text-xs text-gray-500">
            Use o botão acima para abrir o assistente de configuração.
          </p>
        </div>

        <div
          v-if="metodo.ativo && metodo.metodo !== 'TOTP'"
          class="mt-4 border-t border-gray-200 pt-3"
        >
          <div class="flex flex-wrap items-end gap-3">
            <div class="grow min-w-[220px]">
              <label :for="`codigo-${metodo.metodo}`" class="text-sm text-gray-700"
                >Código de teste</label
              >
              <InputText
                :id="`codigo-${metodo.metodo}`"
                v-model="metodo.codigoTeste"
                fluid
                class="mt-1"
                placeholder="Digite o código recebido"
              />
            </div>
            <Button
              label="Solicitar código"
              severity="secondary"
              :loading="metodo.solicitando"
              @click="tentaSolicitarDesafio(metodo.metodo)"
            />
            <Button
              label="Validar código"
              :loading="metodo.verificando"
              @click="tentaValidarDesafio(metodo.metodo)"
            />
          </div>
          <p v-if="metodo.desafioId" class="text-xs text-gray-500 mt-2">
            Desafio ativo até
            {{ metodo.expiraEm ? new Date(metodo.expiraEm).toLocaleTimeString() : '-' }}.
          </p>
        </div>
      </div>
    </div>
  </main>
  <TelaConfiguracao2faConfigurarTotp
    v-model:visivel="dialogTotpVisivel"
    v-model:metodoTotpAtivo="metodoTotpAtivo"
    v-model:segredoTotp="segredoTotp"
    v-model:otpauthUrl="otpauthUrl"
    v-model:codigoAtivacaoTotp="codigoAtivacaoTotp"
    v-model:carregandoConfiguracaoTotp="carregandoConfiguracaoTotp"
    v-model:ativandoTotp="ativandoTotp"
    v-model:qr-code-totp="qrCodeTotp"
    :metodos="metodos"
    @configurar="tentaConfigurarTotp"
    @desativar="tentaDesativarTotp"
    @ativar="tentaAtivarTotp"
  />
</template>
<script lang="ts" setup>
  import TelaConfiguracao2faCabecalho from '@/components/telas/tela-configuracao-2fa/components/tela-configuracao-2fa-cabecalho.vue';
  import { MetodoTela } from '@/components/telas/tela-configuracao-2fa/types/metodo-tela';
  import useApi from '@/composables/use-api';
  import useNotification from '@/composables/use-notification';
  import atualizarMetodos2FA from '@/data/2fa/atualizar-metodos-2fa';
  import obterMetodos2FA from '@/data/2fa/obter-metodos-2fa';
  import { Metodo2FA } from '@/types/modelos/metodo-2fa';
  import obterErroDaRequisicao from '@/utils/requisicao/obter-erro-da-requisicao';
  import { MaskInputOptions } from 'maska';
  import { Button, InputText, Tag, ToggleSwitch } from 'primevue';
  import { computed, onMounted, ref } from 'vue';
  import { toDataURL } from 'qrcode';
  import configurarTotp from '@/data/2fa/configurar-totp';
  import solicitarDesafio2FA from '@/data/2fa/solicitar-desafio-2fa';
  import verificarDesafio2FA from '@/data/2fa/verificar-desafio-2fa';
  import { vMaska } from 'maska/vue';
  import TelaConfiguracao2faConfigurarTotp from '@/components/telas/tela-configuracao-2fa/components/tela-configuracao-2fa-configurar-totp.vue';
  import ativarTotp from '@/data/2fa/ativar-totp';
  import { watch } from 'vue';

  const { bearerToken } = defineProps<{
    bearerToken: string;
    ehAdmin?: boolean;
    esconderCabecalho?: boolean;
  }>();

  const api = useApi(bearerToken);

  const notificacao = useNotification();

  const titulosMetodo: Record<Metodo2FA['metodo'], string> = {
    EMAIL: 'Código por e-mail',
    TOTP: 'Aplicativo de códigos',
    WHATSAPP: 'Código por WhatsApp',
  };

  const descricoesMetodo: Record<Metodo2FA['metodo'], string> = {
    EMAIL:
      'Use Google Authenticator, Authy ou outro app autenticador para gerar códigos de verificação.',
    TOTP: 'Envia um código para o seu e-mail sempre que fizer login.',
    WHATSAPP: 'Envia um código para o seu WhatsApp sempre que fizer login.',
  };

  const iconesMetodo: Record<Metodo2FA['metodo'], string> = {
    EMAIL: 'pi pi-envelope',
    TOTP: 'pi pi-shield',
    WHATSAPP: 'pi pi-whatsapp',
  };

  const mascaraWhatsappConfig: MaskInputOptions = {
    mask: ['+## (##) ####-####', '+## (##) # ####-####'],
    eager: true,
  };

  const segredoTotp = ref('');
  const otpauthUrl = ref('');
  const qrCodeTotp = ref('');
  const codigoAtivacaoTotp = ref('');
  const carregandoConfiguracaoTotp = ref(false);
  const ativandoTotp = ref(false);

  const carregando = ref(false);

  const metodosAtivos = computed(() => metodos.value.filter((metodo) => metodo.ativo).length);
  const metodoTotpAtivo = computed(
    () => !!metodos.value.find((metodo) => metodo.metodo === 'TOTP')?.ativo
  );

  const metodos = ref<MetodoTela[]>([]);

  const tentaObterMetodos = async () => {
    try {
      carregando.value = true;

      const { dados } = await obterMetodos2FA(api);

      metodos.value = dados.metodos.map((metodo) => ({
        ...metodo,
        destino: metodo.destino || '',
        codigoTeste: '',
        solicitando: false,
        verificando: false,
        salvando: false,
      }));
    } catch (err) {
    } finally {
      carregando.value = false;
    }
  };

  const montarPayloadMetodo = (metodo: MetodoTela) => ({
    metodo: metodo.metodo,
    ativo: metodo.ativo,
    destino:
      metodo.metodo === 'TOTP'
        ? undefined
        : metodo.metodo === 'WHATSAPP'
          ? (metodo.destino || '').replace(/\D/g, '') || undefined
          : metodo.destino?.trim() || undefined,
    segredoTotp: metodo.metodo === 'TOTP' && segredoTotp.value ? segredoTotp.value : undefined,
  });

  const tentaSalvarMetodo = async (metodo: MetodoTela, silencioso = false) => {
    try {
      metodo.salvando = true;

      const { dados } = await atualizarMetodos2FA(api, [montarPayloadMetodo(metodo)]);

      if (dados.metodoTotp?.segredo) {
        segredoTotp.value = dados.metodoTotp.segredo;
        otpauthUrl.value = dados.metodoTotp.otpauthUrl;
        await atualizarQrCodeTotp();
      }

      if (!silencioso) {
        notificacao.sucesso(`${titulosMetodo[metodo.metodo]} salvo com sucesso`);
      }
    } catch (erro) {
      notificacao.erro(
        obterErroDaRequisicao(erro) || `Não foi possível salvar ${titulosMetodo[metodo.metodo]}`
      );
    } finally {
      metodo.salvando = false;
    }
  };

  const atualizarQrCodeTotp = async () => {
    if (!otpauthUrl.value) {
      qrCodeTotp.value = '';
      return;
    }

    try {
      qrCodeTotp.value = await toDataURL(otpauthUrl.value, {
        margin: 1,
        width: 220,
      });
    } catch {
      qrCodeTotp.value = '';
    }
  };

  const dialogTotpVisivel = ref(false);

  const abrirDialogTotp = async (totpAtivo: boolean) => {
    dialogTotpVisivel.value = true;

    if (!totpAtivo && !otpauthUrl.value && !carregandoConfiguracaoTotp.value) {
      await tentaConfigurarTotp(false);
    }
  };

  const tentaConfigurarTotp = async (regenerar = false) => {
    try {
      carregandoConfiguracaoTotp.value = true;

      const { dados } = await configurarTotp(api, regenerar);

      segredoTotp.value = dados.segredo;
      otpauthUrl.value = dados.otpauthUrl;
      codigoAtivacaoTotp.value = '';

      await atualizarQrCodeTotp();
      await tentaObterMetodos();

      notificacao.sucesso('QR Code gerado. Escaneie no aplicativo e confirme com o código.');
    } catch (erro) {
      notificacao.erro(
        obterErroDaRequisicao(erro) || 'Não foi possível configurar pelo aplicativo'
      );
    } finally {
      carregandoConfiguracaoTotp.value = false;
    }
  };

  const tentaDesativarTotp = async () => {
    const metodo = metodos.value.find((item) => item.metodo === 'TOTP');

    if (!metodo) {
      return;
    }

    try {
      metodo.salvando = true;

      await atualizarMetodos2FA(api, [
        {
          metodo: 'TOTP',
          ativo: false,
          segredoTotp: segredoTotp.value || undefined,
        },
      ]);

      await tentaObterMetodos();
      dialogTotpVisivel.value = false;
      notificacao.sucesso('Verificação por aplicativo desativada com sucesso');
    } catch (erro) {
      notificacao.erro(
        obterErroDaRequisicao(erro) || 'Não foi possível desativar a verificação por aplicativo'
      );
    } finally {
      metodo.salvando = false;
    }
  };

  const tentaSolicitarDesafio = async (metodoSelecionado: Metodo2FA['metodo']) => {
    const metodo = metodos.value.find((item) => item.metodo === metodoSelecionado);

    if (!metodo) {
      return;
    }

    if (!metodo.ativo) {
      return notificacao.erro('Ative o método antes de solicitar um código de teste');
    }

    try {
      metodo.solicitando = true;

      if (metodoSelecionado === 'TOTP') {
        await sincronizarMetodoParaTeste(metodo);
      }

      const { dados } = await solicitarDesafio2FA(api, metodoSelecionado, 'OPERACAO_SENSIVEL', {
        modo: 'TESTE',
        destino:
          metodo.metodo === 'TOTP'
            ? undefined
            : metodo.metodo === 'WHATSAPP'
              ? (metodo.destino || '').replace(/\D/g, '') || undefined
              : metodo.destino?.trim() || undefined,
      });

      metodo.desafioId = dados.desafioId;
      metodo.expiraEm = dados.expiraEm;
      metodo.codigoTeste = dados.codigo || '';

      notificacao.sucesso(`Desafio 2FA solicitado para ${titulosMetodo[metodoSelecionado]}`);
    } catch (erro) {
      notificacao.erro(
        obterErroDaRequisicao(erro) || 'Não foi possível solicitar o desafio de 2FA'
      );
    } finally {
      metodo.solicitando = false;
    }
  };

  const sincronizarMetodoParaTeste = async (metodo: MetodoTela) => {
    const { dados } = await atualizarMetodos2FA(api, [montarPayloadMetodo(metodo)]);

    if (metodo.metodo === 'TOTP' && dados.metodoTotp?.segredo) {
      segredoTotp.value = dados.metodoTotp.segredo;
      otpauthUrl.value = dados.metodoTotp.otpauthUrl;
      await atualizarQrCodeTotp();
    }
  };

  const tentaValidarDesafio = async (metodoSelecionado: Metodo2FA['metodo']) => {
    const metodo = metodos.value.find((item) => item.metodo === metodoSelecionado);

    if (!metodo || !metodo.desafioId) {
      return notificacao.erro('Solicite um desafio antes de validar o código');
    }

    if (!metodo.codigoTeste.trim()) {
      return notificacao.erro('Informe o código para validar o desafio');
    }

    try {
      metodo.verificando = true;

      await verificarDesafio2FA(api, metodo.desafioId, metodo.codigoTeste.trim());

      notificacao.sucesso('Código 2FA validado com sucesso');

      metodo.desafioId = undefined;
      metodo.expiraEm = undefined;
      metodo.codigoTeste = '';
    } catch (erro) {
      notificacao.erro(obterErroDaRequisicao(erro) || 'Não foi possível validar o código 2FA');
    } finally {
      metodo.verificando = false;
    }
  };

  const tentaAtivarTotp = async () => {
    const codigo = String(codigoAtivacaoTotp.value || '')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (codigo.length < 6) {
      return notificacao.erro('Digite os 6 números do código');
    }

    try {
      ativandoTotp.value = true;

      await ativarTotp(api, codigo);

      codigoAtivacaoTotp.value = '';
      await tentaObterMetodos();
      qrCodeTotp.value = '';
      dialogTotpVisivel.value = false;

      notificacao.sucesso('Verificação por aplicativo ativada com sucesso');
    } catch (erro) {
      notificacao.erro(
        obterErroDaRequisicao(erro) || 'Não foi possível ativar a verificação por aplicativo'
      );
    } finally {
      ativandoTotp.value = false;
    }
  };

  onMounted(() => {
    tentaObterMetodos();
  });

  watch(otpauthUrl, () => {
    atualizarQrCodeTotp();
  });
</script>
<style scoped>
  :deep(.otp-totp-config.p-inputotp) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.5rem;
  }

  :deep(.otp-totp-config .p-inputotp-input) {
    width: 100%;
    min-width: 0;
    text-align: center;
  }

  @media (max-width: 420px) {
    :deep(.otp-totp-config.p-inputotp) {
      gap: 0.35rem;
    }
  }
</style>
