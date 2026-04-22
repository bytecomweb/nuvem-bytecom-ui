import { useToast } from 'primevue/usetoast';
import type { ToastServiceMethods } from 'primevue/toastservice';

export default function useNotification(notificacao: ToastServiceMethods = useToast()) {
  function sucesso(mensagem: string) {
    notificacao.add({
      severity: 'success',
      life: 2000,
      summary: 'Sucesso',
      detail: mensagem,
    });
  }

  function erro(mensagem: string) {
    notificacao.add({
      severity: 'error',
      life: 2000,
      summary: 'Erro',
      detail: mensagem,
    });
  }

  function aviso(mensagem: string) {
    notificacao.add({
      severity: 'warn',
      life: 2000,
      summary: 'Aviso',
      detail: mensagem,
    });
  }

  function info(mensagem: string, titulo = 'Informação') {
    notificacao.add({
      severity: 'info',
      life: 2000,
      summary: titulo,
      detail: mensagem,
    });
  }

  return {
    sucesso,
    erro,
    aviso,
    info
  };
}
