import { Badge } from './Badge';
import { labelFor, lifecycleClass } from '../api/client';

export default function SkuMatrix({ matrix, meta }) {
  if (!matrix?.length) {
    return (
      <p className="text-sm text-slate-500">Chưa có PCBA nào được liên kết SKU.</p>
    );
  }

  return (
    <div className="space-y-4">
      {matrix.map((row) => (
        <div
          key={row.pcbaCode}
          className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-800/50 px-4 py-3">
            <div>
              <span className="font-mono text-sm font-semibold text-brand-500">
                {row.pcbaCode}
              </span>
              <span className="ml-2 text-sm text-slate-300">{row.pcbaName}</span>
            </div>
            <Badge className="border-slate-700 bg-slate-800 text-slate-400">
              {row.skuCount} SKU
            </Badge>
          </div>

          <div className="px-4 py-2 border-b border-slate-800/80">
            <p className="text-xs text-slate-500 mb-2">Firmware bindings (theo Hardware rev)</p>
            <div className="flex flex-wrap gap-2">
              {(row.firmwareBindings || []).map((fb) => (
                <span
                  key={`${fb.hardwareVersion}-${fb.firmwareId}`}
                  className="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-cyan-400"
                >
                  {fb.hardwareVersion} → {fb.firmwareId}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-slate-500">
                  <th className="px-4 py-2 font-medium">SKU</th>
                  <th className="px-4 py-2 font-medium">Tên</th>
                  <th className="px-4 py-2 font-medium">Vùng</th>
                  <th className="px-4 py-2 font-medium">HW</th>
                  <th className="px-4 py-2 font-medium">Firmware</th>
                  <th className="px-4 py-2 font-medium">Phân khúc</th>
                  <th className="px-4 py-2 font-medium">Lifecycle</th>
                  <th className="px-4 py-2 font-medium">Activation</th>
                </tr>
              </thead>
              <tbody>
                {row.skus.map((sku) => (
                  <tr key={sku.id} className="border-t border-slate-800/60 hover:bg-slate-800/30">
                    <td className="px-4 py-2 font-mono text-brand-400">{sku.commercialSku}</td>
                    <td className="px-4 py-2 text-slate-300">{sku.name}</td>
                    <td className="px-4 py-2">{sku.regionLabel}</td>
                    <td className="px-4 py-2 font-mono text-xs">{sku.hardwareVersion}</td>
                    <td className="px-4 py-2 font-mono text-xs text-cyan-400">
                      {sku.firmwareId}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-400">
                      {sku.segmentLabel || labelFor(meta, 'segment', sku.segment)}
                    </td>
                    <td className="px-4 py-2">
                      <Badge className={lifecycleClass(meta, sku.lifecycle)}>
                        {labelFor(meta, 'lifecycle', sku.lifecycle)}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-emerald-400">
                      {sku.activationRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
