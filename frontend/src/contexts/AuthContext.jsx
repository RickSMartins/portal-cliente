import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Estado: o nome de quem está logado (ou null). Começa com o que estiver salvo.
  const [nome, setNome] = useState(() => localStorage.getItem('nome'));

  async function entrar(email, senha) {
    const resposta = await authApi.login(email, senha); // a API grava o cookie HttpOnly
    localStorage.setItem('nome', resposta.nome);
    setNome(resposta.nome);
  }

  async function sair() {
    try {
      await authApi.logout(); // a API apaga o cookie
    } finally {
      localStorage.removeItem('nome');
      setNome(null);
    }
  }

  // Usado pelo Perfil quando o cliente troca o nome
  function atualizarNome(novoNome) {
    localStorage.setItem('nome', novoNome);
    setNome(novoNome);
  }

  return (
    <AuthContext.Provider value={{ nome, entrar, sair, atualizarNome }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook próprio: qualquer componente chama useAuth() para saber quem está logado
export function useAuth() {
  return useContext(AuthContext);
}
