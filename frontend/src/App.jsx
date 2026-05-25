import { useCallback, useEffect, useState } from 'react';
import { api } from './api/client';
import { useMeta } from './hooks/useMeta';
import SalesOverview from './components/SalesOverview';
import SalesProductList from './components/SalesProductList';
import SalesSpecsBoard from './components/SalesSpecsBoard';
import InstallationDocs from './components/InstallationDocs';
import ReplacementRoadmap from './components/ReplacementRoadmap';
import SerialRegionCheck from './components/SerialRegionCheck';
import ProductDetailModal from './components/ProductDetailModal';

const TABS = [
  { id: 'overview', label: 'Tổng quan hệ thống' },
  { id: 'products', label: 'Danh sách sản phẩm' },
  { id: 'specs-board', label: 'Bảng thông số bán hàng' },
  { id: 'install-docs', label: 'Tài liệu lắp đặt' },
  { id: 'roadmap', label: 'Lộ trình thay thế' },
  { id: 'serial', label: 'Kiểm tra Serial & Vùng' },
];

export default function App() {
  const { meta, ready, error: metaError } = useMeta();
  const [tab, setTab] = useState('products');
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [detailProduct, setDetailProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sum, prodRes] = await Promise.all([api.getSummary(), api.getProducts()]);
      setSummary(sum);
      setProducts(prodRes.items);
    } catch (e) {
      setError(e.message.includes('fetch') ? 'Không kết nối API. Chạy: npm run dev' : e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Smart Home Sales Catalog</h1>
              <p className="text-xs text-slate-500 mt-0.5">Kinh doanh & Marketing</p>
            </div>
            <button
              type="button"
              onClick={load}
              className="rounded-xl border border-slate-600 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Làm mới
            </button>
          </div>
          <nav className="flex gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-thin">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition ${
                  tab === t.id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-900/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {(error || metaError) && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
            {error || metaError}
          </div>
        )}

        {loading || !ready ? (
          <p className="text-center text-slate-500 py-24">Đang tải dữ liệu...</p>
        ) : (
          <>
            {tab === 'overview' && <SalesOverview summary={summary} />}
            {tab === 'products' && (
              <SalesProductList meta={meta} onDataChange={load} onViewProduct={setDetailProduct} />
            )}
            {tab === 'specs-board' && (
              <SalesSpecsBoard
                meta={meta}
                products={products}
                onView={setDetailProduct}
              />
            )}
            {tab === 'install-docs' && (
              <InstallationDocs products={products} onView={setDetailProduct} />
            )}
            {tab === 'roadmap' && (
              <ReplacementRoadmap roadmap={summary?.replacementRoadmap} />
            )}
            {tab === 'serial' && <SerialRegionCheck />}
          </>
        )}
      </main>

      {detailProduct && meta && (
        <ProductDetailModal
          meta={meta}
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}
    </div>
  );
}
