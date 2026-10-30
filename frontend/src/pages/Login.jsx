import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { extrairMensagemErro } from '../api/client';

export default function Login() {
  const { nome, entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mensagemSucesso = location.state?.mensagem;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Quem já está logado não precisa ver o login
  if (nome) {
    return <Navigate to="/solicitacoes" replace />;
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await entrar(email, senha);
      navigate('/solicitacoes');
    } catch (error) {
      setErro(extrairMensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cartao cartao-estreito">
      <h1>Entrar</h1>

      <form className="formulario" onSubmit={handleSubmit}>
        {mensagemSucesso && !erro && <div className="sucesso">{mensagemSucesso}</div>}
        {erro && <div className="erro">{erro}</div>}

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha}
            onChange={(e) => setSenha(e.target.value)} required />
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="texto-suave">
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}
