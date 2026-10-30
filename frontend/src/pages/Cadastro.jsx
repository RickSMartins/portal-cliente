import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { cadastrar } from '../api/auth';
import { extrairMensagemErro } from '../api/client';

const FORMULARIO_VAZIO = { nome: '', email: '', telefone: '', senha: '' };

export default function Cadastro() {
  const { nome: usuarioLogado } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(FORMULARIO_VAZIO);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (usuarioLogado) {
    return <Navigate to="/solicitacoes" replace />;
  }

  // Um único handler para todos os campos: usa o "name" do input como chave
  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await cadastrar(form);
      navigate('/login', { state: { mensagem: 'Cadastro realizado! Faça login para continuar.' } });
    } catch (error) {
      setErro(extrairMensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cartao cartao-estreito">
      <h1>Criar conta</h1>

      <form className="formulario" onSubmit={handleSubmit}>
        {erro && <div className="erro">{erro}</div>}

        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" value={form.nome}
            onChange={handleChange} maxLength={100} required />
        </div>

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" value={form.email}
            onChange={handleChange} maxLength={150} required />
        </div>

        <div className="campo">
          <label htmlFor="telefone">Telefone</label>
          <input id="telefone" name="telefone" value={form.telefone}
            onChange={handleChange} maxLength={20} placeholder="(11) 98765-4321" required />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" value={form.senha}
            onChange={handleChange} minLength={6} required />
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p className="texto-suave">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
