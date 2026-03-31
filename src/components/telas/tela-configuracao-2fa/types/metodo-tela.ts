import { Metodo2FA } from '@/types/modelos/metodo-2fa';

export type MetodoTela = Metodo2FA & {
  codigoTeste: string;
  desafioId?: string;
  expiraEm?: string;
  solicitando: boolean;
  verificando: boolean;
  salvando: boolean;
};
