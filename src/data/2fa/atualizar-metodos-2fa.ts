import { AxiosInstance } from 'axios';

type MetodoAtualizacao2FA = {
  metodo: 'TOTP' | 'EMAIL' | 'WHATSAPP';
  ativo?: boolean;
  destino?: string;
  segredoTotp?: string;
};

export default async function atualizarMetodos2FA(
  api: AxiosInstance,
  metodos: MetodoAtualizacao2FA[]
) {
  const { data } = await api.patch('/usuarios/2fa/metodos', { metodos });

  return data;
}
