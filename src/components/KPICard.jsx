export default function KPICard({ titulo, valor, subtitulo, cor = 'blue' }) {
  const cores = {
    blue: 'border-blue-500 bg-white hover:bg-blue-50/30',
    green: 'border-emerald-500 bg-white hover:bg-emerald-50/30',
    red: 'border-rose-500 bg-white hover:bg-rose-50/30',
    yellow: 'border-amber-500 bg-white hover:bg-amber-50/30',
  };

  const textCores = {
    blue: 'text-blue-600',
    green: 'text-emerald-600',
    red: 'text-rose-600',
    yellow: 'text-amber-600',
  };

  return (
    <div className={`rounded-2xl border border-slate-100 border-l-4 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${cores[cor]}`}>
      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{titulo}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <p className={`text-3xl font-black tracking-tight ${textCores[cor]}`}>{valor}</p>
      </div>
      {subtitulo && <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
        {subtitulo}
      </p>}
    </div>
  );
}
