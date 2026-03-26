import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { inject, type InjectionKey } from 'vue'

export interface ApiServiceConfig {
  baseURL?: string
  prefix?: string
  axios?: AxiosRequestConfig
}

export interface ApiService {
  instance: AxiosInstance
  config: Required<Pick<ApiServiceConfig, 'baseURL' | 'prefix'>> & {
    axios?: AxiosRequestConfig
  }
  setConfig: (config?: ApiServiceConfig) => AxiosInstance
}

export const API_SERVICE_KEY = Symbol('NuvemBytecomApiService') as InjectionKey<ApiService>

function normalizeSegment(value?: string) {
  if (!value) {
    return ''
  }

  return value.replace(/^\/+|\/+$/g, '')
}

function buildBaseURL(baseURL?: string, prefix?: string) {
  const normalizedBaseURL = (baseURL ?? '').replace(/\/+$/g, '')
  const normalizedPrefix = normalizeSegment(prefix)

  if (!normalizedBaseURL && !normalizedPrefix) {
    return ''
  }

  if (!normalizedBaseURL) {
    return `/${normalizedPrefix}`
  }

  if (!normalizedPrefix) {
    return normalizedBaseURL
  }

  return `${normalizedBaseURL}/${normalizedPrefix}`
}

export function createApiService(initialConfig: ApiServiceConfig = {}): ApiService {
  let currentConfig: ApiService['config'] = {
    baseURL: initialConfig.baseURL ?? '',
    prefix: initialConfig.prefix ?? '',
    axios: initialConfig.axios,
  }

  let instance = axios.create({
    ...currentConfig.axios,
    baseURL: buildBaseURL(currentConfig.baseURL, currentConfig.prefix),
  })

  const setConfig = (nextConfig: ApiServiceConfig = {}) => {
    currentConfig = {
      baseURL: nextConfig.baseURL ?? currentConfig.baseURL,
      prefix: nextConfig.prefix ?? currentConfig.prefix,
      axios: nextConfig.axios ?? currentConfig.axios,
    }

    instance = axios.create({
      ...currentConfig.axios,
      baseURL: buildBaseURL(currentConfig.baseURL, currentConfig.prefix),
    })

    service.instance = instance

    return instance
  }

  const service: ApiService = {
    get instance() {
      return instance
    },
    set instance(value: AxiosInstance) {
      instance = value
    },
    get config() {
      return currentConfig
    },
    setConfig,
  }

  return service
}

const defaultApiService = createApiService()

export function configureApiService(config: ApiServiceConfig = {}) {
  if (!Object.keys(config).length) {
    return defaultApiService
  }

  defaultApiService.setConfig(config)
  return defaultApiService
}

export function getApiService() {
  return defaultApiService
}

export function useApiService() {
  return inject(API_SERVICE_KEY, defaultApiService)
}