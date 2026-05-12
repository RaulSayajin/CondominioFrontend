import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Building, 
  Plus, 
  ArrowLeft, 
  Home, 
  User, 
  Mail, 
  Hash,
  Search,
  LayoutGrid,
  List,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_FORM = { numero: '', bloco: '', proprietario: '', emailProprietario: '' };

export default function Unidades() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [condominio, setCondominio] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [resCondo, resUnidades] = await Promise.all([
          api.get(`/condominios`),
          api.get(`/condominios/${id}/unidades`)
        ]);
        const found = resCondo.data.find(c => c.id === Number(id));
        setCondominio(found);
        setUnidades(resUnidades.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  function handleEdit(unidade) {
    const u = {
      ...unidade,
      numero: unidade.numero || unidade.numeroUnidade,
      proprietario: unidade.proprietario || unidade.nomeSacado
    };
    
    setForm({
      numero: u.numero,
      bloco: u.bloco || '',
      proprietario: u.proprietario,
      emailProprietario: u.emailProprietario || ''
    });
    setEditingId(u.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      numeroUnidade: form.numero,
      nomeSacado: form.proprietario
    };

    if (editingId) {
      api.put(`/unidades/${editingId}`, payload)
        .then(res => {
          setUnidades(unidades.map(u => u.id === editingId ? { 
            ...u, 
            ...res.data, 
            numero: res.data.numeroUnidade, 
            proprietario: res.data.nomeSacado 
          } : u));
          setForm(EMPTY_FORM);
          setShowForm(false);
          setEditingId(null);
        })
        .catch(err => alert('Erro ao atualizar: ' + err.message));
    } else {
      api.post(`/condominios/${id}/unidades`, payload)
        .then(res => {
          const novaUnidade = {
            ...res.data,
            numero: res.data.numeroUnidade,
            proprietario: res.data.nomeSacado
          };
          setUnidades([...unidades, novaUnidade]);
          setForm(EMPTY_FORM);
          setShowForm(false);
        })
        .catch(err => alert('Erro: ' + err.message));
    }
  }

  function handleDelete(unidadeId) {
    if (window.confirm('Deseja excluir esta unidade?')) {
      api.delete(`/unidades/${unidadeId}`)
        .then(() => {
          setUnidades(unidades.filter(u => u.id !== unidadeId));
        })
        .catch(err => alert('Erro ao excluir: ' + err.message));
    }
  }

  const filteredUnidades = unidades.map(u => ({
    ...u,
    // Garante que o frontend entenda os nomes vindo do banco
    numero: u.numero || u.numeroUnidade,
    proprietario: u.proprietario || u.nomeSacado
  })).filter(u => 
    u.numero?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.proprietario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.bloco?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Carregando detalhes do condomínio...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Informações do Condomínio (Cabeçalho Premium) */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50" />
        
        <div className="relative space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/condominios')}
                className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                Portfólio de Condomínios
              </button>
              
              <div className="space-y-1">
                <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  {condominio?.nome}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><Hash size={14} className="text-blue-500" /> {condominio?.cnpj}</span>
                  <span className="flex items-center gap-1.5"><Home size={14} className="text-blue-500" /> {unidades.length} Unidades</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 w-fit px-4 py-2 rounded-xl text-sm italic">
                <Building size={16} className="text-slate-400" />
                {condominio?.endereco || 'Endereço não informado'}
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 decoration-blue-200 underline underline-offset-4">Honorário Mensal</p>
                <p className="text-2xl font-black italic">
                  {Number(condominio?.honorarioMensal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center justify-between">
                <span className="text-emerald-700 text-xs font-bold uppercase">Taxa Garantidora</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-xs font-black italic">{condominio?.percentualGarantidora}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Unidades */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Unidades Cadastradas</h3>
          <p className="text-sm text-slate-500 font-medium">Gerenciamento de moradores e blocos</p>
        </div>

        <div className="flex items-center gap-2">
           <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setForm(EMPTY_FORM);
                setEditingId(null);
              }
            }}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm w-full sm:w-auto ${
              showForm 
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                : 'bg-slate-900 text-white hover:bg-black'
            }`}
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? (editingId ? 'Cancelar Edição' : 'Fechar Cadastro') : 'Nova Unidade'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit} 
            className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="md:col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Número</label>
              <div className="relative">
                <Hash className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input required placeholder="101" className="input pl-11" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Bloco / Torre</label>
              <input placeholder="Ex: Torre A" className="input" value={form.bloco} onChange={e => setForm({ ...form, bloco: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Proprietário Principal</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input required placeholder="Nome completo" className="input pl-11" value={form.proprietario} onChange={e => setForm({ ...form, proprietario: e.target.value })} />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">E-mail de Contato</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input type="email" placeholder="email@exemplo.com" className="input pl-11" value={form.emailProprietario} onChange={e => setForm({ ...form, emailProprietario: e.target.value })} />
              </div>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-blue-600 text-white h-[42px] rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                {editingId ? 'Atualizar Unidade' : 'Salvar Unidade'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="relative w-full max-w-md">
           <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Buscar por apto, bloco ou nome..." 
             className="w-full bg-slate-100/50 border-none rounded-2xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl ml-4">
           <button 
             onClick={() => setView('grid')}
             className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
           >
             <LayoutGrid className="w-4 h-4" />
           </button>
           <button 
             onClick={() => setView('list')}
             className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
           >
             <List className="w-4 h-4" />
           </button>
        </div>
      </div>

      {filteredUnidades.length === 0 ? (
        <div className="p-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
           <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-bold italic">Nenhuma unidade encontrada.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUnidades.map((u, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={u.id} 
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {u.numero}
                </div>
                {u.bloco && <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{u.bloco}</span>}
              </div>
              <h4 className="font-black text-slate-800 text-lg mb-1 truncate">{u.proprietario}</h4>
              <p className="text-slate-400 text-xs font-medium flex items-center gap-2 mb-4">
                <Mail className="w-3 h-3" /> {u.emailProprietario || 'Sem e-mail'}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(u)}
                  className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(u.id)}
                  className="px-3 bg-slate-50 text-slate-600 py-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Unidade</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Proprietário</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUnidades.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-black text-slate-800">Apto {u.numero}</span>
                    {u.bloco && <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase">Bloco {u.bloco}</span>}
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-700">{u.proprietario}</div>
                    <div className="text-xs text-slate-400">{u.emailProprietario}</div>
                  </td>
                  <td className="px-8 py-5 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(u)}
                      className="text-blue-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-50 rounded-lg"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(u.id)}
                      className="text-rose-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-rose-50 rounded-lg"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
