import { AxiosInstance } from 'axios';

export default async function redefinirSenhaPorPessoaId(api: AxiosInstance, pessoaId: number) {
  const { data } = await api.post(`/pessoas/${pessoaId}/recuperar-senha`);

  return data;
}
