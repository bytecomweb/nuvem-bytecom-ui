import { WhatsAppInstancia } from '@/types/modelos/whatsapp-instancia';
import { WhatsAppInstanciaStatus } from '@/types/modelos/whatsapp-instancia-status';
import { RespostaSucesso } from '@/types/respostas/resposta-sucesso';
import { AxiosInstance } from 'axios';

export type DadosInstanciaPadrao = {
  instancia: WhatsAppInstancia | null;
  conexao: {
    instanceName: string;
    state: WhatsAppInstanciaStatus;
  };
  monitoramento: {
    ativo: boolean;
    ultimoStatus: WhatsAppInstanciaStatus | null;
  };
  configuracao: {
    bloquearInstanciaPadraoWhatsApp: boolean;
  };
};

export default async function obterWhatsAppInstanciaPadrao(api: AxiosInstance, empresaId: number) {
  const { data } = await api.get<RespostaSucesso<DadosInstanciaPadrao>>(
    `/whatsapp/instancia-padrao`,
    {
      params: {
        empresaId,
      },
    }
  );

  return data;
}
