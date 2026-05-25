import { StatCard } from './Badge';

export default function SalesOverview({ summary }) {
  if (!summary) return null;

  const { totals, bySystemRole, byProductCategory, lifecycleBreakdown } = summary;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tổng quan hệ thống</h2>
        <p className="text-sm text-slate-500 mt-1">Số liệu phục vụ đội Sales & Marketing</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Tổng SKU" value={totals.products} accent="text-brand-400" />
        <StatCard label="Đang bán chạy" value={totals.activeSelling} accent="text-emerald-400" />
        <StatCard label="Sắp ra mắt" value={totals.upcoming} accent="text-violet-400" />
        <StatCard label="Activation TB" value={`${totals.avgActivationRate}%`} accent="text-cyan-400" />
        <StatCard label="Offline TB" value={`${totals.avgOfflineRate}%`} accent="text-amber-400" />
        <StatCard label="Serial đăng ký" value={totals.serials} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Panel title="Vai trò hệ thống" items={bySystemRole} />
        <Panel title="Chủng loại thương mại" items={byProductCategory} />
        <Panel title="Trạng thái bán hàng" items={lifecycleBreakdown} />
      </div>
    </div>
  );
}

function Panel({ title, items }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
        {title}
      </h3>
      <div className="space-y-2">
        {(items || []).map((item) => (
          <div key={item.key || item.label} className="flex justify-between text-sm gap-2">
            <span className="text-slate-400 truncate">{item.label}</span>
            <span className="font-semibold text-slate-200 shrink-0">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
