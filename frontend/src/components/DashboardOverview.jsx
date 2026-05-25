import { StatCard } from './Badge';

export default function DashboardOverview({ summary }) {
  if (!summary) return null;

  const { totals, lifecycleStats, bySegment, byTier, byCategory } = summary;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <StatCard label="Sản phẩm" value={totals.products} />
        <StatCard label="PCBA" value={totals.pcba} accent="text-cyan-400" />
        <StatCard
          label="Activation TB"
          value={`${totals.avgActivationRate ?? 0}%`}
          accent="text-emerald-400"
        />
        <StatCard
          label="Offline TB"
          value={`${totals.avgOfflineRate ?? 0}%`}
          accent="text-amber-400"
        />
        <StatCard label="Serial" value={totals.serials} accent="text-violet-400" />
        <StatCard
          label="Đã kích hoạt"
          value={totals.activatedSerials}
          accent="text-emerald-400"
        />
        <StatCard label="Bị block" value={totals.blockedSerials} accent="text-red-400" />
        <StatCard label="Activations" value={totals.activations} accent="text-slate-400" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:col-span-2">
          <h4 className="text-xs font-semibold uppercase text-cyan-500 mb-3">
            Danh mục chuyên sâu
          </h4>
          <div className="grid gap-1 sm:grid-cols-2 max-h-48 overflow-y-auto">
            {(byCategory || []).map((c) => (
              <div key={c.category} className="flex justify-between text-sm gap-2 py-0.5">
                <span className="text-slate-400 truncate text-xs">{c.label}</span>
                <span className="font-medium shrink-0">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h4 className="text-xs font-semibold uppercase text-slate-500 mb-3">
            Chiều ngang — Phân khúc
          </h4>
          <div className="space-y-2">
            {(bySegment || []).map((s) => (
              <div key={s.segment} className="flex justify-between text-sm gap-2">
                <span className="text-slate-400 truncate">{s.label}</span>
                <span className="font-medium shrink-0">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h4 className="text-xs font-semibold uppercase text-slate-500 mb-3">Vòng đời</h4>
          <div className="space-y-2">
            {Object.entries(lifecycleStats || {}).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-slate-400">{k.replace('_', ' ')}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h4 className="text-xs font-semibold uppercase text-slate-500 mb-3">Tầng sản phẩm</h4>
          <div className="space-y-2">
            {(byTier || []).map((t) => (
              <div key={t.tier} className="flex justify-between text-sm gap-2">
                <span className="text-slate-400 truncate">{t.label}</span>
                <span className="font-medium shrink-0">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
