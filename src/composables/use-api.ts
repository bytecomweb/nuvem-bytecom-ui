import { useApiService } from '@/services/api';
import { AxiosInstance } from 'axios';
import { inject, provide } from 'vue';

export default function useApi(bearerToken?: string) {
  const api = inject<AxiosInstance>('api');

  if (!api) {
    useApiService().setConfig({
      bearerToken,
    });

    const api = useApiService().instance;

    provide('api', api);

    return api;
  }

  return api;
}
