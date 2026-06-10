import { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import api from '../services/api';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({
    condominios: 0,
    unidades: 0,
    arrecadacao: 0,
    inadimplencia: '2.4%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [resCondos] = await Promise.all([
          api.get('/condominios')
        ]);
        
        const totalCondos = resCondos.data.length;
        const totalFaturamento = resCondos.data.reduce((acc, c) => acc + Number(c.honorarioMensal || 0), 0);
        
        setStats(prev => ({
          ...prev,
          condominios: totalCondos,
          arrecadacao: totalFaturamento
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Visão Geral</h2>
        <p className="text-slate-500 font-medium">Bem-vindo ao painel administrativo da sua administradora.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={item}>
          <KPICard 
            titulo="Condomínios" 
            valor={stats.condominios} 
            subtitulo="+2 este mês" 
            cor="blue" 
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard 
            titulo="Unidades Ativas" 
            valor="142" 
            subtitulo="98% ocupação" 
            cor="green" 
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard 
            titulo="Receita Mensal" 
            valor={stats.arrecadacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
            subtitulo="Previsão de fechamento" 
            cor="yellow" 
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard 
            titulo="Inadimplência" 
            valor={stats.inadimplencia} 
            subtitulo="Abaixo da média" 
            cor="red" 
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Evolução de Receita
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Últimos 6 meses</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-4">
             {[45, 52, 48, 61, 58, 72].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                   <div 
                     className="w-full bg-slate-50 rounded-t-xl group-hover:bg-blue-600 transition-all duration-500 relative cursor-pointer" 
                     style={{ height: `${h}%` }}
                   >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        R$ {(h * 100).toLocaleString()}
                     </div>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Mês {i + 1}</span>
                </div>
             ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" /> 
              Atalhos Rápidos
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors text-sm font-bold group">
                Emitir Boletos Garantidora
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors text-sm font-bold group">
                Relatório de Inadimplência
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold text-indigo-200 uppercase mb-1 tracking-widest">Suporte VIP</p>
              <h4 className="text-xl font-black mb-4">Precisa de ajuda com o fechamento?</h4>
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl text-sm font-black hover:scale-105 transition-transform shadow-lg">
                Falar com Consultor
              </button>
            </div>
            <ArrowUpRight className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
