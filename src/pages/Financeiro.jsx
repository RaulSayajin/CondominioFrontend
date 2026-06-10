import { useState, useEffect } from "react";
import { 
  CircleDollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Search, 
  Filter, 
  Download,
  Plus,
  Receipt
} from "lucide-react";
import { financeiroService } from "../services/financeiroService"; // Importe a service

export default function Financeiro() {
  const [activeTab, setActiveTab] = useState("contas");
  const [loading, setLoading] = useState(true);
  const [lancamentos, setLancamentos] = useState([]);
  const [resumo, setResumo] = useState({ receitas: 0, despesas: 0, saldo: 0 });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      // Exemplo: buscando lançamentos de um condomínio específico (ex: ID 1)
      // Você pode ajustar isso para vir de um contexto ou filtro de condomínio
      const data = await financeiroService.getCobrancas(1); 
      setLancamentos(data);
      
      // Aqui você calcularia o resumo baseado na resposta da API
      // setResumo(...)
    } catch (err) {
      console.error("Erro ao carregar financeiro:", err);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "contas", label: "Contas a Pagar/Receber", icon: <Wallet size={18} /> },
    { id: "fluxo", label: "Fluxo de Caixa", icon: <ArrowUpCircle size={18} /> },
    { id: "conciliacao", label: "Conciliação", icon: <CircleDollarSign size={18} /> },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão Financeira</h1>
          <p className="text-slate-500">Controle total de receitas, despesas e fluxo de caixa.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold">
            <Download size={18} />
            <span>Exportar</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all">
            <Plus size={18} />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 gap-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all relative ${
              activeTab === tab.id ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
      

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <ArrowUpCircle size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Total Receitas</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{resumo.receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <ArrowDownCircle size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Total Despesas</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{resumo.despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Wallet size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Saldo em Caixa</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{resumo.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
      </div>
      
      {/* LISTAGEM */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Lançamentos Recentes</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-400">Carregando dados...</div>
        ) : lancamentos.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt size={32} className="text-slate-200" />
            </div>
            <p className="font-medium text-slate-600">Nenhum lançamento encontrado</p>
          </div>
        ) : (
          <table className="w-full text-sm">
             {/* Aqui você mapearia lancamentos.map(l => ...) */}
          </table>
        )}
      </div>
    </div>
  );  
}