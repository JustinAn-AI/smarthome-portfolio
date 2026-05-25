import { useState } from 'react';
import { labelFor } from '../api/client';

function formatSpecLine(field, value) {
  if (value === undefined || value === null || value === '') return null;
  const unit = field.unit ? ` ${field.unit}` : '';
  let display = value;
  if (field.type === 'boolean') display = value ? 'Có' : 'Không';
  if (field.type === 'select') {
    const opt = (field.options || []).find((o) => o.value === value);
    display = opt?.label ?? value;
  }
  return (
    <div key={field.key} className="flex justify-between gap-4 text-xs">
      <span className="text-slate-500 shrink-0">{field.label}</span>
      <span className="text-slate-200 text-right font-mono">
        {display}
        {field.type === 'number' && field.unit ? unit : ''}
      </span>
    </div>
  );
}

export default function TechSpecsTooltip({ meta, product, children }) {
  const [open, setOpen] = useState(false);
  const fields = meta?.techSpecFields?.[product.category] || [];
  const specs = product.technicalSpecs || {};

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-xl pointer-events-none"
          role="tooltip"
        >
          <p className="text-xs font-semibold text-brand-400 mb-2">
            {labelFor(meta, 'category', product.category)}
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {fields.length === 0 ? (
              <p className="text-xs text-slate-500">Chưa có thông số.</p>
            ) : (
              fields.map((f) => formatSpecLine(f, specs[f.key])).filter(Boolean)
            )}
          </div>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt=""
              className="mt-2 h-20 w-full rounded object-cover opacity-90"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
      )}
    </span>
  );
}

export function ProductThumbnail({ imageUrl, name, size = 40 }) {
  const [err, setErr] = useState(false);
  const px = `${size}px`;

  if (err || !imageUrl) {
    return (
      <div
        className="rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-600 text-xs shrink-0"
        style={{ width: px, height: px }}
        title={name}
      >
        📦
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className="rounded-lg object-cover border border-slate-700 shrink-0 bg-slate-800"
      style={{ width: px, height: px }}
      onError={() => setErr(true)}
    />
  );
}
