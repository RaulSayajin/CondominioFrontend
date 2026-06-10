import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  CircleDollarSign, 
  Receipt, 
  BarChart3, 
  ClipboardList, 
  Users,
  Calculator,
  Menu, 
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const menuGroups = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { 
    label: 'Gestão de Condomínios', 
    icon: <Building2 size={20} />,
    items: [
      { to: '/condominios', label: 'Lista de Condomínios' },
      { to: '/condominios/novo', label: 'Cadastrar Condomínio' },
      { to: '/contratos', label: 'Contratos e Taxas' },
    ]
  },
  { 
    label: 'Gestão Financeira', 
    icon: <CircleDollarSign size={20} />,
    items: [
      { to: '/financeiro', label: 'Contas a Pagar/Receber' },
      { to: '/financeiro/fluxo', label: 'Fluxo de Caixa' },
      { to: '/financeiro/conciliacao', label: 'Conciliação Bancária' },
    ]
  },
  { 
    label: 'Cobranças', 
    icon: <Receipt size={20} />,
    items: [
      { to: '/cobrancas/gerar', label: 'Gerar Boletos/PIX' },
      { to: '/cobrancas/lote', label: 'Emissão em Lote' },
      { to: '/cobrancas/acordos', label: 'Acordos e 2ª Via' },
    ]
  },
  { 
    label: 'Relatórios & BI', 
    icon: <ClipboardList size={20} />,
    items: [
      { to: '/relatorios', label: 'DRE & Resultados' },
      { to: '/relatorios/inadimplencia', label: 'Estatísticas de Inadimplência' },
      { to: '/relatorios/balancete', label: 'Balancete Analítico' },
    ]
  },
  { 
    label: 'Gestão de Usuários', 
    icon: <Users size={20} />,
    items: [
      { to: '/usuarios/sindicos', label: 'Síndicos' },
      { to: '/usuarios/auxiliares', label: 'Auxiliares' },
      { to: '/usuarios/permissoes', label: 'Permissões' },
    ]
  },
];

function NavItem({ to, label, icon, items, isOpen, onToggle, mobileClose }) {
  const hasSubmenu = items && items.length > 0;
  
  const handleClick = (e) => {
    if (hasSubmenu) {
      e.preventDefault();
      onToggle();
    } else {
      mobileClose();
    }
  };

  if (!hasSubmenu) {
    return (
      <NavLink
        to={to}
        end={to === '/'}
        onClick={mobileClose}
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-blue-600 shadow-lg shadow-blue-900/20 text-white translate-x-1'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          isOpen ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-4">
          {icon}
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {isOpen && (
        <div className="ml-10 space-y-1 border-l border-slate-700 pl-4 mt-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={mobileClose}
              className={({ isActive }) =>
                `block py-2 text-sm transition-colors ${
                  isActive ? 'text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (label) => {
    setOpenGroup(openGroup === label ? null : label);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-slate-900 text-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">C</div>
          <span className="font-bold uppercase tracking-wider text-xs">Admin Master</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 hidden lg:flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">C</div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Condomínio
            </h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Admin Master</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <NavItem
              key={group.label}
              {...group}
              isOpen={openGroup === group.label}
              onToggle={() => toggleGroup(group.label)}
              mobileClose={() => setIsOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 m-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              AD
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Usuário</p>
              <p className="text-sm font-semibold truncate w-32">Administrador</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
