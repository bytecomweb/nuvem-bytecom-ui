import { WhatsAppInstanciaConfiguracao } from '@/types/modelos/whatsapp-instancia-configuracao';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export default async function obterConfiguracaoDaWhatsAppInstancia(
  api: AxiosInstance,
  empresaId: number,
  numero: string
) {
  const { data } = await api.get<RespostaSucesso<WhatsAppInstanciaConfiguracao>>(
    `/whatsapp/${empresaId}/instancias/${numero}/configuracao`
  );

  return data;
}
