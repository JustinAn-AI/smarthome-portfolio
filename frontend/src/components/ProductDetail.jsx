import { labelFor, lifecycleClass, tierClass } from '../api/client';
import { Badge } from './Badge';

export default function ProductDetail({ meta, product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
          <h3 className="font-semibold">{product.name}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="space-y-4 p-5 text-sm">
          <p className="font-mono text-brand-400">{product.commercialSku}</p>
          <div className="flex flex-wrap gap-2">
            <Badge className={tierClass(meta, product.tier)}>
              {labelFor(meta, 'tier', product.tier)}
            </Badge>
            <Badge className={lifecycleClass(meta, product.lifecycle)}>
              {labelFor(meta, 'lifecycle', product.lifecycle)}
            </Badge>
          </div>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 rounded-lg object-cover border border-slate-700"
            />
          )}
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <dt className="text-slate-500">Danh mục</dt>
            <dd>{labelFor(meta, 'category', product.category)}</dd>
            <dt className="text-slate-500">Phân khúc</dt>
            <dd>{labelFor(meta, 'segment', product.segment)}</dd>
            <dt className="text-slate-500">Đế âm</dt>
            <dd>{labelFor(meta, 'mechanicalMount', product.mechanicalMount)}</dd>
            <dt className="text-slate-500">Dây nguội</dt>
            <dd>{labelFor(meta, 'electricalNeutral', product.electricalNeutral)}</dd>
            <dt className="text-slate-500">White-Label</dt>
            <dd>{product.whiteLabelBrand}</dd>
            <dt className="text-slate-500">Phần mềm</dt>
            <dd>{labelFor(meta, 'softwareFeature', product.softwareFeature)}</dd>
            <dt className="text-slate-500">Protocol</dt>
            <dd>{labelFor(meta, 'protocol', product.protocol)}</dd>
            <dt className="text-slate-500">Region</dt>
            <dd>{labelFor(meta, 'region', product.region)}</dd>
            <dt className="text-slate-500">Activation</dt>
            <dd className="text-emerald-400">{product.activationRate}%</dd>
            <dt className="text-slate-500">Offline</dt>
            <dd className="text-amber-400">{product.offlineRate}%</dd>
          </dl>
          {product.technicalSpecs && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Thông số kỹ thuật</p>
              <pre className="rounded-lg bg-slate-950 p-3 text-xs overflow-x-auto text-slate-300">
                {JSON.stringify(product.technicalSpecs, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
