export type Metodo2FA = {
  metodo: 'TOTP' | 'EMAIL' | 'WHATSAPP';
  ativo: boolean;
  destino: string | null;
  possuiSegredoTotp: boolean;
};
