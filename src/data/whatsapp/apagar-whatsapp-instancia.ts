import { AxiosInstance } from 'axios';

export default async function apagarWhatsAppInstancia(
  api: AxiosInstance,
  empresaId: number,
  numero: string
) {
  const { data } = await api.delete(`/whatsapp/${empresaId}/instancias/${numero}`);

  return data;
}
