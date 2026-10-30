import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Depois de cada resposta: se a sessão expirou (401), desloga
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('nome')) {
      localStorage.removeItem('nome');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Transforma qualquer erro da API numa mensagem legível
export function extrairMensagemErro(error) {
  const data = error.response?.data;

  if (data?.mensagem) return data.mensagem;
  if (data?.errors) return Object.values(data.errors).flat().join(' ');

  return 'Não foi possível conectar ao servidor.';
}

export default api;