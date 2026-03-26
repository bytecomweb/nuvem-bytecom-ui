import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import type { App, Plugin } from 'vue';
import TelaUsuarios from '@/components/telas/tela-usuarios/tela-usuarios.vue';
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

const components = {
  TelaUsuarios,
};

export { TelaUsuarios };
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
        },
        ...(options.primevue ?? {}),
      });

      app.use(ConfirmationService);
      app.use(ToastService);
    }

    app.provide(API_SERVICE_KEY, apiService);

    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }
  },
} satisfies Plugin;
