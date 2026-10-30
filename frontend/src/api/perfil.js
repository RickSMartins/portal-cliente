import api from './client';

export async function obterPerfil() {
  const { data } = await api.get('/perfil');
  return data;
}

export async function atualizarPerfil(dados) {
  const { data } = await api.put('/perfil', dados);
  return data;
}