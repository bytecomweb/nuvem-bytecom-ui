import Aura from '@primeuix/themes/aura'
import { QueryClient, type QueryClientConfig, VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import type { App, Plugin } from 'vue'
import UiButton from './components/UiButton.vue'
import TelaUsuarios from './components/tela-usuarios.vue'
import {
  API_SERVICE_KEY,
  configureApiService,
  createApiService,
  getApiService,
  useApiService,
  type ApiService,
  type ApiServiceConfig,
  type ApiServiceConfig as NuvemBytecomUiApiConfig,
} from './services/api'

const components = {
  UiButton,
  TelaUsuarios,
}

export { UiButton, TelaUsuarios }
export { API_SERVICE_KEY, configureApiService, createApiService, getApiService, useApiService }
export type { ApiService, ApiServiceConfig, NuvemBytecomUiApiConfig }

export interface NuvemBytecomUiOptions {
  installPrimeVue?: boolean
  installVueQuery?: boolean
  queryClient?: QueryClient
  queryClientConfig?: QueryClientConfig
  primevue?: Record<string, unknown>
  api?: ApiServiceConfig
}

export type NuvemBytecomUiPlugin = Plugin

export default {
  install(app: App, options: NuvemBytecomUiOptions = {}) {
    if (options.installVueQuery !== false) {
      app.use(VueQueryPlugin, {
        queryClient: options.queryClient ?? new QueryClient(options.queryClientConfig),
      })
    }

    const apiService = configureApiService(options.api)

    if (options.installPrimeVue !== false) {
      app.use(PrimeVue, {
        theme: {
          preset: Aura,
        },
        ...(options.primevue ?? {}),
      })

      app.use(ConfirmationService)
      app.use(ToastService)
    }

    app.provide(API_SERVICE_KEY, apiService)

    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
} satisfies Plugin