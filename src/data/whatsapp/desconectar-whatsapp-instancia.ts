import { AxiosInstance } from 'axios';

export default async function desconectarWhatsAppInstancia(
  api: AxiosInstance,
  empresaId: number,
  numero: string
) {
  const { data } = await api.delete(`/whatsapp/${empresaId}/instancias/${numero}/desconectar`);

  return data;
}
