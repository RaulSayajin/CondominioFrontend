import { useState } from "react";
import { 
  FilePieChart, 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from "lucide-react";

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("Mensal");

  const cards = [
    { title: "Margem de Contribuição", value: "34.2%", icon: <TrendingUp className="text-emerald-500" />, trend: "+2.1%" },
    { title: "Ticket Médio", value: "R$ 380,00", icon: <BarChart3 className="text-blue-500" />, trend: "-R$ 15" },
    { title: "Taxa de Inadimplência", value: "12.5%", icon: <ArrowDownRight className="text-red-500" />, trend: "-3%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Relatórios & BI</h1>
          <p className="text-slate-500">Análise de desempenho e saúde financeira da administradora.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {["Mensal", "Trimestral", "Anual"].map((t) => (
              <button
                key={t}
                onClick={() => setPeriodo(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  periodo === t ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition-all">
            <Download size={18} />
            <span className="text-sm">Gerar PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-slate-50 rounded-xl">{card.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${card.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {card.trend}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{card.title}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800">DRE Simplificado</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline">Ver Detalhado</button>
          </div>
          <div className="space-y-4">
            {[
              { label: "Receita Operacional Bruta", value: "R$ 450.230,00", bold: true },
              { label: "(-) Impostos e Deduções", value: "R$ (42.150,00)", color: "text-red-500" },
              { label: "Receita Líquida", value: "R$ 408.080,00", bold: true },
              { label: "(-) Custos Operacionais", value: "R$ (120.300,00)", color: "text-red-500" },
              { label: "Lucro Bruto", value: "R$ 287.780,00", bold: true, highlight: "bg-slate-50" },
              { label: "(-) Despesas Administrativas", value: "R$ (95.000,00)", color: "text-red-500" },
            ].map((row, i) => (
              <div key={i} className={`flex justify-between items-center p-2 rounded-lg ${row.highlight || ''}`}>
                <span className={`text-sm ${row.bold ? 'font-bold text-slate-700' : 'text-slate-500'}`}>{row.label}</span>
                <span className={`text-sm font-mono ${row.color || 'text-slate-900'} ${row.bold ? 'font-bold' : ''}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800">Inadimplência por Condomínio</h2>
            <Filter size={18} className="text-slate-400 cursor-pointer" />
          </div>
          <div className="space-y-6">
            {[
              { nome: "Condomínio Dom Bosco", per: 85, color: "bg-blue-500", valor: "R$ 8.240" },
              { nome: "Residencial Flor de Liz", per: 42, color: "bg-amber-500", valor: "R$ 15.100" },
              { nome: "Edifício Central", per: 15, color: "bg-emerald-500", valor: "R$ 2.300" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-600">{item.nome}</span>
                  <span className="text-slate-400">{item.valor}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.per}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50">
            <button className="flex items-center justify-center w-full gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
              Acessar Módulo BI Completo
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}