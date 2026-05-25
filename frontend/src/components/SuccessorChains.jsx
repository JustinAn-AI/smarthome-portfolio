export default function SuccessorChains({ chains }) {
  if (!chains?.length) {
    return <p className="text-sm text-slate-500">Chưa có liên kết kế thừa (Successor).</p>;
  }

  return (
    <div className="space-y-3">
      {chains.map((c, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs text-slate-500">{c.from.sku}</p>
            <p className="text-sm text-slate-400 truncate">{c.from.name}</p>
            <span className="text-xs text-amber-400">{c.from.lifecycle}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <span className="text-lg">→</span>
          </div>
          <div className="min-w-0 flex-1 text-right">
            {c.to ? (
              <>
                <p className="font-mono text-xs text-brand-400">{c.to.sku}</p>
                <p className="text-sm text-slate-200 truncate">{c.to.name}</p>
                <span className="text-xs text-emerald-400">{c.to.lifecycle}</span>
              </>
            ) : (
              <span className="text-sm text-slate-600">—</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
