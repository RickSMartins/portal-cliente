import api from './client';

export async function login(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}

export async function cadastrar(dados) {
  await api.post('/auth/cadastro', dados);
}

export async function logout() {
  await api.post('/auth/logout');
}