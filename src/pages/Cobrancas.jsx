import { useState } from 'react';
import { 
  Receipt, 
  QrCode, 
  Layers, 
  HelpCircle, 
  Plus, 
  FileText, 
  ArrowRight,
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

export default function Cobrancas() {
  const [activeTab, setActiveTab] = useState('lista');

  const tabs = [
    { id: 'lista', label: 'Lista de Cobranças', icon: <Receipt size={18} /> },
    { id: 'acordos', label: 'Acordos & Inadimplência', icon: <FileText size={18} /> },
    { id: 'historico', label: 'Histórico de Emissões', icon: <History size={18} /> },
  ];

  const statusMap = {
    PAGO: { color: "text-emerald-600 bg-emerald-50", icon: <CheckCircle2 size={14} />, label: "Pago" },
    PENDENTE: { color: "text-amber-600 bg-amber-50", icon: <Clock size={14} />, label: "Pendente" },
    ATRASADO: { color: "text-red-600 bg-red-50", icon: <AlertCircle size={14} />, label: "Atrasado" },
  };

  const cobrancas = [
    { id: 1, unidade: "Bloco A - 101", morador: "Carlos Silva", vencimento: "10/05/2026", valor: 324.81, status: "PAGO" },
    { id: 2, unidade: "Bloco A - 102", morador: "Ana Oliveira", vencimento: "10/05/2026", valor: 324.81, status: "PENDENTE" },
    { id: 3, unidade: "Bloco B - 205", morador: "Roberto Santos", vencimento: "10/04/2026", valor: 450.00, status: "ATRASADO" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cobranças</h1>
          <p className="text-slate-500">Emissão de boletos, PIX e gestão de acordos.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold">
            <Layers size={18} />
            <span>Gerar Lote</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-sm">
            <QrCode size={18} />
            <span>Novo PIX</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm font-semibold whitespace-nowrap transition-all relative ${
              activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
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

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por unidade ou morador..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
            <Filter size={16} />
            <span>Filtros</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                <th className="px-6 py-4">Unidade / Morador</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cobrancas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{item.unidade}</div>
                    <div className="text-xs text-slate-400">{item.morador}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.vencimento}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">R$ {item.valor.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusMap[item.status].color}`}>
                      {statusMap[item.status].icon}
                      {statusMap[item.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver PIX">
                        <QrCode size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <HelpCircle size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Dica de Gestão</h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            Você pode configurar o envio automático de cobranças via e-mail e WhatsApp nas configurações de cada condomínio. Isso reduz significativamente a inadimplência.
          </p>
        </div>
      </div>
    </div>
  );
}