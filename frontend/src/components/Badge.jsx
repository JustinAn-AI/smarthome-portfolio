export function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export function StatCard({ label, value, sub, accent = 'text-brand-500' }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
