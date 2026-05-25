import { useCallback, useEffect, useState } from 'react';
import { api, labelFor, lifecycleClass, formatSpecsSummary } from '../api/client';
import { Badge } from './Badge';
import SalesProductForm from './SalesProductForm';
import ProductDetailModal from './ProductDetailModal';
import SpecsTooltip, { ProductThumbnail } from './SpecsTooltip';

const FILTERS = { systemRole: '', productCategory: '', q: '' };

export default function SalesProductList({ meta, onDataChange, onViewProduct }) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(FILTERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState('');

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
      setToast(id ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
      await load();
      await onDataChange?.();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeprecate(p) {
    if (!confirm(`Đánh dấu "${p.name}" là Đã khai tử?`)) return;
    await api.deprecateProduct(p.id);
    setToast('Đã khai tử sản phẩm');
    await load();
    await onDataChange?.();
  }

  async function handleDelete(p) {
    if (!confirm(`Xóa "${p.name}" khỏi danh mục?`)) return;
    await api.deleteProduct(p.id);
    setToast('Đã xóa');
    await load();
    await onDataChange?.();
  }

  function openDetail(p) {
    setDetail(p);
    onViewProduct?.(p);
  }

  const sel =
    'rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm min-w-[200px] focus:border-brand-500 focus:outline-none';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Danh sách sản phẩm</h2>
          <p className="text-sm text-slate-500 mt-1">Catalog Sales — CRUD & xem chi tiết</p>
        </div>
        <button
          type="button"
          onClick={() => setModal('create')}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 hover:bg-brand-500"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {toast && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200 flex justify-between items-center">
          <span>{toast}</span>
          <button type="button" className="text-xs underline opacity-80" onClick={() => setToast('')}>
            đóng
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-700">
        <span className="text-xs font-semibold text-slate-500 uppercase">Lọc</span>
        <select
          className={sel}
          value={filters.systemRole}
          onChange={(e) => setFilters((f) => ({ ...f, systemRole: e.target.value }))}
        >
          <option value="">Vai trò hệ thống — Tất cả</option>
          {meta?.systemRoles?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className={sel}
          value={filters.productCategory}
          onChange={(e) => setFilters((f) => ({ ...f, productCategory: e.target.value }))}
        >
          <option value="">Chủng loại thương mại — Tất cả</option>
          {meta?.productCategories?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <input
          className={`${sel} flex-1 min-w-[180px]`}
          placeholder="Tìm SKU, tên..."
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full min-w-[1000px] text-sm text-left">
          <thead>
            <tr className="text-xs uppercase text-slate-500 bg-slate-800/80 border-b border-slate-700">
              <th className="px-4 py-3 w-14">Ảnh</th>
              <th className="px-4 py-3">Tên / Specs</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Chủng loại</th>
              <th className="px-4 py-3">Giao thức</th>
              <th className="px-4 py-3">Thị trường</th>
              <th className="px-4 py-3">Trạng thái BH</th>
              <th className="px-4 py-3 text-right sticky right-0 bg-slate-800/95">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-500">
                  Không có sản phẩm
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <ProductThumbnail imageUrl={p.imageUrl} name={p.name} size={44} />
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <SpecsTooltip meta={meta} product={p}>
                      <span className="font-medium text-slate-200 cursor-help border-b border-dotted border-slate-600">
                        {p.name}
                      </span>
                    </SpecsTooltip>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-brand-400">{p.commercialSku}</td>
                  <td className="px-4 py-3 text-xs">{p.categoryDisplay}</td>
                  <td className="px-4 py-3 text-xs">{labelFor(meta, 'protocol', p.protocol)}</td>
                  <td className="px-4 py-3 text-xs">{labelFor(meta, 'region', p.region)}</td>
                  <td className="px-4 py-3">
                    <Badge className={lifecycleClass(meta, p.lifecycle)}>
                      {labelFor(meta, 'lifecycle', p.lifecycle)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 sticky right-0 bg-slate-900/98 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="text-slate-300 hover:text-white text-xs font-medium mr-3"
                      onClick={() => openDetail(p)}
                    >
                      Xem chi tiết
                    </button>
                    <button
                      type="button"
                      className="text-brand-400 hover:underline text-xs mr-3"
                      onClick={() => setModal(p)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="text-amber-400/90 hover:underline text-xs mr-2"
                      onClick={() => handleDeprecate(p)}
                    >
                      Khai tử
                    </button>
                    <button
                      type="button"
                      className="text-red-400/90 hover:underline text-xs"
                      onClick={() => handleDelete(p)}
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

      {modal && (
        <SalesProductForm
          meta={meta}
          product={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {detail && (
        <ProductDetailModal
          meta={meta}
          product={detail}
          onClose={() => setDetail(null)}
          onEdit={(p) => setModal(p)}
        />
      )}
    </div>
  );
}
