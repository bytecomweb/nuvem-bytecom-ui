import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
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
  primevue?: Record<string, unknown>
  api?: ApiServiceConfig
}

export type NuvemBytecomUiPlugin = Plugin

export default {
  install(app: App, options: NuvemBytecomUiOptions = {}) {
    const apiService = configureApiService(options.api)

    if (options.installPrimeVue !== false) {
      app.use(PrimeVue, {
        theme: {
          preset: Aura,
        },
        ...(options.primevue ?? {}),
      })
    }

    app.provide(API_SERVICE_KEY, apiService)

    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
} satisfies Plugin