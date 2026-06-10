import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Contratos() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/condominios')
      .then(res => setCondominios(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalMensal = condominios.reduce((acc, c) => acc + Number(c.honorarioMensal || 0), 0);
  const totalGarantidora = totalMensal * 0.04;
  const totalLiquido = totalMensal - totalGarantidora;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Contratos — Honorários</h2>

      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Bruto Mensal</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {totalMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-semibold uppercase">Custo Garantidora (4%)</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {totalGarantidora.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-semibold uppercase">Receita Líquida</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {totalLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Status de Recebimento por Condomínio</h3>
        {loading ? (
          <p className="text-slate-500 text-sm">Carregando...</p>
        ) : condominios.length === 0 ? (
          <p className="text-slate-400 text-sm">Nenhum contrato cadastrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="pb-2">Condomínio</th>
                <th className="pb-2">CNPJ</th>
                <th className="pb-2 text-right">Honorário</th>
                <th className="pb-2 text-right">Garantidora (4%)</th>
                <th className="pb-2 text-right">Líquido</th>
              </tr>
            </thead>
            <tbody>
              {condominios.map(c => {
                const bruto = Number(c.honorarioMensal || 0);
                const garantidora = bruto * 0.04;
                const liquido = bruto - garantidora;
                return (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-2 font-medium">{c.nome}</td>
                    <td className="py-2 text-slate-500">{c.cnpj}</td>
                    <td className="py-2 text-right">
                      {bruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-2 text-right text-red-600">
                      -{garantidora.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-2 text-right font-semibold text-green-700">
                      {liquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
