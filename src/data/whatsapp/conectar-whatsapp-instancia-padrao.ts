import { WhatsAppInstanciaConectar } from '@/types/modelos/whatsapp-instancia-conectar';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function conectarWhatsAppInstanciaPadrao(
  api: AxiosInstance,
  empresaId: number
) {
  const { data } = await api.get<RespostaSucesso<WhatsAppInstanciaConectar>>(
    '/whatsapp/instancia-padrao/conectar',
    {
      params: {
        empresaId,
      },
    }
  );

  return data;
}
