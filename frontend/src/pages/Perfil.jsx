import { useEffect, useState } from 'react';
import { atualizarPerfil, obterPerfil } from '../api/perfil';
import { extrairMensagemErro } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { formatarData } from '../utils/labels';

export default function Perfil() {
  const { atualizarNome } = useAuth();

  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ nome: '', telefone: '' });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    let ignorar = false;

    async function carregar() {
      try {
        const dados = await obterPerfil();
        if (!ignorar) {
          setPerfil(dados);
          setForm({ nome: dados.nome, telefone: dados.telefone });
        }
      } catch (error) {
        if (!ignorar) setErro(extrairMensagemErro(error));
      } finally {
        if (!ignorar) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ignorar = true;
    };
  }, []); // array vazio: roda só uma vez, quando a tela abre

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');
    setSucesso('');
    setSalvando(true);

    try {
      const atualizado = await atualizarPerfil(form); // só nome e telefone: o e-mail nunca é enviado
      setPerfil(atualizado);
      atualizarNome(atualizado.nome); // atualiza o "Olá, ..." do cabeçalho
      setSucesso('Dados atualizados com sucesso.');
    } catch (error) {
      setErro(extrairMensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p className="texto-suave">Carregando...</p>;
  if (!perfil) return <div className="erro">{erro}</div>;

  return (
    <div className="cartao">
      <h1>Meu perfil</h1>

      <form className="formulario" onSubmit={handleSubmit}>
        {sucesso && <div className="sucesso">{sucesso}</div>}
        {erro && <div className="erro">{erro}</div>}

        <div className="campo">
          <label htmlFor="email">E-mail (não pode ser alterado)</label>
          <input id="email" value={perfil.email} disabled />
        </div>

        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" value={form.nome}
            onChange={handleChange} maxLength={100} required />
        </div>

        <div className="campo">
          <label htmlFor="telefone">Telefone</label>
          <input id="telefone" name="telefone" value={form.telefone}
            onChange={handleChange} maxLength={20} required />
        </div>

        <p className="texto-suave">Cliente desde {formatarData(perfil.criadoEm)}</p>

        <div>
          <button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
