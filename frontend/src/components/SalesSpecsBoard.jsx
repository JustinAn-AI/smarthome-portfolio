import { useMemo, useState } from 'react';
import { labelFor, formatSpecsSummary } from '../api/client';
import { ProductThumbnail } from './SpecsTooltip';

export default function SalesSpecsBoard({ meta, products, onView }) {
  const [category, setCategory] = useState('');

  const filtered = useMemo(() => {
    if (!category) return products;
    return products.filter((p) => p.productCategory === category);
  }, [products, category]);

  const sel =
    'rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none';

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Bảng thông số bán hàng</h2>
        <p className="text-sm text-slate-500 mt-1">
          Tổng hợp specs theo chủng loại — dùng khi tư vấn nhanh cho đại lý
        </p>
      </div>

      <select
        className={sel}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Tất cả chủng loại</option>
        {meta?.productCategories?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => {
          const lines = formatSpecsSummary(meta, p);
          const dim = p.dimensions || {};
          return (
            <article
              key={p.id}
              className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 hover:border-slate-600 transition"
            >
              <div className="flex gap-3">
                <ProductThumbnail imageUrl={p.imageUrl} name={p.name} size={52} />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-brand-400">{p.commercialSku}</p>
                  <h3 className="font-semibold text-slate-100 truncate">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {p.categoryDisplay || labelFor(meta, 'productCategory', p.productCategory)}
                  </p>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-300">
                {lines.map((l) => (
                  <li key={l}>• {l}</li>
                ))}
              </ul>
              {(dim.widthMm > 0 || p.weightG > 0) && (
                <p className="mt-2 text-xs text-cyan-400/90 font-mono">
                  {dim.widthMm}×{dim.heightMm}×{dim.depthMm} mm · {p.weightG}g
                </p>
              )}
              <button
                type="button"
                onClick={() => onView?.(p)}
                className="mt-3 text-xs text-brand-400 hover:underline"
              >
                Xem đầy đủ →
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
