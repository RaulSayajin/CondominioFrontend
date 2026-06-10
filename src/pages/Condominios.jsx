import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  Building2, 
  Search, 
  MapPin, 
  Home, 
  Plus, 
  Pencil, 
  Trash2,
  ChevronRight,
  Filter
} from "lucide-react";

export default function Condominios() {
  const navigate = useNavigate();
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    carregarCondominios();
  }, []);

  async function carregarCondominios() {
    setLoading(true);
    try {
      const response = await api.get("/condominios");
      setCondominios(response.data);
    } catch (err) {
      console.error("Erro ao carregar condomínios:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = condominios.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cnpj?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Condomínios</h1>
          <p className="text-slate-500">Visualize e gerencie todos os condomínios da rede.</p>
        </div>
        <button 
          onClick={() => navigate("/condominios/novo")}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/10"
        >
          <Plus size={20} />
          <span>Novo Condomínio</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200 text-sm">
          <Filter size={18} />
          <span>Filtros</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white h-48 rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((condo) => (
            <div 
              key={condo.id}
              onClick={() => navigate(`/condominios/${condo.id}`)}
              className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Building2 size={24} />
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                {condo.nome}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPin size={14} />
                  <span className="truncate">{condo.endereco || "Endereço não informado"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Home size={14} />
                  <span>{condo.unidadesCount || 0} Unidades</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CNPJ: {condo.cnpj || "---"}</span>
                <div className="flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver Detalhes
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}