import { useCallback, useEffect, useState } from 'react';
import { api, labelFor, lifecycleClass, tierClass } from '../api/client';
import { Badge } from './Badge';
import ProductFormModal from './ProductFormModal';
import TechSpecsTooltip, { ProductThumbnail } from './TechSpecsTooltip';

const FILTERS_INIT = {
  category: '',
  segment: '',
  tier: '',
  protocol: '',
  region: '',
  lifecycle: '',
  q: '',
};

export default function ProductMatrixList({ meta, onDataChange }) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(FILTERS_INIT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getProducts(filters);
      setProducts(res.items);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(payload, id) {
    setSaving(true);
    try {
      if (id) await api.updateProduct(id, payload);
      else await api.createProduct(payload);
      setMsg(id ? 'Đã cập nhật SKU' : 'Đã thêm SKU mới');
      await load();
      await onDataChange?.();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeprecate(p) {
    if (!confirm(`Khai tử (Deprecated) SKU ${p.commercialSku}?`)) return;
    await api.deprecateProduct(p.id);
    setMsg(`Đã khai tử ${p.commercialSku}`);
    await load();
    await onDataChange?.();
  }

  async function handleDelete(p) {
    if (!confirm(`Xóa vĩnh viễn SKU ${p.commercialSku}? Hành động không hoàn tác.`)) return;
    await api.deleteProduct(p.id);
    setMsg(`Đã xóa ${p.commercialSku}`);
    await load();
    await onDataChange?.();
  }

  const sel =
    'rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Danh Sách Ma Trận SKU</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ma trận 3 chiều + Danh mục · Ảnh · Thông số kỹ thuật động
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal('create')}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500"
        >
          + Thêm SKU Mới
        </button>
      </div>

      {msg && (
        <p className="rounded-lg border border-emerald-800/60 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
          {msg}
          <button type="button" className="ml-2 text-xs underline" onClick={() => setMsg(null)}>
            đóng
          </button>
        </p>
      )}

      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <span className="text-xs text-slate-500 self-center mr-1">Bộ lọc:</span>
        <select
          className={`${sel} max-w-[220px]`}
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="">Danh mục — Tất cả</option>
          {meta?.allCategories?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className={sel}
          value={filters.segment}
          onChange={(e) => setFilters((f) => ({ ...f, segment: e.target.value }))}
        >
          <option value="">Phân khúc — Tất cả</option>
          {meta?.segments?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className={sel}
          value={filters.tier}
          onChange={(e) => setFilters((f) => ({ ...f, tier: e.target.value }))}
        >
          <option value="">Tầng SP — Tất cả</option>
          {meta?.tiers?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className={sel}
          value={filters.protocol}
          onChange={(e) => setFilters((f) => ({ ...f, protocol: e.target.value }))}
        >
          <option value="">Giao thức — Tất cả</option>
          {meta?.protocols?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className={sel}
          value={filters.region}
          onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
        >
          <option value="">Vùng — Tất cả</option>
          {meta?.regions?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className={sel}
          value={filters.lifecycle}
          onChange={(e) => setFilters((f) => ({ ...f, lifecycle: e.target.value }))}
        >
          <option value="">Vòng đời — Tất cả</option>
          {meta?.lifecycles?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <input
          className={`${sel} min-w-[140px]`}
          placeholder="Tìm SKU, tên, brand..."
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
        <button
          type="button"
          className="text-xs text-slate-500 hover:text-slate-300"
          onClick={() => setFilters(FILTERS_INIT)}
        >
          Xóa lọc
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[1400px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-500 uppercase tracking-wide">
              <th className="px-2 py-2.5 w-12">Ảnh</th>
              <th className="px-3 py-2.5">SKU</th>
              <th className="px-3 py-2.5">Tên / Specs</th>
              <th className="px-3 py-2.5">Danh mục</th>
              <th className="px-3 py-2.5">Phân khúc</th>
              <th className="px-3 py-2.5">Tầng</th>
              <th className="px-3 py-2.5">Đế âm</th>
              <th className="px-3 py-2.5">Dây nguội</th>
              <th className="px-3 py-2.5">Brand</th>
              <th className="px-3 py-2.5">SW</th>
              <th className="px-3 py-2.5">Protocol</th>
              <th className="px-3 py-2.5">Vùng</th>
              <th className="px-3 py-2.5">Lifecycle</th>
              <th className="px-3 py-2.5">Activation %</th>
              <th className="px-3 py-2.5">Offline %</th>
              <th className="px-3 py-2.5">PCBA</th>
              <th className="px-3 py-2.5 sticky right-0 bg-slate-800/90">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={17} className="px-4 py-12 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={17} className="px-4 py-12 text-center text-slate-500">
                  Không có SKU phù hợp bộ lọc
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t border-slate-800/60 hover:bg-slate-800/30">
                  <td className="px-2 py-2">
                    <ProductThumbnail imageUrl={p.imageUrl} name={p.name} size={36} />
                  </td>
                  <td className="px-3 py-2 font-mono text-brand-400 whitespace-nowrap">
                    {p.commercialSku}
                  </td>
                  <td className="px-3 py-2 text-slate-300 max-w-[180px]">
                    <TechSpecsTooltip meta={meta} product={p}>
                      <span className="truncate block cursor-help border-b border-dotted border-slate-600 hover:text-brand-300">
                        {p.name}
                      </span>
                    </TechSpecsTooltip>
                  </td>
                  <td className="px-3 py-2 text-cyan-400/90 max-w-[140px]">
                    <span className="line-clamp-2">{labelFor(meta, 'category', p.category)}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-slate-300">
                      {labelFor(meta, 'segment', p.segment)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <Badge className={tierClass(meta, p.tier)}>
                      {labelFor(meta, 'tier', p.tier)}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-slate-400">
                    {labelFor(meta, 'mechanicalMount', p.mechanicalMount)}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        p.electricalNeutral === 'NO_NEUTRAL'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }
                    >
                      {labelFor(meta, 'electricalNeutral', p.electricalNeutral)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-400">{p.whiteLabelBrand}</td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        p.softwareFeature === 'SUBSCRIPTION' ? 'text-violet-400' : 'text-slate-500'
                      }
                    >
                      {labelFor(meta, 'softwareFeature', p.softwareFeature)}
                    </span>
                  </td>
                  <td className="px-3 py-2">{labelFor(meta, 'protocol', p.protocol)}</td>
                  <td className="px-3 py-2">{labelFor(meta, 'region', p.region)}</td>
                  <td className="px-3 py-2">
                    <Badge className={lifecycleClass(meta, p.lifecycle)}>
                      {labelFor(meta, 'lifecycle', p.lifecycle)}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <RateBar value={p.activationRate} good />
                  </td>
                  <td className="px-3 py-2">
                    <RateBar value={p.offlineRate} />
                  </td>
                  <td className="px-3 py-2 font-mono text-slate-500">{p.pcbaCode || '—'}</td>
                  <td className="px-3 py-2 sticky right-0 bg-slate-900/95 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setModal(p)}
                      className="rounded px-2 py-1 text-brand-400 hover:bg-slate-800"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeprecate(p)}
                      className="rounded px-2 py-1 text-amber-400 hover:bg-slate-800 ml-1"
                    >
                      Khai tử
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="rounded px-2 py-1 text-red-400 hover:bg-slate-800 ml-1"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-600">{products.length} SKU hiển thị · Dữ liệu lưu JSON backend</p>

      {modal && (
        <ProductFormModal
          meta={meta}
          product={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}

function RateBar({ value, good }) {
  const v = Number(value) || 0;
  const color = good
    ? v >= 85
      ? 'bg-emerald-500'
      : v >= 70
        ? 'bg-amber-500'
        : 'bg-red-500'
    : v <= 3
      ? 'bg-emerald-500'
      : v <= 6
        ? 'bg-amber-500'
        : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 min-w-[72px]">
      <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, v)}%` }} />
      </div>
      <span className="font-mono w-10 text-right">{v}%</span>
    </div>
  );
}
