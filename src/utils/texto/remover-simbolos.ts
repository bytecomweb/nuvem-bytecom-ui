export default function removerSimbolos(texto: string) {
  return texto.replace(/[^a-zA-Z0-9]/g, '');
}
