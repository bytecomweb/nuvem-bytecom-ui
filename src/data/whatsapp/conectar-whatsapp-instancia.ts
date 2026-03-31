import { WhatsAppInstanciaConectar } from '@/types/modelos/whatsapp-instancia-conectar';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function conectarWhatsAppInstancia(
  api: AxiosInstance,
  empresaId: number,
  numero: string
) {
  const { data } = await api.get<RespostaSucesso<WhatsAppInstanciaConectar>>(
    `/whatsapp/${empresaId}/instancias/${numero}/conectar`
  );

  return data;
}
