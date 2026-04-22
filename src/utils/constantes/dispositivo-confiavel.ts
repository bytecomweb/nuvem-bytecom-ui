export const DISPOSITIVO_CONFIAVEL_HEADER = 'x-dispositivo-confiavel-token';
export const DISPOSITIVO_CONFIAVEL_LOCAL_STORAGE_CHAVE = 'nb_dispositivo_confiavel_token';

export function obterChaveDispositivoConfiavelPorSistema(sistemaId?: number) {
  return `${DISPOSITIVO_CONFIAVEL_LOCAL_STORAGE_CHAVE}_${sistemaId ?? 'global'}`;
}
