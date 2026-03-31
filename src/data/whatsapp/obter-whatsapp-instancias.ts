import { WhatsAppInstancia } from '@/types/modelos/whatsapp-instancia';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function obterWhatsAppInstancias(api: AxiosInstance, empresaId: number) {
  const { data } = await api.get<RespostaSucesso<WhatsAppInstancia[]>>(
    `/whatsapp/${empresaId}/instancias`
  );

  return data;
}
