import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import type { App, Plugin } from 'vue';
import TelaUsuarios from '@/components/telas/tela-usuarios/tela-usuarios.vue';
import TelaWhatsApp from '@/components/telas/tela-whatsapp/tela-whatsapp.vue';
import TelaConfiguracaoConta from '@/components/telas/tela-configuracao-conta/tela-configuracao-conta.vue';
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

const components = {
  TelaUsuarios,
  TelaWhatsApp,
  TelaConfiguracao2fa,
  TelaConfiguracaoConta,
  TelaLogin,
  CheckboxComLabel,
  InputMask,
  SelectEmpresa,
};

export {
  TelaUsuarios,
  TelaWhatsApp,
  TelaConfiguracao2fa,
  TelaConfiguracaoConta,
  TelaLogin,
  CheckboxComLabel,
  InputMask,
  SelectEmpresa,
};
export { API_SERVICE_KEY, configureApiService, createApiService, getApiService, useApiService };
export type { ApiService, ApiServiceConfig, NuvemBytecomUiApiConfig };

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
      app.directive('tooltip', Tooltip);
    }

    app.provide(API_SERVICE_KEY, apiService);

    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }
  },
} satisfies Plugin;
