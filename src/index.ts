import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import type { App, Plugin } from 'vue';
import TelaUsuarios from '@/components/telas/tela-usuarios/tela-usuarios.vue';
import TelaWhatsApp from '@/components/telas/tela-whatsapp/tela-whatsapp.vue';
import TelaConfiguracaoConta from '@/components/telas/tela-configuracao-conta/tela-configuracao-conta.vue';
import TelaPessoas from '@/components/telas/tela-pessoas/tela-pessoas.vue';
import KeyFilter from 'primevue/keyfilter';
import {
  API_SERVICE_KEY,
  configureApiService,
  createApiService,
  getApiService,
  useApiService,
  type ApiService,
  type ApiServiceConfig,
  type ApiServiceConfig as NuvemBytecomUiApiConfig,
} from './services/api';
import TelaConfiguracao2fa from '@/components/telas/tela-configuracao-2fa/tela-configuracao-2fa.vue';
import TelaLogin from '@/components/telas/tela-login/tela-login.vue';
import CheckboxComLabel from '@/components/inputs/checkbox-com-label.vue';
import InputMask from '@/components/inputs/input-mask.vue';
import SelectEmpresa from '@/components/selects/select-empresa.vue';
import SelectTabelaPreco from '@/components/selects/select-tabela-preco.vue';
import InputCep from '@/components/inputs/input-cep.vue';
import InputCpfOuCnpj from '@/components/inputs/input-cpf-ou-cnpj.vue';
import InputTelefone from '@/components/inputs/input-telefone.vue';
import { type Empresa } from '@/types/modelos/empresa';
import { type Usuario, type UsuarioCargo } from '@/types/modelos/usuario';
import { type Sistema } from '@/types/modelos/sistema';
import { type Pessoa } from '@/types/modelos/pessoa';
import { type PessoaContato } from '@/types/modelos/pessoa-contato';
import { type PessoaContatoTipo } from '@/types/modelos/pessoa-contato-tipo';
import { type PessoaEndereco } from '@/types/modelos/pessoa-endereco';
import { type PessoaEnderecoTipo } from '@/types/modelos/pessoa-endereco-tipo';
import { cnpjOuCpfSchema } from '@/schemas/cnpj-ou-cpf-schema';
import { cnpjSchema } from '@/schemas/cnpj-schema';
import { cpfSchema } from '@/schemas/cpf-schema';

export {
  TelaUsuarios,
  TelaWhatsApp,
  TelaConfiguracao2fa,
  TelaConfiguracaoConta,
  TelaLogin,
  TelaPessoas,
  CheckboxComLabel,
  InputMask,
  SelectEmpresa,
  SelectTabelaPreco,
  InputCpfOuCnpj,
  InputCep,
  InputTelefone,
};
export { API_SERVICE_KEY, configureApiService, createApiService, getApiService, useApiService };
export { cpfSchema, cnpjSchema, cnpjOuCpfSchema };
export type {
  ApiService,
  ApiServiceConfig,
  NuvemBytecomUiApiConfig,
  Empresa,
  Usuario,
  Sistema,
  UsuarioCargo,
  Pessoa,
  PessoaContato,
  PessoaContatoTipo,
  PessoaEndereco,
  PessoaEnderecoTipo,
};

export interface NuvemBytecomUiOptions {
  installPrimeVue?: boolean;
  primevue?: Record<string, unknown>;
  api?: ApiServiceConfig;
}

export type NuvemBytecomUiPlugin = Plugin;

export default {
  install(app: App, options: NuvemBytecomUiOptions = {}) {
    const apiService = configureApiService(options.api);

    if (options.installPrimeVue !== false) {
      app.use(PrimeVue, {
        theme: {
          preset: Aura,
          options: {
            darkModeSelector: 'light',
          },
        },
        ...(options.primevue ?? {}),
      });

      app.use(ConfirmationService);
      app.use(ToastService);

      app.directive('keyfilter', KeyFilter);
      app.directive('tooltip', Tooltip);
    }

    app.provide(API_SERVICE_KEY, apiService);
  },
} satisfies Plugin;
