import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { nome, sair } = useAuth();
  const navigate = useNavigate();

  async function handleSair() {
    await sair();
    navigate('/login');
  }

  return (
    <>
      <header className="cabecalho">
        <strong>Portal do Cliente · TechServ</strong>

        <nav>
          <NavLink to="/solicitacoes" end>Minhas solicitações</NavLink>
          <NavLink to="/solicitacoes/nova">Nova solicitação</NavLink>
          <NavLink to="/perfil">Meu perfil</NavLink>
        </nav>

        <div className="usuario">
          <span>Olá, {nome}</span>
          <button className="botao-secundario" onClick={handleSair}>Sair</button>
        </div>
      </header>

      <main className="conteudo">
        <Outlet />
      </main>
    </>
  );
}
