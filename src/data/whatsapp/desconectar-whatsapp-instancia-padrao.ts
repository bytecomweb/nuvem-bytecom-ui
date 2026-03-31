import { AxiosInstance } from 'axios';

export default async function desconectarWhatsAppInstanciaPadrao(
  api: AxiosInstance,
  empresaId: number
) {
  const { data } = await api.delete('/whatsapp/instancia-padrao/desconectar', {
    params: {
      empresaId,
    },
  });

  return data;
}
