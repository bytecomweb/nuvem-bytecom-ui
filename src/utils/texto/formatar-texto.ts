type FormatarTextoParametros = {
  mascara: string | string[];
  texto: string;
};

export default function formatarTexto({ mascara, texto }: FormatarTextoParametros) {
  if (Array.isArray(mascara)) {
    for (const fmascara of mascara) {
      if ((fmascara.match(/0/g) || []).length === texto.length) {
        return formatarTexto({ mascara: fmascara, texto });
      }
    }

    return texto;
  }

  if ((mascara.match(/0/g) || []).length !== texto.length) {
    throw new Error('Texto não possui o tamanho suficiente para a máscara');
  }

  let textoFormatado = '';
  let indiceInput = 0;

  for (let i = 0; i < mascara.length; i++) {
    const currentChar = mascara[i];

    if (currentChar === '0' && indiceInput < texto.length) {
      textoFormatado += texto[indiceInput];
      indiceInput++;
    } else {
      textoFormatado += currentChar;
    }
  }

  return textoFormatado;
}
