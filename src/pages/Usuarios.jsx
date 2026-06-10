import { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  MoreVertical, 
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Shield,
  Building2
} from 'lucide-react';

export default function GestaoUsuarios() {
  const [activeTab, setActiveTab] = useState('todos');

  const users = [
    { id: 1, nome: "Raul Ferreira", email: "raul@fatec.edu.br", role: "ADMIN_MASTER", status: "ATIVO", condominio: "Todos" },
    { id: 2, nome: "Marcos Síndico", email: "marcos@bosco.com", role: "SINDICO", status: "ATIVO", condominio: "Dom Bosco" },
    { id: 3, nome: "Juliana Auxiliar", email: "juliana@admin.com", role: "AUXILIAR", status: "INATIVO", condominio: "Todos" },
  ];

  const roleStyles = {
    ADMIN_MASTER: "bg-purple-50 text-purple-600 border-purple-100",
    SINDICO: "bg-blue-50 text-blue-600 border-blue-100",
    AUXILIAR: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuários & Permissões</h1>
          <p className="text-slate-500">Controle quem pode acessar os módulos do sistema.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-sm">
          <UserPlus size={18} />
          <span>Convidar Usuário</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total de Usuários", value: "24", icon: <Users className="text-blue-600" /> },
          { label: "Admins Master", value: "3", icon: <Shield className="text-purple-600" /> },
          { label: "Convites Pendentes", value: "5", icon: <ShieldCheck className="text-amber-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex bg-slate-200 p-1 rounded-lg self-start">
             {["todos", "admins", "sindicos"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveTab(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all capitalize ${
                  activeTab === f ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar usuário..." 
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <button className="p-2 text-slate-500 bg-white hover:bg-slate-50 rounded-xl border border-slate-200">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Função / Role</th>
                <th className="px-6 py-4">Condomínio</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                        {user.nome.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-700">{user.nome}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border capitalize ${roleStyles[user.role]}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 size={14} className="text-slate-400" />
                      {user.condominio}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${user.status === 'ATIVO' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {user.status === 'ATIVO' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}