import { AxiosInstance } from 'axios';

export default async function criarWhatsAppInstancia(
  api: AxiosInstance,
  empresaId: number,
  numero: string
) {
  const { data } = await api.post(`/whatsapp/${empresaId}/instancias`, {
    numero,
  });

  return data;
}
