import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowLeft, Building, Users, Receipt, Plus, X,
  Pencil, Trash2, Home, User, ToggleLeft, ToggleRight, DollarSign, MapPin, FileText, Percent
} from 'lucide-react';

const EMPTY_UNIDADE = { numero: '', proprietario: '' };
const EMPTY_IMPOSTO = { descricao: '', valor: '' };
const EMPTY_CONDOMINIO = { nome: '', cnpj: '', endereco: '', percentualGarantidora: '', honorarioMensal: '' };

const fmt = v =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CondominioDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [condominio, setCondominio] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [cobrancasRecorrentes, setCobrancasRecorrentes] = useState([]);
  const [aba, setAba] = useState('moradores');
  const [loading, setLoading] = useState(true);

  // Formulários
  const [formCondominio, setFormCondominio] = useState(EMPTY_CONDOMINIO);
  const [formUnidade, setFormUnidade] = useState(EMPTY_UNIDADE);
  const [editandoUnidade, setEditandoUnidade] = useState(null);
  const [showFormUnidade, setShowFormUnidade] = useState(false);

  const [formRecorrencia, setFormRecorrencia] = useState(EMPTY_IMPOSTO);
  const [editandoRecorrencia, setEditandoRecorrencia] = useState(null);
  const [showFormRecorrencia, setShowFormRecorrencia] = useState(false);

  useEffect(() => { carregar(); }, [id]);

  async function carregar() {
    // 🛑 TRAVA DE SEGURANÇA: Se for a rota de criação, não busca no banco!
    if (id === 'novo') {
      setCondominio(null);
      setUnidades([]);
      setCobrancasRecorrentes([]);
      setFormCondominio(EMPTY_CONDOMINIO);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [resCondos, resUnidades, resRecorrencias] = await Promise.all([
        api.get('/condominios'),
        api.get(`/condominios/${id}/unidades`),
        api.get(`/condominios/${id}/cobrancas-recorrentes`)
      ]);
      setCondominio(resCondos.data.find(c => c.id === Number(id)));
      setUnidades(resUnidades.data);
      setCobrancasRecorrentes(resRecorrencias.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ── GESTÃO DO CONDOMÍNIO (CRIAR NOVO) ────────────────────────────────────
  async function salvarNovoCondominio(e) {
    e.preventDefault();
    try {
      const payload = {
        ...formCondominio,
        percentualGarantidora: Number(formCondominio.percentualGarantidora),
        honorarioMensal: Number(formCondominio.honorarioMensal)
      };
      
      const response = await api.post('/condominios', payload);
      
      // Redireciona para a tela do condomínio recém-criado
      navigate(`/condominios/${response.data.id}`, { replace: true });
    } catch (err) {
      alert('Erro ao criar condomínio: ' + (err.response?.data?.error || err.message));
    }
  }

  // ── MORADORES ────────────────────────────────────────────────────────────
  function abrirFormUnidade(unidade = null) {
    if (unidade) {
      setFormUnidade({
        numero: unidade.numeroUnidade || unidade.numero || '',
        proprietario: unidade.nomeSacado || unidade.proprietario || ''
      });
      setEditandoUnidade(unidade.id);
    } else {
      setFormUnidade(EMPTY_UNIDADE);
      setEditandoUnidade(null);
    }
    setShowFormUnidade(true);
  }

  async function salvarUnidade(e) {
    e.preventDefault();
    const payload = { numeroUnidade: formUnidade.numero, nomeSacado: formUnidade.proprietario };
    try {
      if (editandoUnidade) {
        await api.put(`/unidades/${editandoUnidade}`, payload);
      } else {
        await api.post(`/condominios/${id}/unidades`, payload);
      }
      setShowFormUnidade(false);
      setFormUnidade(EMPTY_UNIDADE);
      setEditandoUnidade(null);
      carregar();
    } catch (err) {
      alert('Erro ao salvar morador: ' + err.message);
    }
  }

  async function excluirUnidade(unidadeId) {
    if (!window.confirm('Deseja excluir esta unidade?')) return;
    try {
      await api.delete(`/unidades/${unidadeId}`);
      setUnidades(unidades.filter(u => u.id !== unidadeId));
    } catch (err) {
      alert('Erro ao excluir: ' + err.message);
    }
  }

  // ── COBRANÇAS RECORRENTES ────────────────────────────────────────────────
  function abrirFormRecorrencia(recorrencia = null) {
    if (recorrencia) {
      setFormRecorrencia({ descricao: recorrencia.descricao, valor: recorrencia.valor });
      setEditandoRecorrencia(recorrencia.id);
    } else {
      setFormRecorrencia(EMPTY_IMPOSTO);
      setEditandoRecorrencia(null);
    }
    setShowFormRecorrencia(true);
  }

  async function salvarRecorrencia(e) {
    e.preventDefault();
    const payload = { descricao: formRecorrencia.descricao, valor: Number(formRecorrencia.valor) };
    try {
      if (editandoRecorrencia) {
        await api.put(`/cobrancas-recorrentes/${editandoRecorrencia}`, payload);
      } else {
        await api.post(`/condominios/${id}/cobrancas-recorrentes`, payload);
      }
      setShowFormRecorrencia(false);
      setFormRecorrencia(EMPTY_IMPOSTO);
      setEditandoRecorrencia(null);
      carregar();
    } catch (err) {
      alert('Erro ao salvar cobrança recorrente: ' + err.message);
    }
  }

  async function excluirRecorrencia(recorrenciaId) {
    if (!window.confirm('Deseja excluir esta cobrança recorrente?')) return;
    try {
      await api.delete(`/cobrancas-recorrentes/${recorrenciaId}`);
      setCobrancasRecorrentes(cobrancasRecorrentes.filter(i => i.id !== recorrenciaId));
    } catch (err) {
      alert('Erro ao excluir: ' + err.message);
    }
  }

  async function toggleAtivo(recorrencia) {
    try {
      await api.put(`/cobrancas-recorrentes/${recorrencia.id}`, { ativo: !recorrencia.ativo });
      carregar();
    } catch (err) {
      alert('Erro ao atualizar: ' + err.message);
    }
  }

  const totalRecorrenciasMensais = cobrancasRecorrentes
    .filter(i => i.ativo)
    .reduce((acc, i) => acc + Number(i.valor), 0);

  // ── RENDERIZAÇÃO: CARREGANDO ─────────────────────────────────────────────
  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Carregando detalhes...</p>
    </div>
  );

  // ── RENDERIZAÇÃO: NOVO CONDOMÍNIO ────────────────────────────────────────
  if (id === 'novo') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <button
          onClick={() => navigate('/condominios')}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para condomínios
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Building size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Novo Condomínio</h1>
              <p className="text-slate-500">Cadastre as informações base do novo cliente.</p>
            </div>
          </div>

          <form onSubmit={salvarNovoCondominio} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Building size={14} /> Nome do Condomínio
                </label>
                <input
                  required
                  placeholder="Ex: Condomínio Residencial Dom Bosco"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                  value={formCondominio.nome}
                  onChange={e => setFormCondominio({ ...formCondominio, nome: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText size={14} /> CNPJ
                </label>
                <input
                  required
                  placeholder="00.000.000/0000-00"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                  value={formCondominio.cnpj}
                  onChange={e => setFormCondominio({ ...formCondominio, cnpj: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin size={14} /> Endereço Completo
                </label>
                <input
                  required
                  placeholder="Rua Exemplo, 123 - Bairro"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                  value={formCondominio.endereco}
                  onChange={e => setFormCondominio({ ...formCondominio, endereco: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Percent size={14} /> Taxa da Garantidora (%)
                </label>
                <input
                  required
                  type="number" step="0.01" min="0" max="100"
                  placeholder="Ex: 5"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                  value={formCondominio.percentualGarantidora}
                  onChange={e => setFormCondominio({ ...formCondominio, percentualGarantidora: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <DollarSign size={14} /> Honorário Mensal (R$)
                </label>
                <input
                  required
                  type="number" step="0.01" min="0"
                  placeholder="Ex: 1500,00"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                  value={formCondominio.honorarioMensal}
                  onChange={e => setFormCondominio({ ...formCondominio, honorarioMensal: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/condominios')}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                Criar Condomínio
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── RENDERIZAÇÃO: DETALHES DE CONDOMÍNIO EXISTENTE ───────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* HEADER */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <button
          onClick={() => navigate('/condominios')}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para condomínios
        </button>

        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <Building className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">{condominio?.nome}</h1>
              <p className="text-slate-400 text-sm font-medium">{condominio?.cnpj} · {condominio?.endereco}</p>
            </div>
          </div>

          <div className="flex gap-4 text-center">
            <div className="bg-slate-50 rounded-2xl px-5 py-3">
              <p className="text-2xl font-black text-slate-800">{unidades.length}</p>
              <p className="text-xs text-slate-500 font-medium">Unidades</p>
            </div>
            <div className="bg-blue-50 rounded-2xl px-5 py-3">
              <p className="text-2xl font-black text-blue-700">{fmt(totalRecorrenciasMensais)}</p>
              <p className="text-xs text-slate-500 font-medium">Recorrências/mês</p>
            </div>
          </div>
        </div>
      </div>

      {/* ABAS */}
      <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 w-fit">
        {[
          { key: 'moradores', label: 'Moradores', icon: Users, count: unidades.length },
          { key: 'recorrencias', label: 'Cobranças Recorrentes', icon: Receipt, count: cobrancasRecorrentes.length }
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              aba === key
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Icon size={16} />
            {label}
            <span className={`px-1.5 py-0.5 rounded-md text-xs font-black ${
              aba === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* ── ABA: MORADORES ─────────────────────────────────────────────────── */}
      {aba === 'moradores' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-700 text-lg">Unidades e Moradores</h2>
            <button
              onClick={() => { setShowFormUnidade(!showFormUnidade); setEditandoUnidade(null); setFormUnidade(EMPTY_UNIDADE); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                showFormUnidade
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
              }`}
            >
              {showFormUnidade ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nova Unidade</>}
            </button>
          </div>

          {showFormUnidade && (
            <form onSubmit={salvarUnidade} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-4">{editandoUnidade ? 'Editar Unidade' : 'Cadastrar Unidade'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Home size={12} /> Número da Unidade
                  </label>
                  <input
                    required placeholder="Ex: 0101"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formUnidade.numero}
                    onChange={e => setFormUnidade({ ...formUnidade, numero: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <User size={12} /> Nome do Condômino
                  </label>
                  <input
                    required placeholder="Ex: João da Silva"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formUnidade.proprietario}
                    onChange={e => setFormUnidade({ ...formUnidade, proprietario: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowFormUnidade(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700">
                  {editandoUnidade ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          )}

          {unidades.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
              <Home className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-500 font-medium">Nenhuma unidade cadastrada.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Condômino</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {unidades.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {u.numeroUnidade || u.numero}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{u.nomeSacado || u.proprietario}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirFormUnidade(u)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => excluirUnidade(u.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ABA: COBRANÇAS RECORRENTES ─────────────────────────────────────── */}
      {aba === 'recorrencias' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-slate-700 text-lg">Cobranças Recorrentes</h2>
              <p className="text-slate-400 text-sm">Taxas fixas mensais que serão base para o rateio.</p>
            </div>
            <button
              onClick={() => { setShowFormRecorrencia(!showFormRecorrencia); setEditandoRecorrencia(null); setFormRecorrencia(EMPTY_IMPOSTO); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                showFormRecorrencia
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
              }`}
            >
              {showFormRecorrencia ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nova Recorrência</>}
            </button>
          </div>

          {showFormRecorrencia && (
            <form onSubmit={salvarRecorrencia} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-4">{editandoRecorrencia ? 'Editar Recorrência' : 'Cadastrar Cobrança Recorrente'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Descrição</label>
                  <input
                    required placeholder="Ex: CPFL - Energia Elétrica"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formRecorrencia.descricao}
                    onChange={e => setFormRecorrencia({ ...formRecorrencia, descricao: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <DollarSign size={12} /> Valor Mensal (R$)
                  </label>
                  <input
                    required type="number" step="0.01" min="0" placeholder="0,00"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formRecorrencia.valor}
                    onChange={e => setFormRecorrencia({ ...formRecorrencia, valor: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowFormRecorrencia(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700">
                  {editandoRecorrencia ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          )}

          {/* Totalizador */}
          {cobrancasRecorrentes.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Mensal Estimado (ativos)</p>
                <p className="text-2xl font-black text-blue-800">{fmt(totalRecorrenciasMensais)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Por unidade ({unidades.length} unid.)</p>
                <p className="text-lg font-bold text-slate-700">
                  {unidades.length > 0 ? fmt(totalRecorrenciasMensais / unidades.length) : '–'}
                </p>
              </div>
            </div>
          )}

          {cobrancasRecorrentes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
              <Receipt className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-500 font-medium">Nenhuma cobrança recorrente cadastrada.</p>
              <p className="text-slate-400 text-sm mt-1">Adicione taxas fixas como portaria, energia, etc.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Valor Mensal</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cobrancasRecorrentes.map(i => (
                    <tr key={i.id} className={`hover:bg-slate-50 transition-colors ${!i.ativo ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4 font-medium text-slate-800">{i.descricao}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">{fmt(i.valor)}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => toggleAtivo(i)} className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors">
                          {i.ativo
                            ? <><ToggleRight size={20} className="text-emerald-500" /><span className="text-emerald-600">Ativo</span></>
                            : <><ToggleLeft size={20} className="text-slate-400" /><span className="text-slate-400">Inativo</span></>
                          }
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => abrirFormRecorrencia(i)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => excluirRecorrencia(i.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}