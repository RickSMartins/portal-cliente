import api from './client';

export async function listarSolicitacoes(status) {
  const params = status ? { status } : {};
  const { data } = await api.get('/solicitacoes', { params });
  return data;
}

export async function obterSolicitacao(id) {
  const { data } = await api.get(`/solicitacoes/${id}`);
  return data;
}

export async function criarSolicitacao(dados) {
  const { data } = await api.post('/solicitacoes', dados);
  return data;
}

export async function cancelarSolicitacao(id) {
  const { data } = await api.patch(`/solicitacoes/${id}/cancelar`);
  return data;
}