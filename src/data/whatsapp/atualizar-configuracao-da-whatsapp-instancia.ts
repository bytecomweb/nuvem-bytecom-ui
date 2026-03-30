import { whatsAppInstanciaConfiguracaoFormularioSchema } from '@/components/telas/tela-whatsapp/schema/whatsapp-instancia-configuracao-formulario-schema';
import { AxiosInstance } from 'axios';
import z from 'zod';

export default async function atualizarConfiguracaoDaWhatsAppInstancia(
  api: AxiosInstance,
  empresaId: number,
  numero: string,
  configuracao: z.infer<typeof whatsAppInstanciaConfiguracaoFormularioSchema>
) {
  const { data } = await api.patch(
    `/whatsapp/${empresaId}/instancias/${numero}/configuracao`,
    configuracao
  );

  return data;
}
