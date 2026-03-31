import { AxiosInstance } from 'axios';

export default async function iniciarMonitoramentoWhatsAppInstanciaPadrao(api: AxiosInstance) {
  const { data } = await api.post(`/whatsapp/instancia-padrao/monitoramento/iniciar`);

  return data;
}
