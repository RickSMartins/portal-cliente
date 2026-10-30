import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import RotaPrivada from './components/RotaPrivada';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

function EmConstrucao({ titulo }) {
  return <h1>{titulo} (em construção)</h1>;
}

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rotas privadas: só com login, e todas dentro do Layout */}
      <Route element={<RotaPrivada />}>
        <Route element={<Layout />}>
          <Route path="/solicitacoes" element={<EmConstrucao titulo="Minhas solicitações" />} />
          <Route path="/solicitacoes/nova" element={<EmConstrucao titulo="Nova solicitação" />} />
          <Route path="/perfil" element={<EmConstrucao titulo="Meu perfil" />} />
        </Route>
      </Route>

      {/* Qualquer outro endereço vai para a lista */}
      <Route path="*" element={<Navigate to="/solicitacoes" replace />} />
    </Routes>
  );
}
