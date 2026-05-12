import { useState } from "react";
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

export default function Financeiro() {
  const [activeTab, setActiveTab] = useState("contas");

  const tabs = [
    { id: "contas", label: "Contas a Pagar/Receber", icon: <Wallet size={18} /> },
    { id: "fluxo", label: "Fluxo de Caixa", icon: <ArrowUpCircle size={18} /> },
    { id: "conciliacao", label: "Conciliação", icon: <CircleDollarSign size={18} /> },
  ];

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <ArrowUpCircle size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Total Receitas</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">R$ 45.230,00</p>
          <p className="text-xs text-slate-500 mt-1">+12% em relação ao mês anterior</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <ArrowDownCircle size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Total Despesas</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">R$ 38.150,00</p>
          <p className="text-xs text-slate-500 mt-1">-5% em relação ao mês anterior</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Wallet size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Saldo em Caixa</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">R$ 7.080,00</p>
          <p className="text-xs text-slate-500 mt-1">Estimado no período</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Lançamentos Recentes</h2>
          <div className="flex gap-2">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-200">
              <Filter size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-8 text-center text-slate-400">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt size={32} className="text-slate-200" />
          </div>
          <p className="font-medium text-slate-600">Nenhum lançamento encontrado</p>
          <p className="text-sm">Tente ajustar seus filtros para encontrar o que procura.</p>
        </div>
      </div>
    </div>
  );
}