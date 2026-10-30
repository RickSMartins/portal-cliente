import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { cancelarSolicitacao, obterSolicitacao } from '../api/solicitacoes';
import { extrairMensagemErro } from '../api/client';
import { CATEGORIAS, PRIORIDADES, formatarData } from '../utils/labels';
import StatusBadge from '../components/StatusBadge';

export default function DetalheSolicitacao() {
  const { id } = useParams(); // o ":id" da URL

  const [solicitacao, setSolicitacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    let ignorar = false;

    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const dados = await obterSolicitacao(id);
        if (!ignorar) setSolicitacao(dados);
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
  }, [id]);

  async function handleCancelar() {
    if (!window.confirm('Tem certeza que deseja cancelar esta solicitação?')) return;

    setErro('');
    setSucesso('');
    setCancelando(true);

    try {
      const atualizada = await cancelarSolicitacao(id);
      setSolicitacao(atualizada);
      setSucesso('Solicitação cancelada.');
    } catch (error) {
      setErro(extrairMensagemErro(error));
    } finally {
      setCancelando(false);
    }
  }

  if (carregando) return <p className="texto-suave">Carregando...</p>;

  if (!solicitacao) {
    return (
      <div className="cartao">
        <div className="erro">{erro || 'Solicitação não encontrada.'}</div>
        <p><Link to="/solicitacoes">Voltar para a lista</Link></p>
      </div>
    );
  }

  return (
    <div className="cartao">
      <div className="topo-pagina">
        <h1>{solicitacao.titulo}</h1>
        <StatusBadge status={solicitacao.status} />
      </div>

      {sucesso && <div className="sucesso">{sucesso}</div>}
      {erro && <div className="erro">{erro}</div>}

      <dl className="detalhes">
        <dt>Número</dt>
        <dd>#{solicitacao.id}</dd>

        <dt>Descrição</dt>
        <dd>{solicitacao.descricao}</dd>

        <dt>Categoria</dt>
        <dd>{CATEGORIAS[solicitacao.categoria]}</dd>

        <dt>Prioridade</dt>
        <dd>{PRIORIDADES[solicitacao.prioridade]}</dd>

        <dt>Criada em</dt>
        <dd>{formatarData(solicitacao.criadoEm)}</dd>

        <dt>Atualizada em</dt>
        <dd>{formatarData(solicitacao.atualizadoEm)}</dd>
      </dl>

      <div className="acoes">
        {/* O botão só aparece enquanto estiver Aberta; a regra real está na API */}
        {solicitacao.status === 'Aberta' && (
          <button className="botao-perigo" onClick={handleCancelar} disabled={cancelando}>
            {cancelando ? 'Cancelando...' : 'Cancelar solicitação'}
          </button>
        )}
        <Link to="/solicitacoes">Voltar para a lista</Link>
      </div>
    </div>
  );
}
