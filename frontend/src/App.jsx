import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import RotaPrivada from './components/RotaPrivada';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Solicitacoes from './pages/Solicitacoes';
import NovaSolicitacao from './pages/NovaSolicitacao';
import DetalheSolicitacao from './pages/DetalheSolicitacao';
import Perfil from './pages/Perfil';

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rotas privadas: só com login, e todas dentro do Layout */}
      <Route element={<RotaPrivada />}>
        <Route element={<Layout />}>
          <Route path="/solicitacoes" element={<Solicitacoes />} />
          <Route path="/solicitacoes/nova" element={<NovaSolicitacao />} />
          <Route path="/solicitacoes/:id" element={<DetalheSolicitacao />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Route>

      {/* Qualquer outro endereço vai para a lista */}
      <Route path="*" element={<Navigate to="/solicitacoes" replace />} />
    </Routes>
  );
}
