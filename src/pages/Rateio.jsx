import { useState, useEffect } from 'react';
import {
  Calculator,
  Building2,
  ChevronDown,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  TrendingDown,
  Wallet,
  RefreshCw,
  Calendar,
  BadgeDollarSign
} from 'lucide-react';
import api from '../services/api';

const mesAtual = () => {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  return `${mes}/${hoje.getFullYear()}`;
};

const fmt = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_CONFIG = {
  PAGO: { label: 'Pago', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  PENDENTE: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  VENCIDO: { label: 'Vencido', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  ATRASADO: { label: 'Atrasado', color: 'bg-red-100 text-red-700', icon: AlertCircle }
};

export default function Rateio() {
  const [condominios, setCondominios] = useState([]);
  const [selecionado, setSelecionado] = useState('');
  const [mes, setMes] = useState(mesAtual());
  const [rateio, setRateio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('TODOS');

  useEffect(() => {
    api.get('/condominios').then(res => setCondominios(res.data));
  }, []);

  useEffect(() => {
    if (selecionado && mes) carregarRateio();
  }, [selecionado, mes]);

  const carregarRateio = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/rateio/${selecionado}?mes=${mes}`);
      setRateio(res.data);
    } catch {
      setRateio(null);
    } finally {
      setLoading(false);
    }
  };

  const gerarRateio = async () => {
    if (!selecionado || !mes) return;
    setGerando(true);
    try {
      const res = await api.post(`/rateio/${selecionado}/gerar?mes=${mes}`);
      alert(`✅ Rateio gerado! ${res.data.totalGerado} cobranças de ${fmt(res.data.valorPorUnidade)} cada.`);
      carregarRateio();
    } catch (err) {
      alert('Erro ao gerar rateio: ' + (err.response?.data?.error || err.message));
    } finally {
      setGerando(false);
    }
  };

  const atualizarStatus = async (cobrancaId, novoStatus) => {
    try {
      await api.patch(`/cobrancas/${cobrancaId}/status`, { status: novoStatus });
      carregarRateio();
    } catch {
      alert('Erro ao atualizar status');
    }
  };

  const unidadesFiltradas = rateio?.unidades?.filter(u => {
    const bateBusca =
      u.numeroUnidade?.toLowerCase().includes(busca.toLowerCase()) ||
      u.nomeSacado?.toLowerCase().includes(busca.toLowerCase());

    const status = u.cobranca?.status || 'SEM_COBRANCA';
    const bateStatus = statusFiltro === 'TODOS' ? true : status === statusFiltro;

    return bateBusca && bateStatus;
  }) ?? [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Calculator className="text-blue-600" size={32} />
            Rateio Mensal
          </h1>
          <p className="text-slate-500 font-medium">
            Divisão das despesas do condomínio entre as unidades.
          </p>
        </div>
      </header>

      {/* FILTROS */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 relative">
          <label className="absolute -top-2.5 left-4 px-2 bg-white text-[10px] font-black text-blue-600 uppercase tracking-widest z-10">
            Condomínio
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <select
              className="w-full pl-11 pr-10 h-12 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selecionado}
              onChange={e => setSelecionado(e.target.value)}
            >
              <option value="">Selecione um condomínio...</option>
              {condominios.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="relative min-w-45">
          <label className="absolute -top-2.5 left-4 px-2 bg-white text-[10px] font-black text-blue-600 uppercase tracking-widest z-10">
            Mês de Referência
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="MM/AAAA"
              maxLength={7}
              value={mes}
              onChange={e => setMes(e.target.value)}
              className="w-full pl-11 h-12 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={gerarRateio}
          disabled={!selecionado || !mes || gerando}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold px-6 h-12 rounded-xl transition-colors whitespace-nowrap"
        >
          {gerando
            ? <><RefreshCw size={18} className="animate-spin" /> Gerando...</>
            : <><Play size={18} /> Gerar / Recalcular Rateio</>
          }
        </button>
      </div>

      {!selecionado ? (
        <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calculator className="text-blue-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Selecione um Condomínio</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Escolha o condomínio e o mês para visualizar ou gerar o rateio das despesas entre os condôminos.
          </p>
        </div>
      ) : loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rateio ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI icon={Users} label="Total de Unidades" value={rateio.unidades?.length} color="blue" raw />
            <KPI icon={BadgeDollarSign} label="Valor por Unidade" value={fmt(rateio.unidades?.[0]?.cobranca?.totalBruto)} color="slate" />
            <KPI icon={Wallet} label="Arrecadado" value={fmt(rateio.totalArrecadado)} color="emerald" />
            <KPI icon={TrendingDown} label="Em Aberto" value={fmt(rateio.totalPendente)} color="red" />
          </div>

          {/* TABELA */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-bold text-slate-800">
                Cobranças — {mes}
                <span className="ml-2 text-sm font-medium text-slate-400">
                  ({unidadesFiltradas.length} unidades)
                </span>
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Buscar unidade ou morador..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  className="pl-4 pr-4 h-10 border border-slate-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={statusFiltro}
                  onChange={e => setStatusFiltro(e.target.value)}
                  className="h-10 border border-slate-200 rounded-xl text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TODOS">Todos</option>
                  <option value="PAGO">Pago</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="VENCIDO">Vencido</option>
                  <option value="ATRASADO">Atrasado</option>
                  <option value="SEM_COBRANCA">Sem cobrança</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Condômino</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Condomínio</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Taxa Extra</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {unidadesFiltradas.map(u => {
                    const cob = u.cobranca;
                    const statusCfg = STATUS_CONFIG[cob?.status] ?? STATUS_CONFIG.PENDENTE;
                    const Icon = statusCfg.icon;
                    return (
                      <tr key={u.unidadeId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{u.numeroUnidade}</td>
                        <td className="px-6 py-4 text-slate-600">{u.nomeSacado}</td>
                        <td className="px-6 py-4 text-right text-slate-700">{fmt(cob?.valorCondominio)}</td>
                        <td className="px-6 py-4 text-right text-slate-700">{fmt(cob?.valorTaxaExtra)}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-800">{fmt(cob?.totalBruto)}</td>
                        <td className="px-6 py-4 text-center">
                          {cob ? (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusCfg.color}`}>
                              <Icon size={12} />
                              {statusCfg.label}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Sem cobrança</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {cob && (
                            <select
                              value={cob.status}
                              onChange={e => atualizarStatus(cob.id, e.target.value)}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="PENDENTE">Pendente</option>
                              <option value="PAGO">Pago</option>
                              <option value="VENCIDO">Vencido</option>
                              <option value="ATRASADO">Atrasado</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {unidadesFiltradas.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  <Calculator className="mx-auto mb-3 text-slate-300" size={40} />
                  <p className="font-medium">Nenhuma cobrança encontrada para este mês.</p>
                  <p className="text-sm mt-1">Clique em "Gerar / Recalcular Rateio" para criar as cobranças.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <Calculator className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="font-bold text-slate-700 mb-2">Nenhum rateio gerado para este mês.</p>
          <p className="text-slate-400 text-sm">Cadastre as despesas do mês e clique em "Gerar / Recalcular Rateio".</p>
        </div>
      )}
    </div>
  );
}

function KPI({ icon: Icon, label, value, color, raw }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    slate: 'bg-slate-100 text-slate-600'
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-slate-800">{raw ? value : value}</p>
      </div>
    </div>
  );
}
