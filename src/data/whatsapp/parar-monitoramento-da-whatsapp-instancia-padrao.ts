import { AxiosInstance } from 'axios';

export default async function pararMonitoramentoDaWhatsAppInstanciaPadrao(api: AxiosInstance) {
  const { data } = await api.delete(`/whatsapp/instancia-padrao/monitoramento/parar`);

  return data;
}
