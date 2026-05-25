import { ProductThumbnail } from './SpecsTooltip';

export default function ReplacementRoadmap({ roadmap }) {
  if (!roadmap?.length) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p>Chưa có lộ trình thay thế sản phẩm.</p>
        <p className="text-xs mt-2">Liên kết mẫu cũ → mẫu mới trong dữ liệu sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Lộ trình thay thế</h2>
        <p className="text-sm text-slate-500 mt-1">
          Sơ đồ nâng cấp cho Sales tư vấn: Mẫu cũ → Mẫu mới thay thế
        </p>
      </div>

      <div className="space-y-4">
        {roadmap.map((row, i) => (
          <div
            key={i}
            className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center rounded-xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <ProductCard side="from" data={row.from} />
            <div className="flex flex-col items-center text-slate-500 px-2">
              <span className="text-2xl">→</span>
              <span className="text-xs mt-1 text-center">Thay thế bởi</span>
            </div>
            <ProductCard side="to" data={row.to} highlight />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ data, highlight }) {
  if (!data) {
    return <div className="text-sm text-slate-600 italic">—</div>;
  }

  return (
    <div
      className={`flex gap-3 rounded-lg p-3 ${
        highlight ? 'bg-emerald-950/30 border border-emerald-800/50' : 'bg-slate-800/40 border border-slate-700/50'
      }`}
    >
      <ProductThumbnail imageUrl={data.imageUrl} name={data.name} size={56} />
      <div className="min-w-0">
        <p className="font-mono text-xs text-brand-400">{data.sku}</p>
        <p className="font-medium text-slate-200 truncate">{data.name}</p>
        <p className="text-xs text-slate-500 mt-1">{data.categoryDisplay}</p>
        <span
          className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${
            highlight ? 'bg-emerald-900/50 text-emerald-300' : 'bg-amber-900/40 text-amber-300'
          }`}
        >
          {data.lifecycleLabel}
        </span>
      </div>
    </div>
  );
}
