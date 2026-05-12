import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Condominios from './pages/Condominios';
import CondominioDetalhe from './pages/CondominioDetalhe';
import Financeiro from './pages/Financeiro';
import Contratos from './pages/Contratos';
import Rateio from './pages/Rateio';
import Cobrancas from './pages/Cobrancas';
import Relatorios from './pages/Relatorios';
import GestaoUsuarios from './pages/Usuarios';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-10 h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* Condomínios */}
            <Route path="/condominios" element={<Condominios />} />
            <Route path="/condominios/:id" element={<CondominioDetalhe />} />
            <Route path="/contratos" element={<Contratos />} />
            
            {/* Financeiro */}
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/financeiro/:sub" element={<Financeiro />} />
            
            {/* Outros */}
            <Route path="/rateio" element={<Rateio />} />
            <Route path="/cobrancas" element={<Cobrancas />} />
            <Route path="/cobrancas/:sub" element={<Cobrancas />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/relatorios/:sub" element={<Relatorios />} />
            <Route path="/usuarios" element={<GestaoUsuarios />} />
            <Route path="/usuarios/:sub" element={<GestaoUsuarios />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
