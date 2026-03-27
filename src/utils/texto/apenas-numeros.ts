export default function apenasNumeros(string: string, tamanhoMaximo?: number) {
  if (tamanhoMaximo) {
    return string.replace(/[^\d]/g, '').substring(0, tamanhoMaximo);
  }

  return string.replace(/[^\d]/g, '');
}
