import { WhatsAppInstanciaStatus } from '@/types/modelos/whatsapp-instancia-status';

export type WhatsAppInstancia = {
  id: string;
  name: string;
  titulo?: string;
  ehInstanciaPadrao?: boolean;
  podeGerenciar?: boolean;
  connectionStatus: WhatsAppInstanciaStatus;
  ownerJid: null;
  profileName: null | string;
  profilePicUrl: null | string;
  integration: 'WHATSAPP-BAILEYS';
  number: null;
  businessId: null;
  token: string;
  clientName: string;
  disconnectionReasonCode: null;
  disconnectionObject: null;
  disconnectionAt: null;
  createdAt: string;
  updatedAt: string;
  Chatwoot: null;
  Proxy: null;
  Rabbitmq: null;
  Nats: null;
  Sqs: null;
  Websocket: null;
};
