import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

type ObterStatusDaConexaoDaWhatsAppInstancia = {
  instanceName: string;
  state: 'open' | 'close' | 'connecting';
};

export default async function obterStatusDaConexaoDaWhatsAppInstancia(
  api: AxiosInstance,
  empresaId: number,
  numero: string
) {
  const { data } = await api.get<RespostaSucesso<ObterStatusDaConexaoDaWhatsAppInstancia>>(
    `/whatsapp/${empresaId}/instancias/${numero}/status`
  );

  return data;
}
