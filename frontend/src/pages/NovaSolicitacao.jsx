import { useState } from 'react';
import { useNavigate } from 'react-router';
import { criarSolicitacao } from '../api/solicitacoes';
import { extrairMensagemErro } from '../api/client';
import { CATEGORIAS, PRIORIDADES } from '../utils/labels';

const FORMULARIO_VAZIO = { titulo: '', descricao: '', categoria: '', prioridade: '' };

export default function NovaSolicitacao() {
  const navigate = useNavigate();

  const [form, setForm] = useState(FORMULARIO_VAZIO);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      const nova = await criarSolicitacao(form);
      navigate(`/solicitacoes/${nova.id}`);
    } catch (error) {
      setErro(extrairMensagemErro(error));
      setEnviando(false);
    }
  }

  return (
    <div className="cartao">
      <h1>Nova solicitação</h1>

      <form className="formulario" onSubmit={handleSubmit}>
        {erro && <div className="erro">{erro}</div>}

        <div className="campo">
          <label htmlFor="titulo">Título</label>
          <input id="titulo" name="titulo" value={form.titulo}
            onChange={handleChange} maxLength={100} required />
        </div>

        <div className="campo">
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" name="descricao" rows={5} value={form.descricao}
            onChange={handleChange} maxLength={2000} required />
        </div>

        <div className="campo">
          <label htmlFor="categoria">Categoria</label>
          <select id="categoria" name="categoria" value={form.categoria} onChange={handleChange} required>
            <option value="">Selecione...</option>
            {Object.entries(CATEGORIAS).map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="prioridade">Prioridade</label>
          <select id="prioridade" name="prioridade" value={form.prioridade} onChange={handleChange} required>
            <option value="">Selecione...</option>
            {Object.entries(PRIORIDADES).map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
        </div>

        <div className="acoes">
          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Abrir solicitação'}
          </button>
          <button type="button" className="botao-secundario" onClick={() => navigate('/solicitacoes')}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
