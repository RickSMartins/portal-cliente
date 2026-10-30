import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { listarSolicitacoes } from '../api/solicitacoes';
import { extrairMensagemErro } from '../api/client';
import { CATEGORIAS, PRIORIDADES, STATUS, formatarData } from '../utils/labels';
import StatusBadge from '../components/StatusBadge';

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [status, setStatus] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Busca a lista quando a tela abre e sempre que o filtro (status) mudar
  useEffect(() => {
    let ignorar = false;

    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const dados = await listarSolicitacoes(status);
        if (!ignorar) setSolicitacoes(dados);
      } catch (error) {
        if (!ignorar) setErro(extrairMensagemErro(error));
      } finally {
        if (!ignorar) setCarregando(false);
      }
    }

    carregar();

    // Limpeza: se o filtro mudar antes da resposta chegar, ignora a resposta antiga
    return () => {
      ignorar = true;
    };
  }, [status]);

  return (
    <div className="cartao">
      <div className="topo-pagina">
        <h1>Minhas solicitações</h1>

        <div className="filtro">
          <label htmlFor="filtro-status">Status:</label>
          <select id="filtro-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(STATUS).map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
        </div>
      </div>

      {erro && <div className="erro">{erro}</div>}

      {carregando ? (
        <p className="texto-suave">Carregando...</p>
      ) : solicitacoes.length === 0 ? (
        <p className="texto-suave">
          Nenhuma solicitação encontrada. <Link to="/solicitacoes/nova">Abrir uma nova</Link>
        </p>
      ) : (
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Criada em</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((s) => (
                <tr key={s.id}>
                  <td><Link to={`/solicitacoes/${s.id}`}>{s.titulo}</Link></td>
                  <td>{CATEGORIAS[s.categoria]}</td>
                  <td>{PRIORIDADES[s.prioridade]}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>{formatarData(s.criadoEm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
