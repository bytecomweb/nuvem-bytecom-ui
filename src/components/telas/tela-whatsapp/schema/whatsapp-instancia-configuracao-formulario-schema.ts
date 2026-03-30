import { z } from 'zod';

export const whatsAppInstanciaConfiguracaoFormularioSchema = z.object({
  recusarChamadas: z.boolean(),
  mensagemPadraoParaChamadas: z.string().optional(),
  ignorarGrupos: z.boolean(),
  sempreOnline: z.boolean(),
  lerMensagens: z.boolean(),
  sincronizarConversas: z.boolean(),
  lerStatus: z.boolean(),
});
