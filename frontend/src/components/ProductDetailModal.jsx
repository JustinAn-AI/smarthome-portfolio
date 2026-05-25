import { labelFor, lifecycleClass, formatSpecsSummary } from '../api/client';
import { Badge } from './Badge';
import { ProductThumbnail } from './SpecsTooltip';

export default function ProductDetailModal({ meta, product, onClose, onEdit }) {
  if (!product) return null;

  const specs = formatSpecsSummary(meta, product);
  const dim = product.dimensions || {};
  const dimStr =
    dim.widthMm || dim.heightMm || dim.depthMm
      ? `${dim.widthMm || '—'} × ${dim.heightMm || '—'} × ${dim.depthMm || '—'} mm`
      : 'Chưa cập nhật';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-600 bg-slate-900 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-700 bg-slate-900 px-6 py-4">
          <div className="flex gap-4 min-w-0">
            <ProductThumbnail imageUrl={product.imageUrl} name={product.name} size={80} />
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white leading-tight">{product.name}</h2>
              <p className="font-mono text-sm text-brand-400 mt-1">{product.commercialSku}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={lifecycleClass(meta, product.lifecycle)}>
                  {labelFor(meta, 'lifecycle', product.lifecycle)}
                </Badge>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Thông tin thương mại
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <Dt>Chủng loại</Dt>
              <Dd>{product.categoryDisplay || labelFor(meta, 'productCategory', product.productCategory)}</Dd>
              <Dt>Vai trò</Dt>
              <Dd>{labelFor(meta, 'systemRole', product.systemRole)}</Dd>
              <Dt>Giao thức</Dt>
              <Dd>{labelFor(meta, 'protocol', product.protocol)}</Dd>
              <Dt>Thị trường</Dt>
              <Dd>{labelFor(meta, 'region', product.region)}</Dd>
              {product.listPrice && (
                <>
                  <Dt>Giá tham khảo</Dt>
                  <Dd className="text-emerald-400 font-medium">{product.listPrice}</Dd>
                </>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
              Thông số bán hàng
            </h3>
            {specs.length ? (
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-200">
                {specs.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-brand-500">•</span>
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Chưa có thông số.</p>
            )}
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
              Kích thước & lắp đặt
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm mb-4">
              <Dt>Kích thước (R×C×S)</Dt>
              <Dd className="font-mono">{dimStr}</Dd>
              <Dt>Trọng lượng</Dt>
              <Dd>{product.weightG ? `${product.weightG} g` : '—'}</Dd>
            </dl>

            {(product.installationSteps || []).length > 0 && (
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-200 mb-4">
                {product.installationSteps.map((step, i) => (
                  <li key={i} className="pl-1 leading-relaxed">
                    {step.replace(/^Bước \d+:\s*/i, '')}
                  </li>
                ))}
              </ol>
            )}

            {product.wiringDiagramUrl && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Sơ đồ đấu dây</p>
                <img
                  src={product.wiringDiagramUrl}
                  alt="Sơ đồ đấu dây"
                  className="rounded-lg border border-slate-600 max-h-48 w-full object-contain bg-white/5"
                />
              </div>
            )}
          </section>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-700 bg-slate-900 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            Đóng
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onEdit(product);
                onClose();
              }}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold hover:bg-brand-500"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Dt({ children }) {
  return <dt className="text-slate-500">{children}</dt>;
}
function Dd({ children, className = '' }) {
  return <dd className={`text-slate-200 ${className}`}>{children}</dd>;
}
