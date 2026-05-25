import { useMemo, useState } from 'react';
import { ProductThumbnail } from './SpecsTooltip';

export default function InstallationDocs({ products, onView }) {
  const [q, setQ] = useState('');

  const withDocs = useMemo(() => {
    return products.filter((p) => {
      const hasSteps = (p.installationSteps || []).length > 0;
      const hasDiagram = !!p.wiringDiagramUrl;
      if (!hasSteps && !hasDiagram) return false;
      if (!q) return true;
      const term = q.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) || p.commercialSku.toLowerCase().includes(term)
      );
    });
  }, [products, q]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Tài liệu lắp đặt</h2>
        <p className="text-sm text-slate-500 mt-1">
          Hướng dẫn nhanh, kích thước và sơ đồ đấu dây — gửi khách / đại lý
        </p>
      </div>

      <input
        className="w-full max-w-md rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        placeholder="Tìm theo tên hoặc SKU..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="space-y-6">
        {withDocs.length === 0 ? (
          <p className="text-slate-500 py-12 text-center">Chưa có tài liệu lắp đặt.</p>
        ) : (
          withDocs.map((p) => {
            const dim = p.dimensions || {};
            return (
              <article
                key={p.id}
                className="rounded-2xl border border-slate-700 bg-slate-900/40 overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-4 border-b border-slate-800 px-5 py-4 bg-slate-800/30">
                  <ProductThumbnail imageUrl={p.imageUrl} name={p.name} size={56} />
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="font-semibold text-white">{p.name}</h3>
                    <p className="font-mono text-xs text-brand-400">{p.commercialSku}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onView?.(p)}
                    className="rounded-lg bg-slate-700 px-4 py-2 text-xs font-medium hover:bg-slate-600"
                  >
                    Xem chi tiết
                  </button>
                </div>
                <div className="p-5 grid gap-5 lg:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
                      Kích thước lắp đặt
                    </p>
                    <p className="text-sm text-slate-200 font-mono">
                      {dim.widthMm || '—'} × {dim.heightMm || '—'} × {dim.depthMm || '—'} mm
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Trọng lượng: {p.weightG ? `${p.weightG} g` : '—'}
                    </p>
                    {(p.installationSteps || []).length > 0 && (
                      <>
                        <p className="text-xs font-semibold uppercase text-slate-500 mt-4 mb-2">
                          Các bước lắp đặt
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
                          {p.installationSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </>
                    )}
                  </div>
                  {p.wiringDiagramUrl && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
                        Sơ đồ đấu dây
                      </p>
                      <img
                        src={p.wiringDiagramUrl}
                        alt="Wiring"
                        className="rounded-lg border border-slate-600 w-full max-h-56 object-contain bg-white/5"
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
